import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/db.js'; 
import bonsaiRoutes from './routes/bonsaiRoutes.js'; 
import treeRoutes from './routes/treeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './Midileware/errorMiddleware.js';
import cartRoutes from'./routes/cartRoutes.js'
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRouts.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import orderRoutes from './routes/orderRouts.js';

dotenv.config();


connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Tree Care API is running...');
});

app.use(cors({ origin: `${process.env.FRONTEND_URL}` }));
app.use('/api/users', userRoutes);
app.use('/api/bonsai', bonsaiRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 