import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: String, required: true }],
  status: [{ type: String, required: true }],
  orderdate: [{ type: String, required: true }],
  action: [{ type: String, required: true }],
  paymentMethod: [{ type: String, required: true }],
  totalAmount: Number,
  
} ,
{ timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);
export default Order;
