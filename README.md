# FRT Frontend Assessment

A responsive e-commerce frontend application built as part of the Flat Rock Technology frontend assessment.

The application provides a product listing page, product details page, shopping cart, quick-add functionality, price/category/brand filtering, sorting, pagination, and checkout functionality integrated with the supplied backend API.

## Tech Stack

* Next.js 16 with App Router
* React
* TypeScript
* Tailwind CSS
* Zustand
* REST API
* Lucide React
* ESLint

## Features

### Product Listing

* Display products retrieved from the supplied backend API
* Category filtering
* Multi-select brand filtering
* Price range filtering
* Sorting by:

  * Release Date: Descending
  * Release Date: Ascending
  * Price: Descending
  * Price: Ascending
* Pagination
* Responsive product grid
* Product image placeholders based on product category

### Product Details

* Display detailed product information
* Display available product options
* Require option selection when a product has selectable options
* Add products to cart
* Stock availability handling

### Shopping Cart

* Persistent cart using Zustand
* Add and remove products
* Increase and decrease quantities
* Product stock validation
* Product variants with different selected options are stored as separate cart entries
* Cart total calculation
* Cart dropdown accessible from the header

### Quick Add

* Add products directly from the product listing when no option is required
* Open an option-selection modal when a product requires an option
* Validate required option selection
* Stock validation
* Success and error toast notifications

### Checkout

* Customer information form
* Name validation
* Surname validation
* Phone validation
* Email validation
* ZIP code validation
* Checkout API integration
* Checkout success handling
* Checkout failure handling
* Cart is cleared after successful checkout
* Cart is preserved when checkout fails

## URL-Based Product Listing State

Product listing state is stored in URL search parameters so that the current listing state can be restored through browser navigation and shared through the URL.

Supported parameters include:

```text
category
brand
minPrice
maxPrice
sort
page
```

Example:

```text
/?category=Shoes&brand=SoledSole,Flying%20Dutchman&minPrice=300&maxPrice=700&sort=price_asc&page=2
```

The URL is used for view-related state, while Zustand is used for global client-side cart state.

## Project Structure

```text
frt-frontend/
│
├── app/
│   ├── checkout/
│   │   └── page.tsx
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── checkout/
│   │   └── CheckoutForm.tsx
│   │
│   ├── layout/
│   │   └── Header.tsx
│   │
│   ├── products/
│   │   ├── CartDropdown.tsx
│   │   ├── PriceFilterSlider.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductListing.tsx
│   │   ├── QuickAddModal.tsx
│   │   └── SortByDropdown.tsx
│   │
│   └── ui/
│       └── Toast.tsx
│
├── lib/
│   └── productImages.ts
│
├── public/
│   └── products/
│       ├── shoe-placeholder.jpg
│       └── shirt-placeholder.jpg
│
├── services/
│   └── productService.ts
│
├── store/
│   └── cartStore.ts
│
├── types/
│   └── product.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 20.9 or later
* npm

The frontend expects the supplied FRT backend API to be running locally.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3010
```

A `.env.example` file is also included for reference.

### 3. Start the backend

Use the supplied FRT backend repository:

```text
FlatRockTechCareers/FRT-FE-Endpoint
```

Install and start the backend according to its instructions.

The backend should be available at:

```text
http://localhost:3010
```

### 4. Start the frontend

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Available API Endpoints

The frontend consumes the supplied backend endpoints:

```text
GET  /brands
GET  /categories
GET  /options
GET  /products
GET  /products/:id
POST /checkout
```

The backend implementation was not modified.

## State Management

Zustand is used for cart state because the cart is shared across multiple client-side components and needs client-side persistence.

The cart is persisted using browser local storage with the following storage key:

```text
frt-cart
```

Product listing state is intentionally kept in the URL rather than Zustand because filters, sorting, and pagination represent the current view and should be restorable using browser Back/Forward navigation.

## Stock Handling

Stock is enforced at the product level across all selected variants.

For example, if a product has stock of `5`:

```text
Size 39 → quantity 3
Size 40 → quantity 2
----------------------
Total   → quantity 5
```

The user cannot increase either variant beyond the total available stock.

Different option selections for the same product are stored as separate cart entries.

## Checkout Request

The checkout request includes the customer information and cart item data.

Example structure:

```json
{
  "customer": {
    "name": "John",
    "surname": "Doe",
    "phone": "+123456789",
    "email": "john@example.com",
    "zipCode": "10001"
  },
  "items": [
    {
      "productId": "product-id",
      "amount": 2,
      "selectedOption": {
        "type": "option-id",
        "label": "Size",
        "value": 40
      }
    }
  ]
}
```

Checkout failures are handled on the frontend and the existing cart is preserved so the user can retry.

## Validation

Run ESLint:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

Both commands should complete successfully before submission.

## Assessment Stages

### Stage I

* Product listing
* Product details
* Category filtering
* Brand filtering
* Sorting
* Shopping cart
* Required product option selection
* Stock handling

### Stage II

* Price filtering
* Cart quantity management
* Quick add from product listing
* Option-selection modal
* Variant-aware cart entries

### Stage III

* Checkout page
* Customer form validation
* Checkout API integration
* Success and failure handling
* Cart clearing after successful checkout

## Responsive Design

The application is designed to work across desktop and mobile screen sizes, including:

* Responsive product grid
* Mobile-friendly filter dropdowns
* Responsive product details
* Responsive checkout form
* Mobile-friendly cart and quick-add interactions

## Notes

* Product images are represented using local category-based placeholder images because the supplied product API does not provide product image URLs.
* The supplied backend API is used as-is and was not modified.
* The application uses the backend running on port `3010` during local development.

## Author

Rukshan Ranabahu
