# Urban Canvas - Real Estate Platform

A modern, full-stack real estate platform built with React, Node.js, and MongoDB. Urban Canvas connects property buyers, sellers, and agents through a secure, feature-rich platform with role-based access control.

## 🌟 Live Demo

**[Urban Canvas Live Site](https://urbancanvas.vercel.app)**

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Multi-role System**: Users, Agents, and Admins with distinct permissions
- **Secure Authentication**: JWT + Firebase integration
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login state

### 🏠 Property Management
- **Property Listings**: Rich property details with images, descriptions, and pricing
- **Verification System**: Admin-verified properties for quality assurance
- **Advanced Search**: Filter by location, price range, and property type
- **Featured Properties**: Admin-controlled homepage advertisements
- **Property Reviews**: User-generated reviews and ratings

### 💼 Agent Features
- **Property Management**: Add, edit, and manage property listings
- **Offer Management**: Review and respond to property offers
- **Sales Tracking**: Monitor sold properties and revenue
- **Profile Management**: Professional agent profiles

### 👤 User Features
- **Property Browsing**: Browse verified properties with detailed information
- **Wishlist System**: Save favorite properties for later
- **Offer System**: Make offers on properties with payment integration
- **Review System**: Leave reviews for purchased properties
- **Transaction History**: Track all property transactions

### 🛡️ Admin Dashboard
- **User Management**: Manage users, agents, and admin roles
- **Property Verification**: Verify and approve property listings
- **Fraud Prevention**: Mark fraudulent agents and remove their listings
- **Review Moderation**: Manage and moderate user reviews
- **Platform Statistics**: Monitor platform metrics and performance

### 🎨 User Experience
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark Mode**: Built-in dark/light theme support
- **Real-time Updates**: Live data updates with React Query
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **React Query** - Data fetching, caching, and state management
- **Firebase Auth** - Authentication service
- **React Icons** - Icon library
- **SweetAlert2** - Beautiful notifications and alerts

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urban-canvas.git
   cd urban-canvas
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

   **Frontend (.env.local)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
urban-canvas/
├── client/                          # Frontend React application
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── api/                     # API service functions
│   │   │   ├── adminAPI.js          # Admin-specific API calls
│   │   │   ├── authAPI.js           # Authentication API calls
│   │   │   ├── offerAPI.js          # Offer management API calls
│   │   │   ├── propertyAPI.js       # Property management API calls
│   │   │   ├── reviewAPI.js         # Review system API calls
│   │   │   └── wishlistAPI.js       # Wishlist API calls
│   │   ├── assets/                  # Static assets (images, icons)
│   │   ├── components/              # Reusable UI components
│   │   │   ├── shared/              # Shared components (Navbar, Footer)
│   │   │   └── ConfirmDialog.jsx    # Confirmation dialog component
│   │   ├── contexts/                # React contexts
│   │   │   ├── AuthContext.jsx      # Authentication context
│   │   │   └── NotificationContext.jsx # Notification context
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── layouts/                 # Layout components
│   │   │   ├── MainLayout.jsx       # Main page layout
│   │   │   └── DashboardLayout.jsx  # Dashboard layout
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Homepage
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Properties.jsx       # Properties listing page
│   │   │   ├── PropertyDetails.jsx  # Property details page
│   │   │   └── dashboard/           # Dashboard pages
│   │   │       ├── Dashboard.jsx    # Main dashboard
│   │   │       ├── user/            # User dashboard pages
│   │   │       ├── agent/           # Agent dashboard pages
│   │   │       └── admin/           # Admin dashboard pages
│   │   ├── routes/                  # Route protection components
│   │   │   ├── PrivateRoute.jsx     # Private route wrapper
│   │   │   ├── AdminRoute.jsx       # Admin-only route wrapper
│   │   │   └── AgentRoute.jsx       # Agent-only route wrapper
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite configuration
│
├── server/                          # Backend Node.js application
│   ├── config/                      # Configuration files
│   ├── middleware/                  # Custom middleware
│   │   └── auth.js                  # Authentication middleware
│   ├── models/                      # Mongoose models
│   │   ├── User.js                  # User model
│   │   ├── Property.js              # Property model
│   │   ├── Review.js                # Review model
│   │   ├── Wishlist.js              # Wishlist model
│   │   └── Offer.js                 # Offer model
│   ├── routes/                      # Express routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── properties.js            # Property routes
│   │   ├── reviews.js               # Review routes
│   │   ├── wishlist.js              # Wishlist routes
│   │   ├── offers.js                # Offer routes
│   │   └── admin.js                 # Admin routes
│   ├── index.js                     # Server entry point
│   └── package.json                 # Backend dependencies
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore file
└── README.md                        # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Properties
- `GET /properties` - Get all verified properties
- `GET /properties/:id` - Get property by ID
- `GET /properties/advertised` - Get advertised properties
- `POST /properties` - Add new property (agent only)
- `PUT /properties/:id` - Update property (agent only)
- `DELETE /properties/:id` - Delete property (agent only)

### Admin
- `GET /admin/statistics` - Get platform statistics
- `GET /admin/properties/all` - Get all properties (admin only)
- `PATCH /admin/properties/:id/verify` - Verify property (admin only)
- `PATCH /admin/properties/:id/reject` - Reject property (admin only)
- `PATCH /admin/properties/:id/advertise` - Toggle advertisement (admin only)
- `GET /admin/users` - Get all users (admin only)
- `PATCH /admin/users/:id/make-admin` - Make user admin (admin only)
- `PATCH /admin/users/:id/make-agent` - Make user agent (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)

### Offers
- `POST /offers` - Make an offer
- `GET /offers/agent/:email` - Get agent offers
- `GET /offers/buyer/:email` - Get buyer offers
- `PATCH /offers/accept/:id` - Accept offer
- `PATCH /offers/reject/:id` - Reject offer

### Reviews
- `POST /reviews` - Add review
- `GET /reviews/property/:id` - Get property reviews
- `GET /reviews/user/:email` - Get user reviews

### Wishlist
- `POST /wishlist` - Add to wishlist
- `GET /wishlist/:email` - Get user wishlist
- `DELETE /wishlist/:id` - Remove from wishlist

## 👥 User Roles & Permissions

### User (Buyer)
- Browse verified properties
- Save properties to wishlist
- Make offers on properties
- Leave reviews for purchased properties
- View transaction history

### Agent (Seller)
- Add and manage property listings
- View and respond to offers
- Track sold properties and revenue
- Manage property details and images

### Admin
- Verify and approve property listings
- Manage user roles and permissions
- Moderate reviews and content
- Monitor platform statistics
- Mark fraudulent agents
- Control featured properties

## 🎯 Key Features in Detail

### Property Verification System
- Properties must be verified by admins before public visibility
- Three status levels: pending, verified, rejected
- Only verified properties can be advertised on homepage

### Offer Management
- Users can make offers on properties
- Agents can accept or reject offers
- Complete payment flow integration
- Transaction tracking and history

### Fraud Prevention
- Admin can mark agents as fraudulent
- Automatic removal of fraudulent agent's properties
- User protection against scams

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading times

## 🚀 Deployment

### Frontend (Netlify) + Backend (Render)

#### Prerequisites
- GitHub repository with your code
- Netlify account ([netlify.com](https://netlify.com))
- Render account ([render.com](https://render.com))
- MongoDB Atlas account (for cloud database)

---

### Step 1: Deploy Backend to Render

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up or login with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure the Service**
   - **Name**: `urban-canvas-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or choose paid plan)

4. **Set Environment Variables**
   Click "Environment" tab and add these variables:
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your service URL (e.g., `https://urban-canvas-api.onrender.com`)

---

### Step 2: Deploy Frontend to Netlify

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or login with your GitHub account

2. **Deploy from Git**
   - Click "New site from Git"
   - Choose GitHub and select your repository

3. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Set Environment Variables**
   Go to Site settings → Environment variables and add:
   ```env
   VITE_API_BASE_URL=https://your-render-service-url.onrender.com/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

---

### Step 3: Configure CORS (if needed)

If you encounter CORS issues, update your backend CORS configuration in `server/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-netlify-site.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

### Step 4: Test Your Deployment

1. **Test Backend API**
   - Visit your Render service URL
   - Should see a welcome message or API documentation

2. **Test Frontend**
   - Visit your Netlify site URL
   - Test all features: registration, login, property browsing, etc.

3. **Monitor Logs**
   - Check Render logs for backend issues
   - Check Netlify build logs for frontend issues

---

### Troubleshooting

#### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Environment Variables**
   - Double-check all environment variable names
   - Ensure no extra spaces or quotes
   - Verify API URLs are correct

3. **CORS Errors**
   - Update CORS configuration with your Netlify domain
   - Check browser console for specific error messages

4. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

#### Performance Optimization:

1. **Enable Caching**
   - Set up CDN in Netlify
   - Configure caching headers

2. **Database Optimization**
   - Use MongoDB Atlas M10+ for production
   - Set up proper indexes

3. **Monitoring**
   - Set up uptime monitoring
   - Configure error tracking

---

### Alternative Deployment Options

#### Frontend Alternatives:
- **Vercel**: Similar to Netlify, great for React apps
- **GitHub Pages**: Free hosting for static sites
- **Firebase Hosting**: Google's hosting solution

#### Backend Alternatives:
- **Railway**: Easy deployment with good free tier
- **Heroku**: Popular platform with good documentation
- **DigitalOcean App Platform**: Scalable and reliable
- **AWS/Google Cloud**: Enterprise-grade solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Vite for the amazing development experience
- Tailwind CSS for the utility-first styling approach
- MongoDB for the flexible database solution
- Firebase for secure authentication
- All contributors and users of this platform 