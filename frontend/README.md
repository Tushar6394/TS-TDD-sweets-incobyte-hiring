# SweetShop Management System

A modern, visually stunning Single Page Application (SPA) for managing a sweet shop. Built with React, TypeScript, and Tailwind CSS with beautiful candy-themed design and smooth animations.

## Features

### Customer Features
- Browse sweets catalog with search and filtering
- View detailed sweet information
- Purchase sweets with quantity selection
- User authentication (register/login)
- Customer dashboard
- Real-time stock updates

### Admin Features
- Complete sweet inventory management (CRUD)
- Add new sweets with image URLs
- Edit existing sweets
- Delete sweets with confirmation
- Restock functionality
- Low stock alerts
- Statistics dashboard
- Bulk inventory overview

### Design Highlights
- Whimsical candy-themed aesthetic
- Pastel color palette (pink, purple, mint green, yellow)
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications for user feedback
- Role-based navigation and access control

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 16+ and npm
- Backend API running at `http://localhost:5000/api`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sweetshop-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── Navigation.tsx  # Responsive navigation bar
│   ├── LoadingSpinner.tsx
│   ├── SweetCard.tsx   # Sweet item card
│   ├── SearchBar.tsx   # Search and filter component
│   ├── SweetFormModal.tsx  # Add/Edit sweet modal
│   ├── RestockModal.tsx    # Restock modal
│   └── ProtectedRoute.tsx  # Route protection HOC
│
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── ToastContext.tsx # Toast notifications
│
├── pages/             # Page components
│   ├── Landing.tsx    # Landing page
│   ├── Login.tsx      # Login page
│   ├── Register.tsx   # Registration page
│   ├── Shop.tsx       # Main shop page
│   ├── SweetDetail.tsx # Sweet detail page
│   ├── Dashboard.tsx  # Customer dashboard
│   └── AdminDashboard.tsx # Admin dashboard
│
├── services/          # API service layer
│   └── api.ts        # Axios instance and API methods
│
├── types/            # TypeScript type definitions
│   └── index.ts
│
├── App.tsx           # Main app component with routing
├── main.tsx          # Entry point
└── index.css         # Global styles and animations
```

## API Integration

The app connects to a Node.js/TypeScript backend API. Configure the base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### API Endpoints Used

**Authentication:**
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login
- GET `/auth/profile` - Get user profile

**Sweets Management:**
- GET `/sweets` - Get all sweets
- GET `/sweets/search` - Search sweets
- GET `/sweets/:id` - Get sweet by ID
- POST `/sweets` - Create sweet (Admin)
- PUT `/sweets/:id` - Update sweet (Admin)
- DELETE `/sweets/:id` - Delete sweet (Admin)
- POST `/sweets/:id/purchase` - Purchase sweet
- POST `/sweets/:id/restock` - Restock sweet (Admin)

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically added to all API requests via Axios interceptor
4. Protected routes redirect to login if not authenticated
5. Admin routes check for admin role
6. Auto-logout on 401 errors

## Environment Variables

No environment variables are required for development. The API base URL is configured in `src/services/api.ts`.

## Key Components

### SweetCard
Displays individual sweet items with:
- Image, name, category, price
- Stock quantity indicator
- Purchase button for customers
- Edit/Delete buttons for admins
- Out of stock overlay

### SearchBar
Provides filtering capabilities:
- Text search
- Price range filter (min/max)
- Expandable filter panel

### Navigation
Responsive navigation with:
- Role-based menu items
- User profile badge
- Mobile hamburger menu
- Active route highlighting

### Modals
- **SweetFormModal**: Add/edit sweet with image preview
- **RestockModal**: Quick restock interface

## Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Animations

Smooth animations using Framer Motion:
- Page transitions
- Card hover effects
- Modal enter/exit
- Loading spinners
- Toast notifications

## Color Palette

- **Pink**: #EC4899 (primary actions)
- **Purple**: #9333EA (secondary actions)
- **Blue**: #3B82F6 (info)
- **Amber**: #F59E0B (warnings)
- **Red**: #EF4444 (errors/delete)
- **Green**: #10B981 (success)

## Security Features

- JWT token authentication
- Protected routes with role-based access
- Auto-logout on token expiration
- Input validation on forms
- Confirmation dialogs for destructive actions
- XSS protection through React's JSX escaping

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

Run type checking:
```bash
npm run typecheck
```

Run linting:
```bash
npm run lint
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend API is running on `http://localhost:5000`
- Check CORS settings on backend
- Verify API endpoints match documentation

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Update dependencies: `npm update`

### Authentication Issues
- Clear localStorage: Open DevTools > Application > Local Storage > Clear
- Check JWT token validity
- Verify backend authentication endpoints

## Future Enhancements

- Shopping cart functionality
- Order history
- Payment integration
- Email notifications
- Product reviews and ratings
- Wishlist/favorites
- Dark mode toggle
- Advanced analytics for admins
- Inventory reports export
- Multi-language support

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
