import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function POST() {
  try {
    await connectToDatabase();
    
    // Удаляем все существующие категории
    await Category.deleteMany({});
    
    return NextResponse.json({ 
      message: 'Все категории успешно удалены'
    });
  } catch (error) {
    console.error('Ошибка при сбросе категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при сбросе категорий' },
      { status: 500 }
    );
  }
} 