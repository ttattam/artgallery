import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Пожалуйста, укажите название категории'],
      trim: true,
      unique: true,
      maxlength: [50, 'Название не может быть длиннее 50 символов'],
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Создаем slug из названия категории перед сохранением
CategorySchema.pre('validate', function(this: any, next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Проверяем, существует ли уже модель, чтобы избежать ошибки переопределения
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 