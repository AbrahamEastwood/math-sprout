const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const newQuestionButton = document.querySelector("#new-question");

let firstNumber;
let secondNumber;

function makeQuestion() {
  firstNumber = Math.floor(Math.random() * 10) + 1;
  secondNumber = Math.floor(Math.random() * 10) + 1;

  questionText.textContent = `${firstNumber} + ${secondNumber} = ?`;
  answerInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = Number(answerInput.value);
  const correctAnswer = firstNumber + secondNumber;

  if (answer === correctAnswer) {
    feedback.textContent = "That’s right! Great job! 🎉";
    feedback.className = "feedback feedback-correct";
  } else {
    feedback.textContent = "Not quite — try again! You’ve got this.";
    feedback.className = "feedback feedback-try-again";
  }
});

newQuestionButton.addEventListener("click", makeQuestion);

makeQuestion();
