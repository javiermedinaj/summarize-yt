import mongoose from 'mongoose';

const subtitleSchema = new mongoose.Schema({
  videoId: { 
    type: String, 
    required: true, 
    index: true 
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoTitle: String,
  content: { 
    type: String, 
    required: true 
  },
  language: {
    type: String,
    default: 'en'
  },
  wordCount: Number,
  extractedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.model('Subtitle', subtitleSchema);