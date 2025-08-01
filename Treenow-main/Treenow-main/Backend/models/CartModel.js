import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
  userId: String, // Unique user identifier (e.g., user email or ID)
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;