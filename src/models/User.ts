import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Пожалуйста, укажите имя'],
      trim: true,
      maxlength: [50, 'Имя не может быть длиннее 50 символов'],
    },
    email: {
      type: String,
      required: [true, 'Пожалуйста, укажите email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Пожалуйста, укажите корректный email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Пожалуйста, укажите пароль'],
      minlength: [6, 'Пароль должен содержать минимум 6 символов'],
      select: false, // Не включать пароль в результаты запросов
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function(this: any, next) {
  // Хешируем пароль только если он был изменен или это новый пользователь
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error as any);
  }
};

// Проверяем, существует ли уже модель, чтобы избежать ошибки переопределения
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 