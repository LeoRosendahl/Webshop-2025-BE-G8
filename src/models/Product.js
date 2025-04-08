import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('category', categorySchema);
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
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
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);