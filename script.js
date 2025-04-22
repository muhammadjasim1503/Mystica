// Replace with your actual AIML API key
const apiKey = 'YOUR_AIML_API_KEY';

// Start the game
function startGame() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);

  if (name && age) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Based on age, choose quiz type
    if (age < 13) {
      alert("You are in Adventure Mode!");
      // Call AIML API to get a kid-friendly question
      generateQuestion('kids');
    } else {
      alert("You are in Explorer Mode!");
      // Call AIML API to get an adult-friendly question
      generateQuestion('adults');
    }
  } else {
    alert("Please enter a valid name and age.");
  }
}

// Generate quiz question based on age group (kids/adults)
function generateQuestion(mode) {
  const subject = "math";  // Default subject, but you can allow user to select subject
  
  // Construct the API request for AIML
  const requestBody = {
    prompt: `Generate a ${mode} quiz question on ${subject}`,
    apiKey: apiKey  // Attach your AIML API key
  };

  fetch('https://api.aiml.ai/v1/query', {  // Replace with the correct AIML endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(data => {
    // Assuming the response contains a question and options (adjust based on AIML response format)
    const question = data.response.question;
    const options = data.response.options || ["Option 1", "Option 2", "Option 3", "Option 4"];

    document.getElementById('question').innerText = question;
    const buttons = document.querySelectorAll('.option');
    
    for (let i = 0; i < options.length; i++) {
      buttons[i].innerText = options[i];
    }
  })
  .catch(error => console.error('Error fetching data from AIML API:', error));
}

// Check answer based on selected option
function checkAnswer(selectedOption) {
  const correctAnswer = 2;  // Example: assume Option 2 is the correct answer
  if (selectedOption === correctAnswer) {
    alert("Correct!");
  } else {
    alert("Incorrect. Try again!");
  }
}
