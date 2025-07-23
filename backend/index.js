// server.js (Admin Removed)
require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const admin = require('firebase-admin');

// Force CORS headers manually for Pages.dev
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://rs-engineering.pages.dev',
    'https://rs-engineering-admin.pages.dev'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
  } else {
    console.log("✅ Connected to Cloudinary:", result);
  }
});




app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://web-dev:animate2080@cluster0.qwfkw6q.mongodb.net/RnS")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
  
});
const upload = multer({ storage });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";
// Models
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: false }, // Make password optional
  cartData: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
  authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true }
});

const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: {
    type: String,
    enum: ['electronics', 'computer', 'fashion', 'lifestyle'],
    required: true
  },
  new_price: Number,
  old_price: Number,
  description: String, // Added description field
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  sizes: {
    type: [String],
    default: function() {
      return this.category === 'fashion' ? ['S', 'M', 'L', 'XL', 'XXL'] : [];
    }
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});

const Order = mongoose.model("Order", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: Number, name: String, size: String, quantity: Number, price: Number }],
  subtotal: Number,
  shipping: Number,
  total: Number,
  shippingAddress: String,
  phoneNumber: String,
  status: { type: String, default: 'pending' },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  createdAt: { type: Date, default: Date.now }
});
// Add this with your other models
const Review = mongoose.model("Review", {
  productId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
// Add this after your Review model


// Middleware: fetchUser
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: "Please authenticate using valid token" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

// Upload
app.post("/upload", upload.single('product'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({
      success: 1,
      image_url: req.file.path
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Products
app.post('/add-product', async (req, res) => {
  try {
    const { name, image, category, new_price, old_price, sizes, description } = req.body;
    
    // Validate required fields (added description to validation)
    if (!name || !image || !category || !new_price || !description) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields (name, image, category, new_price, description)" 
      });
    }

    // Get next product ID
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    // Prepare product data (added description)
    const productData = {
      id,
      name: sanitizeHtml(name),
      image: sanitizeHtml(image),
      category,
      new_price: Number(new_price),
      old_price: old_price ? Number(old_price) : null,
      description: sanitizeHtml(description), // Added description with sanitization
      // Only include sizes for fashion products
      sizes: category.toLowerCase() === 'fashion' 
        ? (sizes || ["S", "M", "L", "XL", "XXL"])
        : undefined // Will use the model's default (empty array)
    };

    // Create and save product
    const product = new Product(productData);
    await product.save();

    res.json({ 
      success: true, 
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description, // Include description in response
        sizes: product.sizes
      }
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      // Only show stack trace in development
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});;

app.post('/remove-product', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/new-collections', async (req, res) => {
  try {
    let products = await Product.find({});
    let newProducts = products.slice(-8);
    res.send(newProducts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData || []);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders
app.post('/checkout', fetchUser, async (req, res) => {
  try {
    const { items, subtotal, shipping, total, shippingAddress, phoneNumber } = req.body;
    const order = new Order({ 
      userId: req.user.id, 
      items, 
      subtotal, 
      shipping, 
      total,
      shippingAddress,
      phoneNumber
    });
    await order.save();
    await User.findByIdAndUpdate(req.user.id, { cartData: [] });
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/update-cart', fetchUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cartData: req.body.cartData });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const check = await User.findOne({ email });
    if (check) return res.status(400).json({ success: false, error: "Email exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: sanitizeHtml(username),
      email: sanitizeHtml(email),
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.json({ success: false, error: "User not found" });
    
    // Check if user signed up with Google
    if (user.authMethod === 'google') {
      return res.json({ 
        success: false, 
        error: "Please sign in with Google" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, error: "Wrong password" });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Google Authentication Endpoint
app.post('/google-auth', async (req, res) => {
  try {
    const { token, email, name } = req.body;
    
    // Verify Google token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user exists by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for Google auth
      user = new User({
        name: sanitizeHtml(name),
        email: sanitizeHtml(email),
        authMethod: 'google',
        googleId: decodedToken.uid
      });
      await user.save();
    } else if (user.authMethod !== 'google') {
      // Existing user with local auth
      return res.status(400).json({ 
        success: false, 
        error: "Email already registered with password" 
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    
    res.json({ 
      success: true, 
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all orders (No admin check)
app.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status (NO authentication now)
app.patch('/orders/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID (No authentication now)
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: "Order not found" 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Get orders by email
app.get('/orders/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const orders = await Order.find()
      .populate({
        path: 'userId',
        match: { email: email },
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    const filteredOrders = orders.filter(order => order.userId !== null);
    
    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/my-orders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
app.get('/search-products', async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Submit transaction ID and payment method
app.post('/order/submit-transaction', async (req, res) => {
  const { orderId, transactionId, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.transactionId = transactionId;
    order.paymentMethod = paymentMethod;
    order.paymentStatus = "pending"; // or "awaiting verification"
    await order.save();

    res.json({ message: "Transaction ID saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add these routes with your other routes

// Get reviews for a product
app.get('/products/:productId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: parseInt(req.params.productId) })
      .sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new review (protected route)
app.post('/products/:productId/reviews', fetchUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = parseInt(req.params.productId);
    
    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create new review
    const review = new Review({
      productId,
      userId: req.user.id,
      name: user.name,
      rating,
      comment: sanitizeHtml(comment)
    });

    await review.save();
    
    res.json({ 
      success: true, 
      review: {
        id: review._id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        date: review.date
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get average rating for a product
app.get('/products/:productId/rating', async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { productId: parseInt(req.params.productId) } },
      { $group: { 
        _id: null, 
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }}
    ]);
    
    const ratingData = result[0] || { averageRating: 0, reviewCount: 0 };
    res.json({ 
      success: true, 
      averageRating: Math.round(ratingData.averageRating * 10) / 10,
      reviewCount: ratingData.reviewCount
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
