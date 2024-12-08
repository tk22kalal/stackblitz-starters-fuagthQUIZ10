import { QuizUI } from './js/ui.js';
import { updateAPIKeys } from './js/config.js';

// Initialize the quiz application
document.addEventListener('DOMContentLoaded', () => {
    const quizUI = new QuizUI();
    
    // Handle API key setup
    const saveApiKeysBtn = document.getElementById('save-api-keys');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');
    const googleApiKeyInput = document.getElementById('google-api-key');

    if (saveApiKeysBtn) {
        saveApiKeysBtn.addEventListener('click', () => {
            const geminiKey = geminiApiKeyInput.value.trim();
            const googleKey = googleApiKeyInput.value.trim();
            
            if (geminiKey && googleKey) {
                updateAPIKeys(geminiKey, googleKey);
                alert('API keys saved successfully!');
            } else {
                alert('Please enter both API keys.');
            }
        });
    }
});
