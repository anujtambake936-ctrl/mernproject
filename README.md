# Shopping Cart MERN Project

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- **User Authentication** - Register, login, logout with JWT
- **Product Management** - Browse, search, and view product details
- **Shopping Cart** - Add/remove items, update quantities
- **Order Management** - Place orders and view order history
- **Payment Integration** - Stripe payment processing
- **Admin Panel** - Product CRUD operations
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- CORS enabled

## 📁 Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── app/         # Redux store & slices
│   │   └── helpers/     # Utility functions
│   └── public/
├── server/          # Express backend
│   ├── controllers/ # Route handlers
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API routes
│   ├── middlewares/ # Auth & validation
│   └── config/      # Database config
```

## 🔗 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `POST /api/cart/add` - Add item to cart
- `GET /api/orders` - Get user orders
- And more...

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/anujtambake936-ctrl/mernproject.git
cd mernproject
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

5. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## 🌐 Deployment

- Frontend: Deployed on Vercel
- Backend: Can be deployed on Heroku, Railway, or similar platforms

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Anuj Tambake**
- GitHub: [@anujtambake936-ctrl](https://github.com/anujtambake936-ctrl)