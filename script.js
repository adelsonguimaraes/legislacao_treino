// Variáveis globais
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Elementos da tela
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const startButton = document.getElementById('startButton');
const finishButton = document.getElementById('finishButton');
const questionElement = document.getElementById('question');
const alternativesElement = document.getElementById('alternatives');
const messageElement = document.getElementById('message');
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

// Função para gerar um hash simples a partir de uma string
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Converte para um inteiro de 32 bits
    }
    return hash.toString();
}

// Função para calcular o progresso com base nas respostas salvas no localStorage
function calculateProgress() {
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    // Percorre todas as questões e verifica se há respostas corretas no localStorage
    questions.forEach((question) => {
        const questionHash = hashCode(question.pergunta);
        const savedResponse = localStorage.getItem(questionHash);
        if (savedResponse) {
            const { acerto } = JSON.parse(savedResponse);
            if (acerto) correctAnswers++;
        }
    });

    // Calcula a porcentagem de acertos
    const progress = (correctAnswers / totalQuestions) * 100;
    return progress;
}

// Função para embaralhar as questões (Fisher-Yates Shuffle)
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Escolhe um índice aleatório
        [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
    return array;
}

// Carregar questões do arquivo JSON e embaralhá-las
async function loadQuestions() {
    const response = await fetch('db/questions.json');
    questions = await response.json();
    questions = shuffleQuestions(questions); // Embaralha as questões
}

// Exibir a questão atual
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.pergunta;
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
    const questionHash = hashCode(question.pergunta); // Gera o hash da pergunta
    localStorage.setItem(questionHash, JSON.stringify({ acerto: isCorrect }));

    if (isCorrect) {
        messageElement.textContent = 'Resposta correta!';
        messageElement.className = 'alert alert-success';
        score++;
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
    }, 1000);
}

// Atualizar o gráfico de progresso
function updateProgress() {
    const progress = calculateProgress(); // Calcula o progresso com base no localStorage
    progressChart.data.datasets[0].data = [progress, 100 - progress];
    progressChart.update();
    document.querySelector('.chart-text').textContent = `${Math.round(progress)}%`;
}

// Finalizar o quiz
function finishQuiz() {
    alert(`Quiz finalizado! Você acertou ${score} de ${questions.length} questões.`);
    screen2.style.display = 'none';
    screen1.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    updateProgress();
}

// Evento para o botão "Iniciar"
startButton.addEventListener('click', async () => {
    await loadQuestions();
    screen1.style.display = 'none';
    screen2.style.display = 'block';
    showQuestion();
    updateProgress();
});

// Evento para o botão "Finalizar"
finishButton.addEventListener('click', finishQuiz);

// Carregar as questões e atualizar o progresso ao iniciar a página
(async function init() {
    await loadQuestions(); // Carrega as questões
    updateProgress(); // Atualiza o gráfico com o progresso atual
})();