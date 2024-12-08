export class APIKeyManager {
    constructor() {
        this.container = document.getElementById('api-key-container');
        this.geminiInput = document.getElementById('gemini-api-key');
        this.googleInput = document.getElementById('google-api-key');
        this.saveButton = document.getElementById('save-api-keys');
        
        this.setupEventListeners();
        this.loadSavedKeys();
    }

    setupEventListeners() {
        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => this.saveKeys());
        }
    }

    loadSavedKeys() {
        const savedGeminiKey = localStorage.getItem('geminiApiKey');
        const savedGoogleKey = localStorage.getItem('googleApiKey');
        
        if (this.geminiInput && savedGeminiKey) {
            this.geminiInput.value = savedGeminiKey;
        }
        if (this.googleInput && savedGoogleKey) {
            this.googleInput.value = savedGoogleKey;
        }
    }

    saveKeys() {
        if (!this.geminiInput || !this.googleInput) return;

        const geminiKey = this.geminiInput.value.trim();
        const googleKey = this.googleInput.value.trim();
        
        if (geminiKey && googleKey) {
            localStorage.setItem('geminiApiKey', geminiKey);
            localStorage.setItem('googleApiKey', googleKey);
            alert('API keys saved successfully!');
        } else {
            alert('Please enter both API keys.');
        }
    }
}