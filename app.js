const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const newQuestionButton = document.querySelector("#new-question");
const operationCheckboxes = document.querySelectorAll('input[name="operation"]');

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

let correctAnswer;

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function makeQuestion() {
  const selectedOperations = [...operationCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedOperations.length === 0) {
    correctAnswer = undefined;
    questionText.textContent = "Choose at least one exercise";
    document.querySelector("#intro").textContent = "Pick one or more types to get started.";
    answerInput.disabled = true;
    answerForm.querySelector("button").disabled = true;
    newQuestionButton.disabled = true;
    clearFeedback();
    return;
  }

  answerInput.disabled = false;
  answerForm.querySelector("button").disabled = false;
  newQuestionButton.disabled = false;

  const operationKey = selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
  const selectedOperation = operations[operationKey];
  const [firstNumber, secondNumber] = selectedOperation.makeNumbers();
  correctAnswer = selectedOperation.calculate(firstNumber, secondNumber);

  questionText.textContent = `${firstNumber} ${selectedOperation.symbol} ${secondNumber} = ?`;
  document.querySelector("#intro").textContent = `Choose what you’d like to practise!`;
  answerInput.value = "";
  clearFeedback();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (correctAnswer === undefined) return;

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
operationCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", makeQuestion));

makeQuestion();
