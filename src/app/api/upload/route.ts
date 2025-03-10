import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // В реальном проекте здесь будет загрузка файла на сервер или в облачное хранилище
    // Для демонстрации просто возвращаем тестовый URL
    const imageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
} 