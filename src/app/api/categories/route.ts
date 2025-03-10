import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

// Временное хранилище категорий
let categories = [
  { 
    _id: '1', 
    name: 'Граффити и муралы', 
    slug: 'graffiti-murals',
    description: 'Оформление стен, фасадов зданий и других поверхностей'
  },
  { 
    _id: '2', 
    name: 'Диджитал-арт', 
    slug: 'digital-art',
    description: 'Цифровые иллюстрации, NFT, концепт-арт'
  },
  { 
    _id: '3', 
    name: 'Брендинг и айдентика', 
    slug: 'branding',
    description: 'Логотипы, фирменный стиль, визуальные коммуникации'
  },
  { 
    _id: '4', 
    name: 'Оформление интерьеров', 
    slug: 'interior-design',
    description: 'Роспись стен, декоративные элементы, инсталляции'
  },
  { 
    _id: '5', 
    name: 'Ивент-дизайн', 
    slug: 'event-design',
    description: 'Оформление мероприятий, выставок, презентаций'
  },
  { 
    _id: '6', 
    name: 'Иллюстрация', 
    slug: 'illustration',
    description: 'Книжная иллюстрация, рекламная графика, принты'
  },
  { 
    _id: '7', 
    name: 'Традиционное искусство', 
    slug: 'traditional-art',
    description: 'Живопись, графика, скульптура'
  },
  { 
    _id: '8', 
    name: 'Стрит-арт', 
    slug: 'street-art',
    description: 'Уличное искусство, инсталляции в городской среде'
  },
  { 
    _id: '9', 
    name: 'Коммерческие проекты', 
    slug: 'commercial',
    description: 'Оформление торговых пространств, витрин, вывесок'
  }
];

// GET /api/categories - Получить все категории
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Создать новую категорию
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Проверяем обязательные поля
    if (!data.name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      );
    }
    
    const category = new Category(data);
    await category.save();
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании категории:', error);
    
    // Проверяем ошибку дубликата
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Категория с таким названием уже существует' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Удалить категорию
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'ID категории не указан' },
        { status: 400 }
      );
    }
    
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Категория успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    );
  }
}

// Обновление категории
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data._id || !data.name) {
      return NextResponse.json(
        { error: 'ID и название категории обязательны' },
        { status: 400 }
      );
    }

    const index = categories.findIndex(cat => cat._id === data._id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    // Обновляем slug если изменилось название
    const slug = data.name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    categories[index] = {
      ...categories[index],
      name: data.name,
      slug,
    };

    return NextResponse.json(categories[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении категории' },
      { status: 500 }
    );
  }
} 