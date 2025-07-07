// Global variables
let currentView = 'parts';
let currentBatch = null;
let currentWordIndex = 0;
let speechRecognition = null;
let speechSynthesis = window.speechSynthesis;
let voices = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserProgress();
    updateProgressDisplay();
});

// Initialize the application
function initializeApp() {
    // Load voices for speech synthesis
    loadVoices();
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.lang = 'en-US';
        
        speechRecognition.onresult = handleSpeechResult;
        speechRecognition.onerror = handleSpeechError;
        speechRecognition.onend = handleSpeechEnd;
    }
    
    // Generate parts and batches
    generatePartsView();
    
    // Show initial view
    showView('parts');
}

// Load voices for speech synthesis
function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
        };
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            showView(view);
        });
    });
    
    // Practice controls
    document.getElementById('prev-word').addEventListener('click', previousWord);
    document.getElementById('next-word').addEventListener('click', nextWord);
    document.getElementById('pronounce-btn').addEventListener('click', pronounceCurrentWord);
    document.getElementById('practice-speaking').addEventListener('click', openSpeechModal);
    
    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeSpeechModal);
    document.getElementById('start-recording').addEventListener('click', startRecording);
    document.getElementById('play-target').addEventListener('click', playTargetWord);
    
    // Review filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterReviewWords(filter);
        });
    });
    
    // Close modal on outside click
    document.getElementById('speech-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSpeechModal();
        }
    });
}

// Show specific view
function showView(view) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.add('hidden');
    });
    document.getElementById(`${view}-view`).classList.remove('hidden');
    
    currentView = view;
    
    // Load view-specific content
    switch (view) {
        case 'parts':
            generatePartsView();
            break;
        case 'practice':
            // Keep current practice session
            break;
        case 'review':
            generateReviewView();
            break;
        case 'stats':
            generateStatsView();
            break;
    }
}

// Generate parts view
function generatePartsView() {
    const partsGrid = document.getElementById('parts-grid');
    partsGrid.innerHTML = '';
    
    vocabularyData.parts.forEach(part => {
        const partCard = createPartCard(part);
        partsGrid.appendChild(partCard);
    });
}

// Create part card
function createPartCard(part) {
    const card = document.createElement('div');
    card.className = 'part-card';
    
    const completedBatches = part.batches.filter(batch => 
        batch.words.every(word => userWordProgress[word.word].mastered)
    ).length;
    
    const progressPercentage = Math.round((completedBatches / part.batches.length) * 100);
    
    card.innerHTML = `
        <div class="part-header">
            <h3 class="part-title">${part.title}</h3>
            <div class="part-progress">${progressPercentage}%</div>
        </div>
        <p class="part-description">${part.description}</p>
        <div class="batches-grid">
            ${part.batches.map(batch => createBatchItem(batch)).join('')}
        </div>
    `;
    
    return card;
}

// Create batch item
function createBatchItem(batch) {
    const completedWords = batch.words.filter(word => 
        userWordProgress[word.word].mastered
    ).length;
    
    const inProgressWords = batch.words.filter(word => 
        userWordProgress[word.word].practiced && !userWordProgress[word.word].mastered
    ).length;
    
    let status = '';
    if (completedWords === batch.words.length) {
        status = 'completed';
    } else if (inProgressWords > 0) {
        status = 'in-progress';
    }
    
    return `
        <div class="batch-item ${status}" onclick="startPractice(${batch.id})">
            <div class="batch-number">Batch ${batch.id}</div>
            <div class="batch-range">${batch.range}</div>
        </div>
    `;
}

// Start practice session
function startPractice(batchId) {
    // Find the batch
    let targetBatch = null;
    vocabularyData.parts.forEach(part => {
        const foundBatch = part.batches.find(batch => batch.id === batchId);
        if (foundBatch) {
            targetBatch = foundBatch;
        }
    });
    
    if (!targetBatch) return;
    
    currentBatch = targetBatch;
    currentWordIndex = 0;
    
    // Show practice view
    showView('practice');
    
    // Update practice session
    updatePracticeSession();
}

// Update practice session
function updatePracticeSession() {
    if (!currentBatch) return;
    
    const word = currentBatch.words[currentWordIndex];
    const title = document.getElementById('practice-batch-title');
    const wordText = document.getElementById('current-word');
    const wordPhonetic = document.getElementById('word-phonetic');
    const wordDefinition = document.getElementById('word-definition');
    const wordExample = document.getElementById('word-example');
    
    title.textContent = `${currentBatch.title} - ${currentWordIndex + 1}/${currentBatch.words.length}`;
    wordText.textContent = word.word;
    wordPhonetic.textContent = word.phonetic;
    wordDefinition.textContent = word.definition;
    wordExample.innerHTML = `<strong>Example:</strong> "${word.example}"`;
    
    // Mark word as seen
    userWordProgress[word.word].seen = true;
    
    // Update navigation buttons
    document.getElementById('prev-word').disabled = currentWordIndex === 0;
    document.getElementById('next-word').disabled = currentWordIndex === currentBatch.words.length - 1;
    
    // Auto-pronounce if enabled
    if (progressData.userPreferences.autoPlay) {
        setTimeout(() => pronounceCurrentWord(), 500);
    }
}

// Navigate to previous word
function previousWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        updatePracticeSession();
    }
}

// Navigate to next word
function nextWord() {
    if (currentWordIndex < currentBatch.words.length - 1) {
        currentWordIndex++;
        updatePracticeSession();
    }
}

// Pronounce current word
function pronounceCurrentWord() {
    if (!currentBatch) return;
    
    const word = currentBatch.words[currentWordIndex];
    pronounceWord(word.word);
}

// Text-to-speech function
function pronounceWord(text) {
    if (!speechSynthesis) return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = progressData.userPreferences.speechSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Use English voice if available
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    speechSynthesis.speak(utterance);
}

// Open speech recognition modal
function openSpeechModal() {
    if (!currentBatch) return;
    
    const word = currentBatch.words[currentWordIndex];
    const modal = document.getElementById('speech-modal');
    const wordToPronounce = document.getElementById('word-to-pronounce');
    const speechStatus = document.getElementById('speech-status');
    const speechFeedback = document.getElementById('speech-feedback');
    
    wordToPronounce.textContent = word.word;
    speechStatus.textContent = 'Click the microphone to start recording';
    speechFeedback.textContent = '';
    speechFeedback.className = 'speech-feedback';
    
    modal.classList.remove('hidden');
}

// Close speech modal
function closeSpeechModal() {
    const modal = document.getElementById('speech-modal');
    modal.classList.add('hidden');
    
    if (speechRecognition) {
        speechRecognition.stop();
    }
}

// Start recording speech
function startRecording() {
    if (!speechRecognition) {
        showSpeechFeedback('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    const recordBtn = document.getElementById('start-recording');
    const speechStatus = document.getElementById('speech-status');
    
    recordBtn.classList.add('recording');
    recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    speechStatus.textContent = 'Listening... Please speak clearly';
    
    speechRecognition.start();
}

// Play target word
function playTargetWord() {
    if (!currentBatch) return;
    
    const word = currentBatch.words[currentWordIndex];
    pronounceWord(word.word);
}

// Handle speech recognition result
function handleSpeechResult(event) {
    const result = event.results[0][0].transcript.toLowerCase();
    const targetWord = currentBatch.words[currentWordIndex].word.toLowerCase();
    
    // Simple similarity check
    const similarity = calculateSimilarity(result, targetWord);
    
    if (similarity > 0.7) {
        showSpeechFeedback('Great! Your pronunciation is correct.', 'success');
        updateWordProgress(currentBatch.words[currentWordIndex].word, true);
    } else {
        showSpeechFeedback(`You said: "${result}". Try again!`, 'error');
        updateWordProgress(currentBatch.words[currentWordIndex].word, false);
    }
    
    resetRecordingButton();
}

// Handle speech recognition error
function handleSpeechError(event) {
    showSpeechFeedback('Sorry, I couldn\'t understand. Please try again.', 'error');
    resetRecordingButton();
}

// Handle speech recognition end
function handleSpeechEnd() {
    resetRecordingButton();
}

// Reset recording button
function resetRecordingButton() {
    const recordBtn = document.getElementById('start-recording');
    const speechStatus = document.getElementById('speech-status');
    
    recordBtn.classList.remove('recording');
    recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
    speechStatus.textContent = 'Click the microphone to start recording';
}

// Show speech feedback
function showSpeechFeedback(message, type) {
    const speechFeedback = document.getElementById('speech-feedback');
    speechFeedback.textContent = message;
    speechFeedback.className = `speech-feedback ${type}`;
}

// Calculate similarity between two strings
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Calculate Levenshtein distance
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Update word progress
function updateWordProgress(word, correct) {
    const progress = userWordProgress[word];
    progress.practiced = true;
    progress.attemptCount++;
    progress.lastPracticed = new Date().toISOString();
    
    if (correct) {
        progress.correctPronunciations++;
    }
    progress.totalPronunciations++;
    
    // Update mastery based on accuracy
    const accuracy = progress.correctPronunciations / progress.totalPronunciations;
    if (accuracy >= 0.8 && progress.attemptCount >= 3) {
        progress.mastered = true;
    } else if (accuracy < 0.5) {
        progress.difficulty = 'difficult';
    }
    
    // Update overall progress
    updateProgressData();
    saveUserProgress();
}

// Update overall progress data
function updateProgressData() {
    const totalWords = Object.keys(userWordProgress).length;
    const completedWords = Object.values(userWordProgress).filter(p => p.practiced).length;
    const masteredWords = Object.values(userWordProgress).filter(p => p.mastered).length;
    const difficultWords = Object.values(userWordProgress).filter(p => p.difficulty === 'difficult').length;
    
    progressData.completedWords = completedWords;
    progressData.masteredWords = masteredWords;
    progressData.difficultWords = difficultWords;
    progressData.overallProgress = Math.round((masteredWords / totalWords) * 100);
    
    // Calculate accuracy rate
    const totalAttempts = Object.values(userWordProgress).reduce((sum, p) => sum + p.totalPronunciations, 0);
    const correctAttempts = Object.values(userWordProgress).reduce((sum, p) => sum + p.correctPronunciations, 0);
    progressData.accuracyRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    
    updateProgressDisplay();
}

// Update progress display
function updateProgressDisplay() {
    // Update progress circle
    const progressText = document.querySelector('.progress-text');
    const progressCircle = document.querySelector('.progress-ring-circle');
    
    progressText.textContent = `${progressData.overallProgress}%`;
    
    const circumference = 2 * Math.PI * 26;
    const offset = circumference - (progressData.overallProgress / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

// Generate review view
function generateReviewView() {
    const reviewGrid = document.getElementById('review-grid');
    reviewGrid.innerHTML = '';
    
    const reviewWords = Object.entries(userWordProgress)
        .filter(([word, progress]) => progress.practiced)
        .map(([word, progress]) => {
            const wordData = findWordData(word);
            return { word, progress, data: wordData };
        })
        .filter(item => item.data);
    
    reviewWords.forEach(item => {
        const reviewItem = createReviewItem(item);
        reviewGrid.appendChild(reviewItem);
    });
}

// Create review item
function createReviewItem(item) {
    const div = document.createElement('div');
    div.className = 'review-item';
    
    const statusClass = item.progress.mastered ? 'mastered' : 
                       item.progress.difficulty === 'difficult' ? 'difficult' : '';
    
    const statusText = item.progress.mastered ? 'Mastered' : 
                      item.progress.difficulty === 'difficult' ? 'Needs Practice' : 'In Progress';
    
    div.innerHTML = `
        <div class="review-word">${item.word}</div>
        <div class="review-definition">${item.data.definition}</div>
        <div class="review-status ${statusClass}">
            <i class="fas fa-${item.progress.mastered ? 'check-circle' : 'clock'}"></i>
            ${statusText}
        </div>
    `;
    
    div.addEventListener('click', () => {
        pronounceWord(item.word);
    });
    
    return div;
}

// Find word data
function findWordData(word) {
    for (const part of vocabularyData.parts) {
        for (const batch of part.batches) {
            const wordData = batch.words.find(w => w.word === word);
            if (wordData) return wordData;
        }
    }
    return null;
}

// Filter review words
function filterReviewWords(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter review items
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(item => {
        const statusElement = item.querySelector('.review-status');
        const isMastered = statusElement.classList.contains('mastered');
        const isDifficult = statusElement.classList.contains('difficult');
        
        let show = true;
        
        if (filter === 'mastered' && !isMastered) {
            show = false;
        } else if (filter === 'difficult' && !isDifficult) {
            show = false;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

// Generate statistics view
function generateStatsView() {
    document.getElementById('streak-count').textContent = progressData.streak;
    document.getElementById('mastered-count').textContent = progressData.masteredWords;
    document.getElementById('practice-time').textContent = progressData.practiceTime;
    document.getElementById('accuracy-rate').textContent = `${progressData.accuracyRate}%`;
}

// Save user progress to localStorage
function saveUserProgress() {
    localStorage.setItem('englishAppProgress', JSON.stringify(progressData));
    localStorage.setItem('englishAppWordProgress', JSON.stringify(userWordProgress));
}

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('englishAppProgress');
    const savedWordProgress = localStorage.getItem('englishAppWordProgress');
    
    if (savedProgress) {
        Object.assign(progressData, JSON.parse(savedProgress));
    }
    
    if (savedWordProgress) {
        Object.assign(userWordProgress, JSON.parse(savedWordProgress));
    }
}

// Initialize daily streak
function updateDailyStreak() {
    const today = new Date().toDateString();
    const lastPractice = localStorage.getItem('lastPracticeDate');
    
    if (lastPractice === today) {
        return; // Already practiced today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastPractice === yesterday.toDateString()) {
        progressData.streak++;
    } else if (lastPractice !== today) {
        progressData.streak = 1;
    }
    
    localStorage.setItem('lastPracticeDate', today);
    saveUserProgress();
}

// Track practice time
function trackPracticeTime() {
    const startTime = Date.now();
    
    return function() {
        const endTime = Date.now();
        const sessionTime = Math.round((endTime - startTime) / 1000 / 60); // minutes
        progressData.practiceTime += sessionTime;
        saveUserProgress();
    };
}

// Initialize practice time tracking
let practiceTimeTracker = null;

// Start practice time tracking when entering practice view
document.addEventListener('DOMContentLoaded', function() {
    const originalShowView = showView;
    
    showView = function(view) {
        if (view === 'practice' && !practiceTimeTracker) {
            practiceTimeTracker = trackPracticeTime();
        } else if (view !== 'practice' && practiceTimeTracker) {
            practiceTimeTracker();
            practiceTimeTracker = null;
        }
        
        originalShowView(view);
    };
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (currentView === 'practice' && currentBatch) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                previousWord();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextWord();
                break;
            case ' ':
                event.preventDefault();
                pronounceCurrentWord();
                break;
            case 'Enter':
                event.preventDefault();
                openSpeechModal();
                break;
        }
    }
});

// Update streak when user practices
const originalUpdateWordProgress = updateWordProgress;
updateWordProgress = function(word, correct) {
    originalUpdateWordProgress(word, correct);
    updateDailyStreak();
};