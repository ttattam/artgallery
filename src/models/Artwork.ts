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
      trim: true,
      maxlength: [100, 'Название не может быть длиннее 100 символов'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    categories: {
      type: [String],
    },
    year: {
      type: Number,
    },
    technique: {
      type: String,
      trim: true,
    },
    dimensions: {
      type: String,
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