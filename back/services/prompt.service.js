import GeneratedPrompt from '../models/Prompt.js';
import PromptTemplate from '../models/PromptTemplate.js';

export async function saveGeneratedPrompts(data) {
    try {
        const generatedPrompt = await GeneratedPrompt.create({
            subtitleId: data.subtitleId,
            videoId: data.videoId,
            videoTitle: data.videoTitle,
            deepDivePrompts: data.deepDivePrompts?.map((prompt, index) => ({
                number: index + 1,
                title: prompt.titulo || prompt.title,
                content: prompt.contenido || prompt.content,
                category: categorizePrompt(prompt.titulo || prompt.title)
            })) || [],
            summary: {
                title: data.summary?.title || 'Resumen Ejecutivo',
                content: data.summary?.content || data.summary?.resumen,
                wordCount: (data.summary?.content || data.summary?.resumen || '').split(' ').length
            },
            metadata: data.metadata || {}
        });

        console.log(`💾 Prompts guardados para video: ${generatedPrompt.videoId}`);
        return generatedPrompt;
    } catch (error) {
        console.error('Error guardando prompts generados:', error);
        throw new Error(`Failed to save generated prompts: ${error.message}`);
    }
}

function categorizePrompt(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('general')) return 'analisis_general';
    if (titleLower.includes('crítico')) return 'analisis_critico';
    if (titleLower.includes('práctica')) return 'aplicacion_practica';
    if (titleLower.includes('contexto')) return 'contexto_ampliado';
    if (titleLower.includes('pensamiento')) return 'pensamiento_critico';
    return 'analisis_general';
}

export async function getGeneratedPromptsByVideoId(videoId) {
    return await GeneratedPrompt.find({ videoId })
        .populate('subtitleId', 'videoTitle videoUrl extractedAt')
        .sort({ createdAt: -1 });
}

export async function getLatestGeneratedPrompts(limit = 20) {
    return await GeneratedPrompt.find()
        .populate('subtitleId', 'videoTitle videoUrl')
        .sort({ createdAt: -1 })
        .limit(limit);
}

export async function getGeneratedPromptById(id) {
    return await GeneratedPrompt.findById(id)
        .populate('subtitleId');
}

export async function deleteGeneratedPrompt(id) {
    return await GeneratedPrompt.findByIdAndDelete(id);
}


export async function savePromptTemplate(data) {
    try {
        const template = await PromptTemplate.create({
            name: data.name,
            description: data.description,
            category: data.category,
            template: data.template,
            variables: data.variables || [],
            example: data.example,
            version: data.version || '1.0.0'
        });
        
        console.log(`💾 Template guardado: ${template.name}`);
        return template;
    } catch (error) {
        throw new Error(`Failed to save template: ${error.message}`);
    }
}

export async function getAllTemplates() {
    return await PromptTemplate.find({ isActive: true })
        .sort({ 'stats.usageCount': -1 });
}

export async function getTemplatesByCategory(category) {
    return await PromptTemplate.find({ category, isActive: true })
        .sort({ 'stats.usageCount': -1 });
}

export async function getTemplateById(id) {
    return await PromptTemplate.findById(id);
}

export async function updateTemplate(id, data) {
    return await PromptTemplate.findByIdAndUpdate(
        id,
        { 
            ...data,
            updatedAt: new Date() 
        },
        { new: true }
    );
}

export async function incrementTemplateUsage(id, success = true, generationTime = 0, tokensUsed = 0) {
    const update = {
        $inc: {
            'stats.usageCount': 1,
            [`stats.${success ? 'successfulGenerations' : 'failedGenerations'}`]: 1
        }
    };
    
    if (success) {
        const template = await PromptTemplate.findById(id);
        if (template) {
            const totalSuccess = template.stats.successfulGenerations + 1;
            update.$set = {
                'stats.avgGenerationTime': ((template.stats.avgGenerationTime || 0) * template.stats.successfulGenerations + generationTime) / totalSuccess,
                'stats.avgTokensUsed': ((template.stats.avgTokensUsed || 0) * template.stats.successfulGenerations + tokensUsed) / totalSuccess
            };
        }
    }
    
    return await PromptTemplate.findByIdAndUpdate(id, update, { new: true });
}

export async function deleteTemplate(id) {
    return await PromptTemplate.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
}


import { generateDeepDivePrompts } from './openai.service.js';

export async function generateDeepDivePrompt(content) {
    try {
        const prompts = await generateDeepDivePrompts(content);
        
        return {
            prompts: prompts, // Array de 5 prompts
            totalPrompts: prompts.length
        };
    } catch (error) {
        console.error('Error generating deep dive prompts:', error);
       
        return {
            prompts: [],
            totalPrompts: 0,
            error: error.message
        };
    }
}