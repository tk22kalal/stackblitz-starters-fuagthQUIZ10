import { getAPIUrls } from './config.js';

export async function fetchImageForQuestion(query) {
    const API_URLS = getAPIUrls();
    try {
        const response = await fetch(`${API_URLS.image}&q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        }
        return null;
    } catch (error) {
        console.error('Image Search Error:', error);
        return null;
    }
}