# 🌍 GlobeTrotter - Travel Planning Application

**Team Number:** 227  
**Team Leader:** Jay Sadhu  
**Demo Video:** [Watch Demo](https://drive.google.com/file/d/1ANBdUSdRV_nwD5EV0VuFNYPblBWLv-6K/view?usp=drive_link)

---

A full-stack travel planning application built with React, TypeScript, Node.js, and MongoDB. Plan your trips, discover activities, manage budgets, and share itineraries with friends and family.

## ✨ Features

### 🗺️ Trip Planning
- Create and manage multiple trips
- Build detailed itineraries with day-by-day planning
- Discover cities and activities worldwide
- Clone existing itineraries for new trips

### 📱 User Experience
- Modern, responsive UI built with React and Tailwind CSS
- Real-time search for cities and activities
- Interactive calendar view for trip planning
- Photo upload and management with Cloudinary integration

### 💰 Budget Management
- Track trip expenses and budgets
- Categorize spending
- Visual budget analytics and reports

### 🤝 Social Features
- Share itineraries with unique links
- Community posts and discussions
- Public trip sharing with customizable privacy settings

### 👨‍💼 Admin Panel
- User management and statistics
- Database administration tools
- Activity and trip moderation
- Comprehensive analytics dashboard

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** for file uploads
- **Cloudinary** for image management
- **Nodemailer** for email services

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account (for photo uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ODOO-25
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create environment file
cp env-template.txt .env
```

Edit `.env` file with your configuration:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

```bash
# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 📁 Project Structure

```
ODOO-25/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication & validation
│   │   └── lib/           # Utility functions
│   ├── package.json
│   └── README.md
├── Frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   └── lib/          # API and utility functions
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Trips & Itineraries
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/itinerary/:tripId` - Get trip itinerary
- `POST /api/itinerary` - Update itinerary

### Cities & Activities
- `GET /api/cities` - Search cities
- `GET /api/activities` - Search activities by city

### Budget & Expenses
- `GET /api/budgets/:tripId` - Get trip budget
- `POST /api/budgets/:tripId` - Update budget
- `GET /api/expenses/:tripId` - Get trip expenses

### Sharing & Community
- `POST /api/shared/:tripId` - Share trip
- `GET /api/shared/u/:slug` - Get shared trip
- `GET /api/community` - Community posts

### Admin
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/trips` - Trip management

## 🛠️ Development

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with initial data
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Environment Variables
- **MONGODB_URI**: MongoDB connection string
- **PORT**: Server port (default: 4000)
- **JWT_SECRET**: Secret key for JWT tokens
- **FRONTEND_URL**: Frontend URL for CORS
- **CLOUDINARY_***: Cloudinary configuration for photo uploads
- **EMAIL_***: Email service configuration

### Database
The application uses MongoDB with the following main collections:
- Users
- Trips
- Itineraries
- Activities
- Cities
- Budgets
- Expenses
- Community Posts

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Build and deploy the Node.js application
3. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `dist` folder to your hosting service
3. Update backend CORS settings with production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the existing documentation
- Review the troubleshooting guides in the project
- Create an issue in the repository

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and insights
- [ ] Integration with travel APIs
- [ ] Real-time collaboration features
- [ ] Offline mode support
- [ ] Multi-language support

---

**Happy Traveling! ✈️**
