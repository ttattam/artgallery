import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

// GET /api/artworks - Получить все произведения искусства
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Получаем параметры запроса
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0;
    
    // Формируем запрос
    let query: any = {};
    
    if (category) {
      query.categories = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Выполняем запрос к базе данных
    let artworksQuery = Artwork.find(query).sort({ createdAt: -1 });
    
    if (limit > 0) {
      artworksQuery = artworksQuery.limit(limit);
    }
    
    const artworks = await artworksQuery;
    
    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Ошибка при получении произведений искусства:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении произведений искусства' },
      { status: 500 }
    );
  }
}

// POST /api/artworks - Добавить новое произведение искусства
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Получаем данные из запроса
    const data = await req.json();
    
    // Создаем новое произведение искусства
    const artwork = await Artwork.create(data);
    
    return NextResponse.json(artwork, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании произведения искусства:', error);
    
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
      { error: 'Ошибка при создании произведения искусства' },
      { status: 500 }
    );
  }
} 