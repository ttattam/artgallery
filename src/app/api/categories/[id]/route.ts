import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/categories/[id] - Получить категорию по ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категории' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Обновить категорию
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await req.json();
    
    const category = await Category.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Ошибка при обновлении категории:', error);
    
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
      { error: 'Ошибка при обновлении категории' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Удалить категорию
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Категория успешно удалена' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    );
  }
} 