# Urban Canvas Frontend

A modern real estate platform built with React, Vite, and Tailwind CSS.

## Features

- User authentication and authorization
- Property listing and search
- Property details with image gallery
- Wishlist functionality
- Offer management
- Role-based access control
- Responsive design
- Newsletter subscription

## Tech Stack

- React
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- HeadlessUI
- HeroIcons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
  ├── components/        # Reusable components
  ├── contexts/         # React contexts
  ├── pages/           # Page components
  ├── config/          # Configuration files
  ├── models/          # Data models and types
  ├── middlewares/     # Custom middlewares
  ├── App.jsx         # Root component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 