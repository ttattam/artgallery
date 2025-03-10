import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

// GET /api/artworks/[id] - Получить работу по ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const artwork = await Artwork.findById(params.id)
      .populate('categories', 'name');
    
    if (!artwork) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Ошибка при получении работы:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении работы' },
      { status: 500 }
    );
  }
}

// PUT /api/artworks/[id] - Обновить работу
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    
    // Валидация обязательных полей
    if (!data.title || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Название и изображение обязательны' },
        { status: 400 }
      );
    }

    const artwork = await Artwork.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('categories', 'name');

    if (!artwork) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artwork);
  } catch (error: any) {
    console.error('Ошибка при обновлении работы:', error);
    
    // Проверяем ошибки валидации
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: 'Ошибка валидации', validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Ошибка при обновлении работы' },
      { status: 500 }
    );
  }
}

// DELETE /api/artworks/[id] - Удалить работу
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const artwork = await Artwork.findByIdAndDelete(params.id);
    
    if (!artwork) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении работы:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении работы' },
      { status: 500 }
    );
  }
} 