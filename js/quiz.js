import { generateQuestion } from './questionGenerator.js';
import { fetchFromAPI } from './api.js';
import { fetchExplanationImage } from './explanationImageService.js';
import { generateLearningObjectives } from './learningObjectivesService.js';

export class Quiz {
    constructor() {
        this.currentQuestion = null;
        this.score = 0;
        this.timer = null;
        this.timeLimit = 0;
        this.questionLimit = 0;
        this.questionsAnswered = 0;
        this.wrongAnswers = 0;
        this.difficulty = '';
        this.subject = '';
        this.subtopic = '';
    }

    async generateQuestion(subject) {
        if (this.questionLimit && this.questionsAnswered >= this.questionLimit) {
            return null;
        }

        try {
            const question = await generateQuestion(subject, this.difficulty);
            this.currentQuestion = question;
            return question;
        } catch (error) {
            console.error('Error generating question:', error);
            return {
                question: 'Failed to generate question. Please check your API keys and try again.',
                options: ['Error', 'Error', 'Error', 'Error'],
                correctIndex: 0
            };
        }
    }

    async getExplanation(question, options, correctIndex) {
        try {
            const prompt = `
                For this ${this.difficulty.toLowerCase()} level medical question:
                Question: "${question}"
                Options: ${options.map((opt, i) => `${i + 1}. ${opt}`).join(', ')}
                Correct Answer: ${options[correctIndex]}

                Please provide a detailed explanation in this format:
                CORRECT ANSWER (${options[correctIndex]}):
                • Point 1 about why it's correct
                • Point 2 about why it's correct

                WHY OTHER OPTIONS ARE INCORRECT:
                ${options.map((opt, i) => i !== correctIndex ? `${opt}:
                • Point 1 why it's wrong
                • Point 2 why it's wrong` : '').filter(Boolean).join('\n\n')}
            `;

            const explanation = await fetchFromAPI(prompt);
            const imageUrl = await fetchExplanationImage(question);

            return {
                text: explanation || 'Explanation not available.',
                imageUrl: imageUrl
            };
        } catch (error) {
            console.error('Error getting explanation:', error);
            return {
                text: 'Failed to load explanation. Please check your API keys and try again.',
                imageUrl: null
            };
        }
    }

    async getLearningObjectives(question, options, correctIndex) {
        try {
            return await generateLearningObjectives(question, options[correctIndex], 
                await this.getExplanation(question, options, correctIndex));
        } catch (error) {
            console.error('Error getting learning objectives:', error);
            return {
                content: '<p>Failed to load learning objectives. Please check your API keys and try again.</p>'
            };
        }
    }

    getResults() {
        return {
            total: this.questionsAnswered,
            correct: this.score,
            wrong: this.wrongAnswers,
            percentage: this.questionsAnswered > 0 
                ? Math.round((this.score / this.questionsAnswered) * 100) 
                : 0
        };
    }
}