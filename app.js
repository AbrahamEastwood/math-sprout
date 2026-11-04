const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const newQuestionButton = document.querySelector("#new-question");
const checkButton = document.querySelector("#check-answer");
const checkLabel = document.querySelector("#check-label");
const operationCheckboxes = document.querySelectorAll('input[name="operation"]');
const numberPadButtons = document.querySelectorAll(".number-key");
const deleteDigitButton = document.querySelector("#delete-digit");
const clearAnswerButton = document.querySelector("#clear-answer");

const operations = {
  addition: {
    symbol: "+",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first + second;
    },
  },
  subtraction: {
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
    symbol: "×",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first * second;
    },
  },
  division: {
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
let answerWasCorrect = false;

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

  answerWasCorrect = false;
  checkLabel.textContent = "Check answer";

  if (selectedOperations.length === 0) {
    correctAnswer = undefined;
    questionText.textContent = "Choose at least one exercise";
    document.querySelector("#intro").textContent = "Pick one or more types to get started.";
    answerInput.disabled = true;
    checkButton.disabled = true;
    newQuestionButton.disabled = true;
    numberPadButtons.forEach((button) => (button.disabled = true));
    clearFeedback();
    return;
  }

  answerInput.disabled = false;
  checkButton.disabled = false;
  newQuestionButton.disabled = false;
  numberPadButtons.forEach((button) => (button.disabled = false));

  const operationKey = selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
  const selectedOperation = operations[operationKey];
  const [firstNumber, secondNumber] = selectedOperation.makeNumbers();
  correctAnswer = selectedOperation.calculate(firstNumber, secondNumber);

  questionText.textContent = `${firstNumber} ${selectedOperation.symbol} ${secondNumber} = ?`;
  document.querySelector("#intro").textContent = "Choose what you’d like to practise!";
  answerInput.value = "";
  clearFeedback();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (correctAnswer === undefined) return;

  // Once an answer is correct, the next Enter/check action moves on.
  if (answerWasCorrect) {
    makeQuestion();
    return;
  }

  const value = answerInput.value.trim();
  if (value === "" || !/^-?\d+$/.test(value)) {
    feedback.textContent = "Type or tap your answer first.";
    feedback.className = "feedback feedback-try-again";
    return;
  }

  if (Number(value) === correctAnswer) {
    answerWasCorrect = true;
    feedback.textContent = "That’s right! Great job! 🎉 Press Enter again for the next one.";
    feedback.className = "feedback feedback-correct";
    checkLabel.textContent = "Next exercise";
  } else {
    feedback.textContent = "Not quite — try again! You’ve got this.";
    feedback.className = "feedback feedback-try-again";
  }
});

numberPadButtons.forEach((button) => {
  const digit = button.dataset.digit;
  if (!digit) return;

  button.addEventListener("click", () => {
    if (answerWasCorrect) return;
    answerInput.value += digit;
    answerInput.focus({ preventScroll: true });
    clearFeedback();
  });
});

deleteDigitButton.addEventListener("click", () => {
  if (answerWasCorrect) return;
  answerInput.value = answerInput.value.slice(0, -1);
  answerInput.focus({ preventScroll: true });
  clearFeedback();
});

clearAnswerButton.addEventListener("click", () => {
  if (answerWasCorrect) return;
  answerInput.value = "";
  answerInput.focus({ preventScroll: true });
  clearFeedback();
});

answerInput.addEventListener("input", () => {
  if (answerWasCorrect) answerWasCorrect = false;
  checkLabel.textContent = "Check answer";
  clearFeedback();
});

newQuestionButton.addEventListener("click", makeQuestion);
operationCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", makeQuestion));

makeQuestion();
