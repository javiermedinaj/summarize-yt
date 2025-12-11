import FlashcardSet from '../models/Flashcard.js';

export async function saveFlashcardSet(data) {
    try {
        const flashcardSet = await FlashcardSet.create({
            subtitleId: data.subtitleId,
            videoId: data.videoId,
            videoTitle: data.videoTitle,
            flashcards: data.flashcards.map((card, index) => ({
                question: card.pregunta || card.question,
                answer: card.respuesta || card.answer,
                cardNumber: index + 1
            })),
            totalCards: data.flashcards.length,
            format: data.format || 'json',
            metadata: data.metadata || {}
        });

        console.log(`💾 ${flashcardSet.totalCards} flashcards guardadas en set: ${flashcardSet._id}`);
        return flashcardSet;
    } catch (error) {
        console.error('Error guardando flashcard set:', error);
        throw new Error(`Failed to save flashcard set: ${error.message}`);
    }
}

export async function getFlashcardSetsByVideoId(videoId) {
    return await FlashcardSet.find({ videoId })
        .populate('subtitleId', 'videoTitle videoUrl extractedAt')
        .sort({ createdAt: -1 });
}

export async function getLatestFlashcardSets(limit = 20) {
    return await FlashcardSet.find()
        .populate('subtitleId', 'videoTitle videoUrl')
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-flashcards.reviewCount -flashcards.lastReviewed'); 
}

export async function getFlashcardSetById(id) {
    return await FlashcardSet.findById(id)
        .populate('subtitleId');
}

export async function updateFlashcardReview(setId, cardIndex) {
    return await FlashcardSet.findOneAndUpdate(
        { _id: setId },
        {
            $inc: { [`flashcards.${cardIndex}.reviewCount`]: 1 },
            $set: { [`flashcards.${cardIndex}.lastReviewed`]: new Date() }
        },
        { new: true }
    );
}

export async function deleteFlashcardSet(id) {
    return await FlashcardSet.findByIdAndDelete(id);
}

export async function getStatsByVideoId(videoId) {
    const sets = await FlashcardSet.find({ videoId });
    
    const totalCards = sets.reduce((sum, set) => sum + set.totalCards, 0);
    const totalReviews = sets.reduce((sum, set) => {
        return sum + set.flashcards.reduce((s, card) => s + card.reviewCount, 0);
    }, 0);
    
    return {
        totalSets: sets.length,
        totalCards,
        totalReviews,
        avgCardsPerSet: sets.length > 0 ? (totalCards / sets.length).toFixed(2) : 0,
        latestGeneration: sets[0]?.createdAt
    };
}