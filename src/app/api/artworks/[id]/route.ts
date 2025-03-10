import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/artworks/[id] - Получить произведение искусства по ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    const artwork = await Artwork.findById(id);
    
    if (!artwork) {
      return NextResponse.json(
        { error: 'Произведение искусства не найдено' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Ошибка при получении произведения искусства:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении произведения искусства' },
      { status: 500 }
    );
  }
}

// PUT /api/artworks/[id] - Обновить произведение искусства
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await req.json();
    
    const artwork = await Artwork.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!artwork) {
      return NextResponse.json(
        { error: 'Произведение искусства не найдено' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artwork);
  } catch (error: any) {
    console.error('Ошибка при обновлении произведения искусства:', error);
    
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
    
    return NextResponse.json(
      { error: 'Ошибка при обновлении произведения искусства' },
      { status: 500 }
    );
  }
}

// DELETE /api/artworks/[id] - Удалить произведение искусства
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    const artwork = await Artwork.findByIdAndDelete(id);
    
    if (!artwork) {
      return NextResponse.json(
        { error: 'Произведение искусства не найдено' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Произведение искусства успешно удалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении произведения искусства:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении произведения искусства' },
      { status: 500 }
    );
  }
} 