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
    
    const categories = await Category.find().sort({ order: 1, name: 1 });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Добавить новую категорию
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      );
    }

    // Создаем slug из названия
    const slug = data.name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    const newCategory = {
      _id: Date.now().toString(),
      name: data.name,
      slug,
    };

    await Category.create(newCategory);

    return NextResponse.json(newCategory);
  } catch (error: any) {
    console.error('Ошибка при создании категории:', error);
    
    // Проверяем, является ли ошибка ошибкой валидации Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      // Формируем объект с ошибками валидации
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: 'Ошибка валидации', validationErrors },
        { status: 400 }
      );
    }
    
    // Проверяем, является ли ошибка ошибкой дублирования (уникальное поле)
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

// Удаление категории
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID категории обязателен' },
        { status: 400 }
      );
    }

    const index = categories.findIndex(cat => cat._id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    categories = categories.filter(cat => cat._id !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    );
  }
} 