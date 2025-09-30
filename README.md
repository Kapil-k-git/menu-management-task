# Menu Management System

A full-stack menu management system built with Nest.js backend and Next.js frontend, featuring hierarchical menu structures and a pixel-perfect UI design.

## 🚀 Features

### Backend Features
- **RESTful API** with Nest.js framework
- **PostgreSQL** database with Prisma ORM
- **Hierarchical menu structure** with unlimited depth
- **CRUD operations** for menus and menu items
- **Swagger documentation** at `/api`
- **Input validation** with class-validator
- **CORS enabled** for frontend integration

### Frontend Features
- **Next.js 14** with App Router
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Responsive design** with mobile support
- **Hierarchical tree view** with expand/collapse
- **Real-time updates** with Redux
- **Pixel-perfect UI** matching Figma design

### Core Functionality
- ✅ Get Menus
- ✅ Get specific menu (with depth and root item)
- ✅ Show hierarchically each menu
- ✅ Add item hierarchically
- ✅ Update item
- ✅ Delete item
- ✅ Save menu
- ✅ Blue plus button adds new item on lower layer

## 🛠️ Tech Stack

### Backend
- **Nest.js** - Node.js framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **TypeScript** - Type safety
- **Swagger** - API documentation
- **Class Validator** - Input validation

### Frontend
- **Next.js 14** - React framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Heroicons** - Icons
- **Headless UI** - Accessible components

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/menu_management?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run database migrations:
```bash
npx prisma migrate dev
```

7. Start the backend server:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`
API documentation at `http://localhost:3001/api`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Menu Table
- `id` - Primary key
- `name` - Menu name
- `description` - Optional description
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### MenuItem Table
- `id` - Primary key
- `title` - Item title
- `description` - Optional description
- `url` - Optional URL
- `icon` - Optional icon name
- `order` - Display order
- `isActive` - Active status
- `parentId` - Parent item ID (for hierarchy)
- `menuId` - Parent menu ID
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🔌 API Endpoints

### Menus
- `GET /menus` - Get all menus
- `GET /menus/:id` - Get specific menu
- `GET /menus/:id/hierarchy` - Get menu with hierarchy
- `POST /menus` - Create new menu
- `PATCH /menus/:id` - Update menu
- `DELETE /menus/:id` - Delete menu

### Menu Items
- `GET /menu-items` - Get all menu items
- `GET /menu-items/:id` - Get specific menu item
- `GET /menu-items/hierarchy/:menuId` - Get menu items hierarchy
- `POST /menu-items` - Create new menu item
- `PATCH /menu-items/:id` - Update menu item
- `PATCH /menu-items/reorder/:menuId` - Reorder menu items
- `DELETE /menu-items/:id` - Delete menu item

## 🎨 UI Features

### Design Elements
- **Dark sidebar** with navigation items
- **Light main content** area
- **Hierarchical tree view** with indentation
- **Expand/collapse** functionality
- **Blue plus buttons** for adding items
- **Form-based editing** on the right panel
- **Responsive design** for mobile devices

### Interactive Features
- Click menu items to select and edit
- Use plus buttons to add new items
- Expand/collapse tree nodes
- Real-time form updates
- Loading states and error handling

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API URL in environment variables

## 📝 Usage

1. **Create a Menu**: Use the "+" button next to the menu dropdown
2. **Add Menu Items**: Click the blue plus button next to any item
3. **Edit Items**: Click on any menu item to edit its details
4. **Hierarchical Structure**: Items are automatically organized in a tree structure
5. **Expand/Collapse**: Use the chevron icons to expand or collapse sections

## 🔧 Development

### Project Structure
```
menu-management/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── menu/
│   │   │   └── menu-item/
│   │   ├── common/
│   │   ├── database/
│   │   └── config/
│   └── prisma/
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── store/
    │   ├── types/
    │   └── hooks/
    └── public/
```

### Key Components
- **Sidebar**: Navigation with dark theme
- **MenuTree**: Hierarchical tree view component
- **MenuItemForm**: Form for editing menu items
- **MenuManagement**: Main page component
- **Redux Store**: State management with async thunks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
