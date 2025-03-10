import { NextRequest, NextResponse } from 'next/server';

// Простые учетные данные для входа
const ADMIN_CREDENTIALS = {
  email: '123',
  password: '456'
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Проверка учетных данных
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // В реальном приложении здесь должна быть настоящая сессия
      return NextResponse.json({ 
        success: true,
        message: 'Успешная аутентификация'
      });
    }

    return NextResponse.json(
      { error: 'Неверный логин или пароль' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    );
  }
} 