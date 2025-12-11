import mongoose from 'mongoose';

const flashcardSetSchema = new mongoose.Schema({
  subtitleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subtitle',
    required: false  
  },
  videoId: {
    type: String,
    required: true,
    index: true
  },
  videoTitle: String,
  flashcards: [{
    question: {  
      type: String,
      required: true
    },
    answer: {   
      type: String,
      required: true
    },
    cardNumber: Number,  
    reviewCount: {
      type: Number,
      default: 0
    },
    lastReviewed: Date
  }],
  totalCards: Number,
  format: {
    type: String,
    enum: ['markdown', 'pdf', 'json'],
    default: 'json'
  },
  metadata: {
    generatedBy: String, 
    generationTime: Number, 
    tokensUsed: Number
  }
}, {
  timestamps: true
});

flashcardSetSchema.index({ videoId: 1, createdAt: -1 });

export default mongoose.model('FlashcardSet', flashcardSetSchema);