require('dotenv').config();  // Load environment variables from .env file

exports.CONFIG = {
    baseUrl: process.env.BASE_URL,
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET || 'userAuth',
    tokenExp: process.env.TOKEN_EXP || '1d',  // Default to 1 day if not provided
    nodeEnv: process.env.NODE_ENV || 'development',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    stripeScretKey: process.env.STRIPE_SECRET_KEY,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    razorPayKeyId: process.env.RAZORPAY_KEY_ID,
    razorPayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

