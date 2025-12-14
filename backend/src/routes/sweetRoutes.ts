import { Router } from 'express';
import {
  createSweetHandler,
  getAllSweetsHandler,
  searchSweetsHandler,
  getSweetHandler,
  updateSweetHandler,
  deleteSweetHandler,
  purchaseSweetHandler,
  restockSweetHandler,
} from '../controllers/sweetController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('admin'), createSweetHandler);
router.get('/', getAllSweetsHandler);
router.get('/search', searchSweetsHandler);
router.get('/:id', getSweetHandler);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateSweetHandler);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteSweetHandler);
router.post('/:id/purchase', authenticateToken, purchaseSweetHandler);
router.post('/:id/restock', authenticateToken, authorizeRoles('admin'), restockSweetHandler);

export default router;
