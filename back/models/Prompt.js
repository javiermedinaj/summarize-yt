import mongoose from 'mongoose';

const generatedPromptSchema = new mongoose.Schema({
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
  
  deepDivePrompts: [{
    number: Number,  
    title: String,  
    content: String, 
    category: {
      type: String,
      enum: ['analisis_general', 'analisis_critico', 'aplicacion_practica', 'contexto_ampliado', 'pensamiento_critico']
    }
  }],
  
  summary: {
    title: {
      type: String,
      default: 'Resumen Ejecutivo'
    },
    content: String,  
    wordCount: Number
  },
  

  metadata: {
    generatedBy: String,      
    generationTime: Number,   
    tokensUsed: Number,
    promptTemplate: String   
  }
}, {
  timestamps: true
});

generatedPromptSchema.index({ videoId: 1, createdAt: -1 });

export default mongoose.model('GeneratedPrompt', generatedPromptSchema);