// Assuming you have a form for quiz input
const quizForm = document.getElementById('quiz-form');
quizForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Get user inputs (prompt, age, subject)
  const prompt = document.getElementById('quiz-prompt').value;
  const age = document.getElementById('age-input').value; // Example for age input
  const subject = document.getElementById('subject-input').value; // Example for subject input

  // Prepare the request body
  const requestData = {
    prompt: prompt,
    age: parseInt(age),
    subject: subject,
  };

  try {
    // Call the Netlify serverless function
    const response = await fetch('/.netlify/functions/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    
    // Handle the quiz question - updated to check 'answer' field
    if (data.answer) {
      // Display the generated question (you can customize this part)
      document.getElementById('quiz-output').textContent = data.answer;
    } else {
      document.getElementById('quiz-output').textContent = 'Sorry, something went wrong.';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('quiz-output').textContent = 'Error generating quiz question.';
  }
});
