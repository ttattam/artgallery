import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

// Временное хранилище работ (в реальном проекте будет база данных)
let artworks = [
  {
    _id: '1',
    title: 'Граффити "Новая эра"',
    description: 'Масштабное граффити на фасаде здания, отражающее современную городскую культуру',
    imageUrl: 'https://images.unsplash.com/photo-1569230516306-5a8cb5586399',
    categories: ['1'], // ID категории "Граффити и муралы"
    year: 2024,
    technique: 'Аэрозольная краска',
    dimensions: '6x12 м',
    price: '150000',
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Цифровой портрет "Будущее"',
    description: 'Цифровая иллюстрация, исследующая тему технологий и человечности',
    imageUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a',
    categories: ['2'], // ID категории "Диджитал-арт"
    year: 2024,
    technique: 'Digital Art',
    dimensions: '4000x6000 px',
    price: '45000',
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

// GET /api/artworks - Получить все работы
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    // Формируем условия фильтрации
    const query: any = {};
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.categories = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Получаем отфильтрованные работы
    const artworks = await Artwork.find(query)
      .sort({ createdAt: -1 })
      .populate('categories', 'name');
    
    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Ошибка при получении работ:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении работ' },
      { status: 500 }
    );
  }
}

// POST /api/artworks - Создать новую работу
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    const artwork = new Artwork(data);
    await artwork.save();
    
    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании работы:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании работы' },
      { status: 500 }
    );
  }
} 