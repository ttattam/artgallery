import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

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
    
    // Получаем данные из запроса
    const data = await req.json();
    
    // Создаем новую категорию
    const category = await Category.create(data);
    
    return NextResponse.json(category, { status: 201 });
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