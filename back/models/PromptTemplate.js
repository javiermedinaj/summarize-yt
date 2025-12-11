import mongoose from 'mongoose';

const promptTemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  description: String,
  category: {
    type: String,
    enum: ['flashcard', 'deep_dive', 'summary', 'quiz', 'general'],
    required: true
  },
  
  template: { 
    type: String, 
    required: true 
  },

  variables: [{
    name: String,        
    description: String,
    required: Boolean,
    defaultValue: String
  }],
  
  example: String,
  
  stats: {
    usageCount: { 
      type: Number, 
      default: 0 
    },
    successfulGenerations: {
      type: Number,
      default: 0
    },
    failedGenerations: {
      type: Number,
      default: 0
    },
    avgGenerationTime: Number,
    avgTokensUsed: Number
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true
});

promptTemplateSchema.virtual('successRate').get(function() {
  const total = this.stats.successfulGenerations + this.stats.failedGenerations;
  return total > 0 ? (this.stats.successfulGenerations / total * 100).toFixed(2) : 0;
});

promptTemplateSchema.set('toJSON', { virtuals: true });

export default mongoose.model('PromptTemplate', promptTemplateSchema);