import { shuffle } from './utils.js';
import { saveResponse } from './storageManager.js';
import { updateProgress } from './progressManager.js';

// Exportar a variável questions
export let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Elementos da tela
const questionElement = document.getElementById('question');
const alternativesElement = document.getElementById('alternatives');
const messageElement = document.getElementById('message');
const categoryElement = document.getElementById('category'); // Novo elemento para a categoria

// Carregar questões do arquivo JSON e embaralhá-las
export async function loadQuestions() {
    const response = await fetch('db/questions.json');
    questions = await response.json();
    questions = shuffle(questions); // Embaralha as questões
}

// Iniciar o quiz
export async function startQuiz() {
    currentQuestionIndex = 0;
    showQuestion();
    updateProgress();
}

// Exibir a questão atual
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.pergunta;
    categoryElement.textContent = `Tema: ${question.categoria}`; // Exibe a categoria
    alternativesElement.innerHTML = ''; // Limpa alternativas anteriores

    // Adiciona as alternativas como botões
    ['A', 'B', 'C'].forEach((option) => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary';
        button.textContent = `${option}) ${question[`alternativa_${option.toLowerCase()}`]}`;
        button.addEventListener('click', () => checkAnswer(option));
        alternativesElement.appendChild(button);
    });
}

// Verificar a resposta do usuário
function checkAnswer(selectedOption) {
    const question = questions[currentQuestionIndex];
    const correctOption = question.alternativa_correta;
    const isCorrect = selectedOption === correctOption;

    // Salvar a resposta no localStorage
    saveResponse(question.pergunta, isCorrect);

    if (isCorrect) {
        messageElement.textContent = 'Resposta correta!';
        messageElement.className = 'alert alert-success';
    } else {
        messageElement.textContent = `Resposta incorreta! A correta era: ${correctOption}`;
        messageElement.className = 'alert alert-danger';
    }
    messageElement.style.display = 'block';

    // Avançar para a próxima questão após 1 segundo
    setTimeout(() => {
        messageElement.style.display = 'none';
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            updateProgress();
        } else {
            finishQuiz();
        }
    }, 2000);
}

// Finalizar o quiz
export function finishQuiz() {
    currentQuestionIndex = 0;
    updateProgress();
}