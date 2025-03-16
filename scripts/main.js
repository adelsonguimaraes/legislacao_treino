import { loadQuestions, startQuiz, finishQuiz } from './quizManager.js';
import { updateProgress } from './progressManager.js';

// Elementos da tela
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const startButton = document.getElementById('startButton');
const finishButton = document.getElementById('finishButton');

// Inicializar a aplicação
(async function init() {
    await loadQuestions(); // Carrega as questões
    updateProgress(); // Atualiza o gráfico com o progresso atual
})();

// Evento para o botão "Iniciar"
startButton.addEventListener('click', async () => {
    await startQuiz();
    screen1.style.display = 'none';
    screen2.style.display = 'block';
});

// Evento para o botão "Finalizar"
finishButton.addEventListener('click', () => {
    finishQuiz();
    screen2.style.display = 'none';
    screen1.style.display = 'block';
});