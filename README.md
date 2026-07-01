# 🎓 EduSavings – Multi-Vendor Educational Marketplace

EduSavings is a full-stack multi-vendor e-commerce marketplace designed specifically for educational products such as books, courses, stationery, digital learning materials, and educational resources. The platform enables students to purchase affordable educational products while allowing verified sellers to manage their stores through a secure and scalable marketplace.

Built with modern technologies, EduSavings focuses on performance, security, scalability, and a seamless shopping experience similar to leading e-commerce platforms.

---

# 🚀 Live Demo

> Frontend: *Coming Soon*

> Backend API: *Coming Soon*

---

# 📖 Features

## 👤 Authentication & Authorization

- Secure User Authentication
- Google OAuth Login
- JWT Authentication
- Role-Based Access Control
- Admin Dashboard
- Seller Dashboard
- Customer Dashboard
- Protected Routes

---

## 🛍 Marketplace

- Multi-Vendor Marketplace
- Product Categories
- Product Search
- Advanced Filters
- Product Variants
- Product Images
- Product Approval System
- Featured Products
- Product Reviews & Ratings *(Upcoming)*
- Wishlist *(Upcoming)*

---

## 🛒 Shopping

- Shopping Cart
- Add/Remove Products
- Quantity Management
- Stock Availability Check
- Real-Time Price Calculation
- Checkout Session
- Address Management
- Order Summary

---

## 💳 Payments

- Razorpay Payment Gateway
- Secure Payment Verification
- Payment Status Tracking
- Order Creation After Successful Payment
- Transaction History

---

## 📦 Order Management

- Order Placement
- Order Tracking
- Order History
- Order Status Updates
- Stock Reservation
- Automatic Reservation Expiry
- Inventory Locking
- Escrow-Based Payment Flow

---

## 💼 Seller Features

- Seller Registration
- Seller Wallet
- Wallet Transactions
- Earnings Dashboard
- Commission Calculation
- Product Management
- Inventory Management
- Sales Analytics *(Upcoming)*

---

## 🛠 Admin Features

- User Management
- Seller Verification
- Product Approval
- Category Management
- Commission Management
- Wallet Management
- Delivery Area Management
- Dashboard Analytics

---

## 🚚 Delivery System

- Pincode Availability Check
- Delivery Zone Management
- Shipping Validation
- Delivery Status Updates

---

## 🔔 Notifications *(Upcoming)*

- Order Confirmation
- Payment Confirmation
- Delivery Updates
- Seller Notifications
- Admin Notifications

---

# 🏗 Tech Stack

## Frontend

- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Axios
- React Hook Form
- Zod

---

## Backend

- Next.js API Routes
- Prisma ORM
- MongoDB Atlas
- Redis
- BullMQ
- Razorpay
- Cloudinary
- NextAuth

---

## Database

- MongoDB Atlas

---

## Dev Tools

- Git
- GitHub
- Postman
- VS Code
- ESLint
- Prettier

---

# 🏛 System Architecture

```
Client (Next.js)

        │

        ▼

Next.js API Routes

        │

        ▼

Business Services

        │

        ▼

Prisma ORM

        │

        ▼

MongoDB Atlas

        │

        ▼

Redis + BullMQ Workers

        │

        ▼

Background Jobs
```

---

# 📂 Project Structure

```
EduSavings/
│
├── app/
│   ├── admin/
│   ├── seller/
│   ├── user/
│   ├── api/
│   └── auth/
│
├── components/
│
├── lib/
│
├── prisma/
│
├── public/
│
├── services/
│
├── middleware/
│
├── hooks/
│
├── types/
│
├── utils/
│
├── constants/
│
├── styles/
│
└── README.md
```

---

# 🔒 Security Features

- JWT Authentication
- Google OAuth
- Password Hashing
- Role-Based Authorization
- Secure API Routes
- Input Validation
- Rate Limiting *(Planned)*
- CSRF Protection *(Planned)*
- Environment Variable Protection

---

# ⚡ Performance Optimizations

- Server Components
- Image Optimization
- Lazy Loading
- Pagination
- Redis Caching
- Background Queue Processing
- Optimized Database Queries
- Inventory Locking

---

# 📊 Database Models

- User
- Product
- Category
- Cart
- Wishlist
- Order
- OrderItem
- CheckoutSession
- StockReservation
- SellerWallet
- WalletTransaction
- EscrowTransaction
- PincodeService
- Notification

---

# 🔄 Marketplace Workflow

```
Customer

     │

Browse Products

     │

Add to Cart

     │

Checkout

     │

Stock Reserved

     │

Razorpay Payment

     │

Payment Verification

     │

Order Created

     │

Seller Processes Order

     │

Delivered

     │

Escrow Released

     │

Seller Wallet Updated
```

---

# 🛠 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/edusavings.git
```

---

## Navigate

```bash
cd edusavings
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL=

DIRECT_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

REDIS_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Push Database Schema

```bash
npx prisma db push
```

---

## Start Development Server

```bash
npm run dev
```

---

# 🚀 Future Enhancements

- AI Product Recommendations
- Recommendation Engine
- Seller Analytics Dashboard
- Fraud Detection
- Coupon System
- Referral Program
- Real-Time Notifications
- Chat Between Buyer & Seller
- Email Notifications
- SMS Notifications
- Invoice Generation
- Refund Management
- Return Management
- Multi-Language Support
- Dark Mode
- Progressive Web App (PWA)
- Mobile Application

---

# 🧪 Testing

- API Testing using Postman
- Unit Testing *(Planned)*
- Integration Testing *(Planned)*
- End-to-End Testing *(Planned)*

---

# 📈 Project Highlights

- Full Stack Marketplace
- Multi-Vendor Architecture
- Secure Payment Integration
- Inventory Reservation System
- Escrow Payment Workflow
- Seller Wallet Management
- Commission Engine
- Background Queue Processing
- Modern UI/UX
- Scalable Folder Structure
- Production-Ready Architecture

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 👨‍💻 Author

**Vishal Kodalkar**

- MCA Graduate
- Full Stack MERN & Next.js Developer
- Passionate about building scalable web applications

---

# ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub to support the project and encourage future development.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 About the Project

EduSavings demonstrates modern full-stack development practices by combining Next.js, TypeScript, Prisma, MongoDB, Redis, and Razorpay into a scalable marketplace solution. The project showcases secure authentication, inventory reservation, payment processing, seller wallet management, and a modular architecture suitable for production-grade e-commerce applications.
