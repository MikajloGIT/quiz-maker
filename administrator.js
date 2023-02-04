let numOfQuestions = 0;

const savedQuestions = JSON.parse(localStorage.getItem("questions"));
const savedAnswers = JSON.parse(localStorage.getItem("answers"));

if (savedQuestions) {
  savedQuestions.forEach((question) => {
    addNewQuestion(question, numOfQuestions++, savedAnswers);
  });
}

//dodavanje novog pitanja pritiskom da dugme '+Add Question'
const addQuestionBtn = document.getElementById("add-question-btn");

addQuestionBtn.addEventListener("click", () => {
  addNewQuestion("", numOfQuestions++);
});

function addNewQuestion(qValue, questionNum, savedAnswers) {
  let numOfAnswers = 0;
  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question-container");

  newQuestion.innerHTML = `
  <div class="tools">
    <button class="editQ"><i class="fa-solid fa-edit"></i></button>
    <span id="qNum" style="display: none">1</span>
    <button class="deleteQ"><i class="fa-solid fa-trash-alt"></i></button>
  </div>
  <div class="question-read hidden"></div>
  <div class="question-edit">
    <div>
      <h2>Question</h2>
      <input
        type="text"
        class="question-text"
        placeholder="Enter question"
        value="${qValue}"
        required
      />
    </div>
    <div>
      <h2>Possible answers</h2>
      <div class="answers-container"></div>
      <div class="add-answer-btn">+Add New</div>
      <button class="save-question-btn">Save</button>
    </div>
  </div>
  `;

  document.body.appendChild(newQuestion);

  if (savedAnswers) {
    savedAnswers[questionNum].forEach((answer) => {
      const tmp = answer.valid ? "checked" : "";

      addAnswer(answer.answer, tmp);
    });
  } else addAnswer("", "checked");

  //tool meni funkcije (delete i edit)
  const editQBtn = newQuestion.querySelector(".editQ");
  const deleteQBtn = newQuestion.querySelector(".deleteQ");
  const questionRead = newQuestion.querySelector(".question-read");
  const questionEdit = newQuestion.querySelector(".question-edit");

  editQBtn.addEventListener("click", () => {
    questionRead.classList.add("hidden");
    questionEdit.classList.remove("hidden");
    editQBtn.style.visibility = "hidden";
  });

  deleteQBtn.addEventListener("click", () => {
    newQuestion.remove();
    updateLocalStorage();
  });

  //dodaj novi odgovor pritiskom na dugme '+Add New'
  const addAnswerBtn = newQuestion.querySelector(".add-answer-btn");

  addAnswerBtn.addEventListener("click", function () {
    addAnswer();
  });

  function addAnswer(aValue = "", checked = "") {
    const answersContainer = newQuestion.querySelector(".answers-container");
    const newAnswer = document.createElement("div");
    newAnswer.classList.add("answer");
    newAnswer.innerHTML = `
    <input
    type="text"
    class="answer-text"
    placeholder="Enter answer"
    value="${aValue}"
    required
    />
    <input
    type="radio"
    name="correct${questionNum}"
    id="q${questionNum}btn${numOfAnswers}"
    class="radioBtn"
    ${checked}
    />
    <label for="q${questionNum}btn${numOfAnswers}" class="label">
    <div class="ball"></div>
    </label>
    <a href="#" class="remove-answer" onclick="removeAnswer(this)">Remove</a>
    `;

    answersContainer.appendChild(newAnswer);
    numOfAnswers++;
  }

  //sacuvaj pitanje pritiskom na dugme 'Save'
  const saveQuestionBtn = newQuestion.querySelector(".save-question-btn");

  saveQuestionBtn.addEventListener("click", () => {
    saveQuestion();
  });

  function saveQuestion() {
    const question = newQuestion.querySelector(".question-text");
    const answers = newQuestion.querySelectorAll(".answer-text");

    if (question.value.trim() != "") {
      let template = `<h2>${question.value.trim()}</h2><ol>`;

      //svaki neprazan odgovor se dodaje u listu
      answers.forEach((answer) => {
        const text = answer.value.trim();
        const valid = answer.nextElementSibling.checked ? "true" : "false";

        if (text != "")
          template += `
            <li><p>${text}</p><small style="color: ${
            valid === "true" ? "green" : "red"
          }">${valid}</small></li>
          `;
      });

      template += `</ol>`;

      questionRead.innerHTML = template;

      editQBtn.style.visibility = "visible";
      questionRead.classList.remove("hidden");
      questionEdit.classList.add("hidden");

      updateLocalStorage();
    }
  }

  if (savedAnswers) {
    saveQuestion();
  }
}

//Ukloni odgovor pritiskom na dugme 'remove'
function removeAnswer(e) {
  e.parentElement.remove();
}

function updateLocalStorage() {
  const questionsContainer = document.querySelectorAll(".question-read");
  const questionsLS = [];
  const answersLS = [];

  questionsContainer.forEach((elem) => {
    try {
      const question = elem.querySelector("h2").innerText;
      questionsLS.push(question);
    } catch (err) {}

    try {
      const answers = elem.querySelectorAll("li");
      const tmp = [];
      answers.forEach((answer) => {
        tmp.push({
          answer: answer.firstElementChild.innerText,
          valid: answer.lastElementChild.innerText === "true",
        });
      });
      if (tmp.length) answersLS.push(tmp);
    } catch (err) {}
  });

  localStorage.setItem("questions", JSON.stringify(questionsLS));
  localStorage.setItem("answers", JSON.stringify(answersLS));
}
