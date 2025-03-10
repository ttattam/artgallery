import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });
    
    return NextResponse.json({ 
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    console.error('Ошибка при проверке категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке категорий' },
      { status: 500 }
    );
  }
} 