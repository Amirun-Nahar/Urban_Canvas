# Urban Canvas

A comprehensive real estate platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables users to browse, wishlist, and purchase properties, while agents can list and manage properties, and admins can oversee the entire platform.

## Features

### For Users
- Browse verified properties
- Wishlist favorite properties
- Make offers on properties
- Purchase properties through secure payment
- Leave reviews on properties
- Responsive design for all devices

### For Agents
- List new properties
- Manage property listings
- Track property requests and sales
- View sales statistics
- Handle property offers

### For Admins
- Manage users and roles
- Verify properties
- Manage property listings
- Handle user reviews
- Monitor platform activity

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Tanstack Query
- Axios
- Firebase Authentication
- React Hook Form
- Sweet Alert 2
- Stripe Payment Integration

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose
- Cors
- Dotenv

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create `.env` files in both frontend and backend directories with the necessary environment variables.

5. Start the Development Servers
```bash
# Start Backend Server
cd backend
npm run dev

# Start Frontend Server
cd frontend
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=your_backend_api_url
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/) 