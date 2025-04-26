let currentQuestion = '';

const quizForm = document.getElementById('quiz-form');
const quizOutput = document.getElementById('quiz-output');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');
const feedbackDiv = document.getElementById('feedback');

quizForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  quizOutput.textContent = 'Generating question...';
  feedbackDiv.textContent = '';

  // Get user inputs
  const prompt = document.getElementById('quiz-prompt').value;
  const age = document.getElementById('age-input').value;
  const subject = document.getElementById('subject-input').value;

  // Request a question from the backend
  const response = await fetch('/.netlify/functions/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, age: parseInt(age), subject })
  });
  const data = await response.json();
  if (data.question) {
    currentQuestion = data.question;
    quizOutput.textContent = data.question;
    answerForm.style.display = 'block';
  } else {
    quizOutput.textContent = 'Sorry, could not generate a question.';
    answerForm.style.display = 'none';
  }
});

answerForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  feedbackDiv.textContent = 'Checking answer...';
  const userAnswer = answerInput.value;
  if (!currentQuestion || !userAnswer) return;

  // Request answer checking from the backend
  const response = await fetch('/.netlify/functions/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: currentQuestion, userAnswer })
  });
  const data = await response.json();
  if (data.feedback) {
    feedbackDiv.textContent = data.feedback;
  } else {
    feedbackDiv.textContent = 'Sorry, could not check the answer.';
  }
});
