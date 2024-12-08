import { Quiz } from './quiz.js';
import { SUBJECTS, DIFFICULTY_LEVELS } from './config.js';

export class QuizUI {
    constructor() {
        this.quiz = new Quiz();
        this.initializeElements();
        this.setupEventListeners();
        this.populateSubjects();
    }

    initializeElements() {
        // Setup container elements
        this.setupContainer = document.getElementById('setup-container');
        this.quizContainer = document.getElementById('quiz-container');
        this.scoreContainer = document.getElementById('score-container');

        // Form elements
        this.subjectSelect = document.getElementById('subject-select');
        this.subtopicSelect = document.getElementById('subtopic-select');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.questionsSelect = document.getElementById('questions-select');
        this.timeSelect = document.getElementById('time-select');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.difficultyInfo = document.getElementById('difficulty-info');

        // Quiz elements
        this.questionText = document.getElementById('question-text');
        this.questionImage = document.getElementById('question-image');
        this.optionsContainer = document.getElementById('options-container');
        this.explanationContainer = document.getElementById('explanation-container');
        this.learningObjectivesContainer = document.getElementById('learning-objectives-container');
        this.nextBtnContainer = document.getElementById('next-button-container');
        this.nextBtn = document.getElementById('next-btn');

        // Timer and progress elements
        this.timerElement = document.getElementById('time-remaining');
        this.currentQuestionElement = document.getElementById('current-question');
        this.totalQuestionsElement = document.getElementById('total-questions');

        // Score elements
        this.totalAttemptedElement = document.getElementById('total-attempted');
        this.correctAnswersElement = document.getElementById('correct-answers');
        this.wrongAnswersElement = document.getElementById('wrong-answers');
        this.scorePercentageElement = document.getElementById('score-percentage');
        this.restartBtn = document.getElementById('restart-btn');
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
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleNextQuestion());
        }
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restartQuiz());
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

    async handleStartQuiz() {
        if (!this.validateSetup()) return;

        const settings = {
            subject: this.subjectSelect.value,
            subtopic: this.subtopicSelect.value,
            difficulty: this.difficultySelect.value,
            questionLimit: parseInt(this.questionsSelect.value),
            timeLimit: parseInt(this.timeSelect.value)
        };

        this.quiz.difficulty = settings.difficulty;
        this.quiz.timeLimit = settings.timeLimit;
        this.quiz.questionLimit = settings.questionLimit;

        this.setupContainer.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');

        await this.loadNextQuestion();
    }

    async loadNextQuestion() {
        const question = await this.quiz.generateQuestion(this.subjectSelect.value);
        if (!question) {
            this.showResults();
            return;
        }

        this.displayQuestion(question);
    }

    displayQuestion(question) {
        this.questionText.textContent = question.question;
        
        if (question.imageUrl) {
            this.questionImage.innerHTML = `<img src="${question.imageUrl}" alt="Question Image" class="question-image">`;
            this.questionImage.classList.remove('hidden');
        } else {
            this.questionImage.innerHTML = '';
            this.questionImage.classList.add('hidden');
        }

        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.handleOptionClick(index, question.correctIndex));
            this.optionsContainer.appendChild(optionElement);
        });

        this.explanationContainer.classList.add('hidden');
        this.learningObjectivesContainer.classList.add('hidden');
        this.nextBtnContainer.classList.add('hidden');

        // Update progress
        this.currentQuestionElement.textContent = this.quiz.questionsAnswered + 1;
        this.totalQuestionsElement.textContent = this.quiz.questionLimit || '∞';

        // Start timer if needed
        if (this.quiz.timeLimit > 0) {
            this.startTimer();
        }
    }

    async handleOptionClick(selectedIndex, correctIndex) {
        const options = this.optionsContainer.children;
        
        // Disable all options
        Array.from(options).forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // Show correct/incorrect
        options[selectedIndex].classList.add(selectedIndex === correctIndex ? 'correct' : 'incorrect');
        options[correctIndex].classList.add('correct');

        // Update score
        if (selectedIndex === correctIndex) {
            this.quiz.score++;
        } else {
            this.quiz.wrongAnswers++;
        }
        this.quiz.questionsAnswered++;

        // Show explanation and learning objectives
        await this.showExplanation(this.questionText.textContent, 
                                 Array.from(options).map(opt => opt.textContent), 
                                 correctIndex);

        this.nextBtnContainer.classList.remove('hidden');
    }

    async showExplanation(question, options, correctIndex) {
        const explanation = await this.quiz.getExplanation(question, options, correctIndex);
        const learningObjectives = await this.quiz.getLearningObjectives(question, options, correctIndex);

        this.explanationContainer.innerHTML = `
            <div class="explanation-content">
                <pre>${explanation.text}</pre>
                ${explanation.imageUrl ? `
                    <div class="explanation-image">
                        <img src="${explanation.imageUrl}" alt="Explanation diagram" class="medical-diagram">
                    </div>
                ` : ''}
            </div>
        `;
        this.explanationContainer.classList.remove('hidden');

        this.learningObjectivesContainer.innerHTML = learningObjectives.content;
        this.learningObjectivesContainer.classList.remove('hidden');
    }

    handleNextQuestion() {
        this.loadNextQuestion();
    }

    showResults() {
        const results = this.quiz.getResults();
        
        this.quizContainer.classList.add('hidden');
        this.scoreContainer.classList.remove('hidden');
        
        this.totalAttemptedElement.textContent = results.total;
        this.correctAnswersElement.textContent = results.correct;
        this.wrongAnswersElement.textContent = results.wrong;
        this.scorePercentageElement.textContent = results.percentage;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        let timeLeft = this.quiz.timeLimit;
        this.updateTimerDisplay(timeLeft);

        this.timer = setInterval(() => {
            timeLeft--;
            this.updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeUp();
            }
        }, 1000);
    }

    updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        this.timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleTimeUp() {
        const options = this.optionsContainer.children;
        Array.from(options).forEach(option => {
            option.style.pointerEvents = 'none';
        });
        this.nextBtnContainer.classList.remove('hidden');
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

    restartQuiz() {
        window.location.reload();
    }
}