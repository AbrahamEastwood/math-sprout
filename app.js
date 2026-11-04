const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const newQuestionButton = document.querySelector("#new-question");
const operationSelect = document.querySelector("#operation");
const intro = document.querySelector("#intro");

const operations = {
  addition: {
    label: "addition",
    symbol: "+",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first + second;
    },
  },
  subtraction: {
    label: "subtraction",
    symbol: "−",
    makeNumbers() {
      const first = randomNumber(10);
      const second = randomNumber(10);
      return [Math.max(first, second), Math.min(first, second)];
    },
    calculate(first, second) {
      return first - second;
    },
  },
  multiplication: {
    label: "multiplication",
    symbol: "×",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first * second;
    },
  },
  division: {
    label: "division",
    symbol: "÷",
    makeNumbers() {
      const divisor = randomNumber(10);
      const quotient = randomNumber(10);
      return [divisor * quotient, divisor];
    },
    calculate(first, second) {
      return first / second;
    },
  },
};

let firstNumber;
let secondNumber;
let correctAnswer;

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function makeQuestion() {
  const operation = operations[operationSelect.value];
  [firstNumber, secondNumber] = operation.makeNumbers();
  correctAnswer = operation.calculate(firstNumber, secondNumber);

  questionText.textContent = `${firstNumber} ${operation.symbol} ${secondNumber} = ?`;
  intro.textContent = `Let’s practise ${operation.label}!`;
  answerInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = Number(answerInput.value);

  if (answer === correctAnswer) {
    feedback.textContent = "That’s right! Great job! 🎉";
    feedback.className = "feedback feedback-correct";
  } else {
    feedback.textContent = "Not quite — try again! You’ve got this.";
    feedback.className = "feedback feedback-try-again";
  }
});

newQuestionButton.addEventListener("click", makeQuestion);
operationSelect.addEventListener("change", makeQuestion);

makeQuestion();
