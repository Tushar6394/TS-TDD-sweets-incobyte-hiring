import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'customer';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = new User({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || 'customer',
  });

  const savedUser = await user.save();
  const token = generateToken(savedUser);

  return {
    user: {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    },
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as Parameters<typeof jwt.sign>[2]);
};
