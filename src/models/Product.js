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
  //ändrat nu till true. alla typer av images bör fungera att ladda upp.
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);