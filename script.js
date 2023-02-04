const questionContainer = document.getElementById("question-container");

const questions = JSON.parse(localStorage.getItem("questions"));

const answersList = JSON.parse(localStorage.getItem("answers"));

let score = 0;
let cardNum = 0;
getNewQuestion(cardNum);

function getNewQuestion(cardNum) {
  questionContainer.innerHTML = `
    <h2 class="question">${questions[cardNum]}</h2>
      <div class="answers">
      </div>
      <button class="submit">Submit</button>
  `;
  for (let i = 0; i < answersList[cardNum].length; i++) {
    const tmp = document.querySelector(".answers");

    const elem = document.createElement("div");
    elem.classList.add("answer");
    elem.innerHTML = `
      <input type="radio" name="answer" id="btn${i}" class="answer-btn" />
      <label for="btn${i}" class="answer-label">${answersList[cardNum][i].answer}</label>
    `;

    tmp.appendChild(elem);
  }
  const allAnswers = document.querySelectorAll(".answer-btn");
  const submit = document.querySelector(".submit");
  let guessed = false;

  allAnswers.forEach((answer, idx) => {
    answer.addEventListener("click", () => {
      guessed = answersList[cardNum][idx].valid;
      submit.classList.add("active");
    });
  });

  submit.addEventListener("click", () => {
    if (submit.classList.contains("active")) {
      score += guessed;
      if (cardNum < questions.length - 1) {
        getNewQuestion(++cardNum);
      } else {
        questionContainer.innerHTML = `
        <h2 class="question" style="margin-top: 20px;">You answered ${score}/${questions.length} questions correctly</h2>
      <button class="submit active" onclick="getNewQuestion(0)">Reload</button>
      `;
        score = 0;
      }
    }
  });
}
