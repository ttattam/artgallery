import mongoose, { Schema, Document } from 'mongoose';

export interface IArtwork extends Document {
  title: string;
  description: string;
  imageUrl: string;
  categories: string[];
  year: number;
  technique: string;
  dimensions: string;
  price?: number;
  isSold: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Пожалуйста, укажите название работы'],
      trim: true,
      maxlength: [100, 'Название не может быть длиннее 100 символов'],
    },
    description: {
      type: String,
      required: [true, 'Пожалуйста, добавьте описание работы'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Пожалуйста, добавьте изображение работы'],
    },
    categories: {
      type: [String],
      required: [true, 'Пожалуйста, выберите хотя бы одну категорию'],
    },
    year: {
      type: Number,
      required: [true, 'Пожалуйста, укажите год создания'],
    },
    technique: {
      type: String,
      required: [true, 'Пожалуйста, укажите технику исполнения'],
      trim: true,
    },
    dimensions: {
      type: String,
      required: [true, 'Пожалуйста, укажите размеры работы'],
      trim: true,
    },
    price: {
      type: Number,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Проверяем, существует ли уже модель, чтобы избежать ошибки переопределения
export default mongoose.models.Artwork || mongoose.model<IArtwork>('Artwork', ArtworkSchema); 