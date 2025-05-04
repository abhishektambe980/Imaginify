# Imaginify

Imaginify is a web application designed to streamline and enhance your creative workflows. It integrates various services like MongoDB, Clerk, Cloudinary, and Razorpay to provide a seamless user experience for authentication, media management, and payment processing.
![Homepage Screenshot]
## Features

- **User Authentication**: Powered by Clerk for secure sign-in and sign-up flows.
- **Media Management**: Utilize Cloudinary for efficient image and video storage.
- **Payment Integration**: Razorpay integration for handling payments.
- **Database**: MongoDB for storing application data.

## Environment Variables

The project relies on the following environment variables, which are defined in the `.env.local` file:

### MongoDB
- `MONGODB_URL`: Connection string for the MongoDB database.

### Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Public API key for Clerk.
- `CLERK_SECRET_KEY`: Secret API key for Clerk.
- `WEBHOOK_SECRET`: Webhook secret for Clerk.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: URL for the sign-in page.
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: URL for the sign-up page.
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Redirect URL after sign-in.
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Redirect URL after sign-up.

### Cloudinary
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloud name for Cloudinary.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Upload preset for Cloudinary.
- `CLOUDINARY_API_KEY`: API key for Cloudinary.
- `CLOUDINARY_API_SECRET`: API secret for Cloudinary.

### Razorpay
- `RAZORPAY_KEY_ID`: Key ID for Razorpay.
- `RAZORPAY_KEY_SECRET`: Key secret for Razorpay.
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Public key ID for Razorpay.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd imaginify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and populate it with the required environment variables (refer to the example above).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Acknowledgments

- [Clerk](https://clerk.dev)
- [Cloudinary](https://cloudinary.com)
- [Razorpay](https://razorpay.com)
- [MongoDB](https://www.mongodb.com)
