import mongoose from 'mongoose';

export default mongoose.model('Config', new mongoose.Schema({
  key: String,
  value: String
}));
