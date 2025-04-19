// models/faqModel.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
  question: String,
  answer: String,
  askedCount: { type: Number, default: 1 },
  lastAskedAt: { type: Date, default: Date.now },
});

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
