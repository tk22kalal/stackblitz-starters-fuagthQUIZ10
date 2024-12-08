import { SUBJECTS, DIFFICULTY_LEVELS } from '../config.js';

export class QuizSetup {
    constructor(onStartQuiz) {
        this.onStartQuiz = onStartQuiz;
        this.container = document.getElementById('setup-container');
        this.subjectSelect = document.getElementById('subject-select');
        this.subtopicSelect = document.getElementById('subtopic-select');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.questionsSelect = document.getElementById('questions-select');
        this.timeSelect = document.getElementById('time-select');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.difficultyInfo = document.getElementById('difficulty-info');

        this.setupEventListeners();
        this.populateSubjects();
    }

    setupEventListeners() {
        if (this.subjectSelect) {
            this.subjectSelect.addEventListener('change', () => this.handleSubjectChange());
        }
        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', () => this.handleDifficultyChange());
        }
        if (this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', () => this.handleStartQuiz());
        }
    }

    populateSubjects() {
        if (!this.subjectSelect) return;

        Object.keys(SUBJECTS).forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            this.subjectSelect.appendChild(option);
        });
    }

    handleSubjectChange() {
        if (!this.subjectSelect || !this.subtopicSelect) return;

        const selectedSubject = this.subjectSelect.value;
        this.subtopicSelect.innerHTML = '<option value="">Choose a sub-topic...</option>';
        this.subtopicSelect.disabled = !selectedSubject;

        if (selectedSubject && SUBJECTS[selectedSubject]) {
            SUBJECTS[selectedSubject].forEach(subtopic => {
                const option = document.createElement('option');
                option.value = subtopic;
                option.textContent = subtopic;
                this.subtopicSelect.appendChild(option);
            });
        }
    }

    handleDifficultyChange() {
        if (!this.difficultySelect || !this.difficultyInfo) return;

        const selectedDifficulty = this.difficultySelect.value;
        this.difficultyInfo.textContent = DIFFICULTY_LEVELS[selectedDifficulty] || '';
    }

    handleStartQuiz() {
        if (!this.validateSetup()) return;

        const settings = {
            subject: this.subjectSelect.value,
            subtopic: this.subtopicSelect.value,
            difficulty: this.difficultySelect.value,
            questionLimit: parseInt(this.questionsSelect.value),
            timeLimit: parseInt(this.timeSelect.value)
        };

        this.onStartQuiz(settings);
    }

    validateSetup() {
        if (!this.subjectSelect.value) {
            alert('Please select a subject');
            return false;
        }
        if (!this.subtopicSelect.value) {
            alert('Please select a sub-topic');
            return false;
        }
        if (!this.difficultySelect.value) {
            alert('Please select difficulty level');
            return false;
        }
        return true;
    }

    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }
}