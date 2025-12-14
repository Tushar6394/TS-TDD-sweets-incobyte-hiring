import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { Sweet } from '../models/Sweet.js';
import { connectDB, disconnectDB } from '../config/db.js';

describe('Sweets Management Endpoints', () => {
  let customerToken: string;
  let adminToken: string;
  let sweetId: string;

  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const customerResponse = await request(app).post('/api/auth/register').send({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
    });
    customerToken = customerResponse.body.token;

    const adminResponse = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await disconnectDB();
  });

  describe('POST /api/sweets - Create Sweet', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: 2.5,
          quantity: 100,
          description: 'Delicious milk chocolate',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.price).toBe(2.5);
      sweetId = response.body._id;
    });

    it('should reject sweet creation for non-admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Lollipop',
          category: 'lollipop',
          price: 0.5,
          quantity: 50,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('permission');
    });

    it('should reject sweet creation without token', async () => {
      const response = await request(app).post('/api/sweets').send({
        name: 'Candy',
        category: 'candy',
        price: 1.0,
        quantity: 50,
      });

      expect(response.status).toBe(401);
    });

    it('should fail when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete Sweet',
        });

      expect(response.status).toBe(400);
    });

    it('should reject negative price', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Sweet',
          category: 'candy',
          price: -5,
          quantity: 10,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('negative');
    });

    it('should reject negative quantity', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Sweet',
          category: 'candy',
          price: 1.5,
          quantity: -10,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('negative');
    });
  });

  describe('GET /api/sweets - Get All Sweets', () => {
    beforeAll(async () => {
      await Sweet.deleteMany({});
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/api/sweets')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: `Sweet ${i}`,
            category: 'candy',
            price: 1.0 + i * 0.1,
            quantity: 50 + i,
          });
      }
    });

    it('should get all sweets with pagination', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweets');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('pages');
      expect(Array.isArray(response.body.sweets)).toBe(true);
      expect(response.body.sweets.length).toBeLessThanOrEqual(10);
    });

    it('should support custom page limit', async () => {
      const response = await request(app).get('/api/sweets?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBeLessThanOrEqual(5);
    });

    it('should return correct pagination info', async () => {
      const response = await request(app).get('/api/sweets?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.pages).toBe(Math.ceil(response.body.total / 5));
    });
  });

  describe('GET /api/sweets/search - Search Sweets', () => {
    beforeAll(async () => {
      await Sweet.deleteMany({});
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Premium Chocolate',
          category: 'chocolate',
          price: 5.99,
          quantity: 20,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'candy',
          price: 1.99,
          quantity: 100,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Luxury Chocolate Truffles',
          category: 'chocolate',
          price: 12.99,
          quantity: 10,
        });
    });

    it('should search by name', async () => {
      const response = await request(app).get('/api/sweets/search?q=Chocolate');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweets');
      expect(response.body.sweets.length).toBeGreaterThan(0);
    });

    it('should filter by price range', async () => {
      const response = await request(app).get('/api/sweets/search?priceMin=2&priceMax=10');

      expect(response.status).toBe(200);
      expect(response.body.sweets.every((sweet: { price: number }) => sweet.price >= 2 && sweet.price <= 10)).toBe(true);
    });

    it('should combine search with price filter', async () => {
      const response = await request(app).get('/api/sweets/search?q=Chocolate&priceMin=5&priceMax=15');

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PUT /api/sweets/:id - Update Sweet', () => {
    let updateSweetId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Original Sweet',
          category: 'candy',
          price: 1.5,
          quantity: 50,
        });
      updateSweetId = response.body._id;
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${updateSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Sweet',
          price: 2.5,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
      expect(response.body.price).toBe(2.5);
    });

    it('should reject update for non-admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${updateSweetId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          price: 3.5,
        });

      expect(response.status).toBe(403);
    });

    it('should fail with invalid sweet id', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 2.5,
        });

      expect(response.status).toBe(500);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .put('/api/sweets/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 2.5,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id - Delete Sweet', () => {
    let deleteSweetId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Sweet to Delete',
          category: 'candy',
          price: 1.0,
          quantity: 10,
        });
      deleteSweetId = response.body._id;
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${deleteSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    it('should reject delete for non-admin', async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Another Sweet',
          category: 'candy',
          price: 1.0,
          quantity: 10,
        });

      const response = await request(app)
        .delete(`/api/sweets/${createResponse.body._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase - Purchase Sweet', () => {
    let purchaseSweetId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Purchasable Sweet',
          category: 'candy',
          price: 1.5,
          quantity: 100,
        });
      purchaseSweetId = response.body._id;
    });

    it('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          quantity: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(90);
    });

    it('should reject purchase with insufficient quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          quantity: 1000,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Insufficient');
    });

    it('should reject purchase with zero quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock - Restock Sweet', () => {
    let restockSweetId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Restockable Sweet',
          category: 'candy',
          price: 1.5,
          quantity: 10,
        });
      restockSweetId = response.body._id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(60);
    });

    it('should reject restock for non-admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          quantity: 20,
        });

      expect(response.status).toBe(403);
    });

    it('should reject restock with zero quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });
  });
});
