import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

const PORT = process.env.PORT || 5000;

const seedUsers = async (): Promise<void> => {
  try {
    // Seed admin user
    let admin = await User.findOne({ email: 'admin@katabolt.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@katabolt.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin user created');
    } else {
      admin.password = 'admin123';
      await admin.save();
      console.log('Default admin user password updated');
    }

    // Seed customer user
    let customer = await User.findOne({ email: 'customer@katabolt.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Customer User',
        email: 'customer@katabolt.com',
        password: 'customer123',
        role: 'customer'
      });
      console.log('Default customer user created');
    } else {
      customer.password = 'customer123';
      await customer.save();
      console.log('Default customer user password updated');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedUsers();
    app.listen(PORT, () => {
      console.log(`CandyCraft API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
