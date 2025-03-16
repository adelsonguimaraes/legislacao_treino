import { hashCode } from './utils.js';

// Salvar a resposta no localStorage
export function saveResponse(question, isCorrect) {
    const questionHash = hashCode(question);
    localStorage.setItem(questionHash, JSON.stringify({ acerto: isCorrect }));
}

// Recuperar todas as respostas salvas no localStorage
export function getSavedResponses() {
    const responses = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        responses[key] = JSON.parse(localStorage.getItem(key));
    }
    return responses;
}