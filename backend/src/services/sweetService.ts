import { Sweet, ISweet } from '../models/Sweet.js';
import mongoose from 'mongoose';

export interface CreateSweetPayload {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetPayload {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export const createSweet = async (payload: CreateSweetPayload): Promise<ISweet> => {
  if (payload.price < 0) {
    throw new Error('Price cannot be negative');
  }
  if (payload.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  const sweet = new Sweet(payload);
  return sweet.save();
};

export const getAllSweets = async (
  page: number = 1,
  limit: number = 10
): Promise<{ sweets: ISweet[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const sweets = await Sweet.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Sweet.countDocuments();
  const pages = Math.ceil(total / limit);

  return { sweets, total, pages };
};

export const searchSweets = async (
  query: string,
  priceMin?: number,
  priceMax?: number
): Promise<ISweet[]> => {
  const filter: Record<string, unknown> = {};

  if (query) {
    filter.$text = { $search: query };
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) (filter.price as Record<string, number>).$gte = priceMin;
    if (priceMax !== undefined) (filter.price as Record<string, number>).$lte = priceMax;
  }

  return Sweet.find(filter);
};

export const getSweetById = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }
  return Sweet.findById(id);
};

export const updateSweet = async (id: string, payload: UpdateSweetPayload): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }

  if (payload.price !== undefined && payload.price < 0) {
    throw new Error('Price cannot be negative');
  }
  if (payload.quantity !== undefined && payload.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  return Sweet.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

export const deleteSweet = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }
  return Sweet.findByIdAndDelete(id);
};

export const purchaseSweet = async (id: string, quantity: number): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }

  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new Error('Sweet not found');
  }

  if (sweet.quantity < quantity) {
    throw new Error('Insufficient quantity available');
  }

  sweet.quantity -= quantity;
  return sweet.save();
};

export const restockSweet = async (id: string, quantity: number): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }

  if (quantity <= 0) {
    throw new Error('Restock quantity must be greater than 0');
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new Error('Sweet not found');
  }

  sweet.quantity += quantity;
  return sweet.save();
};
