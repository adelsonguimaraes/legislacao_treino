import { questions } from './quizManager.js';
import { hashCode } from './utils.js';
import { getSavedResponses } from './storageManager.js';

// Configuração do gráfico
const progressChart = new Chart(document.getElementById('progressChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [0, 100], // 0% preenchido
            backgroundColor: ['#007bff', '#e9ecef'],
            borderWidth: 0,
        }]
    },
    options: {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
});

// Atualizar o gráfico de progresso e o texto "acertos/total"
export function updateProgress() {
    const progress = calculateProgress(); // Calcula o progresso com base no localStorage
    progressChart.data.datasets[0].data = [progress, 100 - progress];
    progressChart.update();
    document.querySelector('.chart-text').textContent = `${Math.round(progress)}%`;

    // Atualizar o texto "acertos/total"
    const correctAnswers = getCorrectAnswersCount();
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('totalQuestions').textContent = questions.length;
}

// Calcular o progresso com base nas respostas salvas no localStorage
function calculateProgress() {
    const correctAnswers = getCorrectAnswersCount();
    const progress = (correctAnswers / questions.length) * 100;
    return progress;
}

// Contar o número de respostas corretas salvas no localStorage
function getCorrectAnswersCount() {
    let correctAnswers = 0;
    questions.forEach((question) => {
        const questionHash = hashCode(question.pergunta);
        const savedResponse = getSavedResponses()[questionHash];
        if (savedResponse && savedResponse.acerto) {
            correctAnswers++;
        }
    });
    return correctAnswers;
}