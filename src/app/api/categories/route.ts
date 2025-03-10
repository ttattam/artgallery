import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

const defaultCategories = [
  {
    name: 'Живопись',
    description: 'Картины, написанные маслом, акрилом и другими красками'
  },
  {
    name: 'Графика',
    description: 'Рисунки карандашом, тушью, пастелью'
  },
  {
    name: 'Скульптура',
    description: 'Трехмерные произведения искусства'
  },
  {
    name: 'Фотография',
    description: 'Художественная и документальная фотография'
  },
  {
    name: 'Цифровое искусство',
    description: 'Произведения, созданные с помощью компьютерных технологий'
  },
  {
    name: 'Инсталляция',
    description: 'Пространственные композиции из различных материалов'
  },
  {
    name: 'Акварель',
    description: 'Картины, написанные акварельными красками'
  },
  {
    name: 'Портрет',
    description: 'Изображения людей в различных техниках'
  },
  {
    name: 'Пейзаж',
    description: 'Изображения природы и городских видов'
  },
  {
    name: 'Абстракция',
    description: 'Беспредметное искусство, основанное на цвете и форме'
  },
  {
    name: 'Граффити - Оформление фасадов',
    description: 'Художественное оформление внешних стен зданий и сооружений'
  },
  {
    name: 'Граффити - Интерьерный дизайн',
    description: 'Художественное оформление внутренних помещений в стиле граффити'
  },
  {
    name: 'Стикеры Telegram',
    description: 'Разработка наборов стикеров для мессенджера Telegram'
  },
  {
    name: 'Брендинг',
    description: 'Разработка логотипов, фирменного стиля и брендбуков'
  }
];

// GET /api/categories - Получить все категории
export async function GET() {
  try {
    await connectToDatabase();
    
    // Проверяем, есть ли категории в базе
    const existingCategories = await Category.find();
    
    // Если категорий нет, создаем базовые
    if (existingCategories.length === 0) {
      await Category.insertMany(defaultCategories);
      return NextResponse.json(await Category.find().sort({ name: 1 }));
    }
    
    // Возвращаем существующие категории
    return NextResponse.json(existingCategories.sort((a, b) => a.name.localeCompare(b.name)));
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