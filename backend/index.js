require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const xss = require('xss-clean');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// 1. Security Middleware
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter);

// 2. Socket.io Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: Token missing'));

    const decoded = jwt.decode(token); 
    if (!decoded) return next(new Error('Authentication error: Invalid token'));

    const user = await User.findOne({ email: decoded.email }).populate('cafeteriaId');
    if (!user) return next(new Error('Authentication error: User not found'));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// 3. Socket Connection Logic
io.on('connection', (socket) => {
  if (socket.user.cafeteriaId) {
    const room = socket.user.cafeteriaId.canteenCode;
    socket.join(room);
  }
});

app.set('socketio', io);

// 4. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB (Fortress Backend)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 5. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cloudinary', require('./routes/cloudinaryRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/superadmin', require('./routes/superAdminRoutes'));

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'CafeteriaQR Real-time Backend Running', version: '1.2.0' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
