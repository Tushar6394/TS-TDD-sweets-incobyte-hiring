import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  CreateSweetPayload,
  UpdateSweetPayload,
} from '../services/sweetService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const payload: CreateSweetPayload = req.body;

    if (!payload.name || !payload.category || payload.price === undefined || payload.quantity === undefined) {
      res.status(400).json({ error: 'Name, category, price, and quantity are required' });
      return;
    }

    const sweet = await createSweet(payload);
    res.status(201).json(sweet);
  }
);

export const getAllSweetsHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllSweets(page, limit);
    res.status(200).json(result);
  }
);

export const searchSweetsHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const priceMin = req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined;
    const priceMax = req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined;

    const sweets = await searchSweets(query, priceMin, priceMax);
    res.status(200).json({ sweets, count: sweets.length });
  }
);

export const getSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const sweet = await getSweetById(req.params.id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  }
);

export const updateSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const payload: UpdateSweetPayload = req.body;
    const sweet = await updateSweet(req.params.id, payload);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  }
);

export const deleteSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const sweet = await deleteSweet(req.params.id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(200).json({ message: 'Sweet deleted successfully', sweet });
  }
);

export const purchaseSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    const sweet = await purchaseSweet(req.params.id, quantity);
    res.status(200).json({
      message: 'Purchase successful',
      sweet,
    });
  }
);

export const restockSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    const sweet = await restockSweet(req.params.id, quantity);
    res.status(200).json({
      message: 'Restock successful',
      sweet,
    });
  }
);
