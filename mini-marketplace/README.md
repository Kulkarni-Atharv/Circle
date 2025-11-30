# Mini-Marketplace

A modern, feature-rich e-commerce platform built with **React**, **TypeScript**, and **Supabase**. This application allows users to browse products, manage a shopping cart and wishlist, and connect directly with sellers.

![Mini-Marketplace Banner](https://images.unsplash.com/photo-1472851294608-415105094e3f?q=80&w=2070&auto=format&fit=crop)

## 📸 Screenshots

| Home Page | Product Details |
|:---:|:---:|
| ![Home Page](docs/screenshots/home.png) | ![Product Details](docs/screenshots/product-modal.png) |
| **Browse Products** | **View Details & Buy** |

| Shopping Cart | Wishlist |
|:---:|:---:|
| ![Shopping Cart](docs/screenshots/cart.png) | ![Wishlist](docs/screenshots/wishlist.png) |
| **Manage Cart Items** | **Save Favorites** |

## 🚀 Features

### 🛍️ For Buyers
-   **Browse Products**: View a grid of available products with images and prices.
-   **Product Details**: Click on any product to see full description, multiple images, and seller info.
-   **Shopping Cart**: Add items to your cart, update quantities, and see the total cost.
-   **Wishlist**: Save items you love to your wishlist for later.
-   **Buy Now**: Connect directly with sellers via **WhatsApp** or **Phone** to negotiate and purchase.
-   **Search & Filter**: (Coming Soon) Easily find what you're looking for.

### 🏪 For Sellers
-   **Sell Products**: List your own products with up to 5 images, title, description, and price.
-   **Manage Listings**: (Coming Soon) Edit or remove your product listings.
-   **Direct Sales**: No platform fees - deal directly with buyers.

### 🔐 Security & Tech
-   **Secure Auth**: Powered by Supabase Authentication.
-   **Row Level Security (RLS)**: Ensures users can only modify their own data.
-   **Real-time Database**: Fast and reliable data storage with PostgreSQL.
-   **Responsive UI**: Works perfectly on mobile, tablet, and desktop.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, ShadCN UI
-   **State Management**: React Context API, TanStack Query (React Query)
-   **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
-   **Routing**: React Router DOM
-   **Icons**: Lucide React
-   **Animations**: Framer Motion
-   **Form Handling**: React Hook Form, Zod

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Kulkarni-Atharv/mini-marketplace.git
    cd mini-marketplace
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**
    Run the provided SQL scripts in your Supabase SQL Editor to set up the tables and policies:
    -   `supabase/migrations/001_initial_schema.sql` (Core tables)
    -   `SETUP_CART_DB.sql` (Cart and Wishlist tables)

5.  **Run the development server**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
mini-marketplace/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Header, Footer, Layout wrappers
│   │   ├── products/   # Product-related components
│   │   └── ui/         # ShadCN UI primitives
│   ├── contexts/       # React Context providers (Auth, Cart, Wishlist)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and Supabase client
│   ├── pages/          # Page components (Home, Cart, Sell, etc.)
│   └── types/          # TypeScript type definitions
├── supabase/           # Database migrations and SQL scripts
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 👤 Author

**Atharv Kulkarni**

-   GitHub: [@Kulkarni-Atharv](https://github.com/Kulkarni-Atharv)
-   LinkedIn: [Atharv Kulkarni](https://www.linkedin.com/in/kulkarni-atharv/)


