import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Frukt", "Kött", "Mejeri", "Övrigt"],
  },
  price: {
    type: Number,
    required: true,
    min: 0.0
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  //sätter req på false atm. bör fungera sedan när fend vill skicka upp.
  imageUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);