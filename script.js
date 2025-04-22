function startGame() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);

  if (name && age) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Depending on age, determine mode (Adventure for kids or Explorer for adults)
    if (age < 13) {
      alert("You are in Adventure Mode!");
      // Generate kid-friendly question
      generateQuestion('kids');
    } else {
      alert("You are in Explorer Mode!");
      // Generate adult-friendly question
      generateQuestion('adults');
    }
  } else {
    alert("Please enter a valid name and age.");
  }
}

function generateQuestion(mode) {
  // This function will later call the GenAI API to fetch a question based on the mode
  const question = "What is 2 + 2?";
  const options = ["3", "4", "5", "6"];
  
  document.getElementById('question').innerText = question;
  const buttons = document.querySelectorAll('.option');
  
  for (let i = 0; i < options.length; i++) {
    buttons[i].innerText = options[i];
  }
}

function checkAnswer(selectedOption) {
  // This function will check if the selected option is correct
  const correctAnswer = 2;  // Option 2 (4) is correct
  if (selectedOption === correctAnswer) {
    alert("Correct!");
  } else {
    alert("Incorrect. Try again!");
  }
}
