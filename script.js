import { QuizUI } from './js/ui.js';
import { updateAPIKeys } from './js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    let quizUI = new QuizUI(); // Initialize the quiz UI with default or existing keys

    // Elements for API key setup
    const saveApiKeysBtn = document.getElementById('save-api-keys');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');
    const visionApiKeyInput = document.getElementById('vision-api-key'); // Changed to Vision as per context

    if (saveApiKeysBtn) {
        saveApiKeysBtn.addEventListener('click', () => {
            const geminiKey = geminiApiKeyInput?.value.trim();
            const visionKey = visionApiKeyInput?.value.trim();

            if (geminiKey && visionKey) {
                // Update API keys using the provided function
                updateAPIKeys(geminiKey, visionKey);

                // Reinitialize the QuizUI with the new API keys
                if (quizUI) {
                    quizUI.destroy(); // Cleanup the previous instance (optional, if supported)
                }
                quizUI = new QuizUI({
                    geminiApiKey: geminiKey,
                    visionApiKey: visionKey,
                });

                alert('API keys saved and quiz reinitialized successfully!');
            } else {
                alert('Please enter both Gemini and Vision API keys.');
            }
        });
    }
});
