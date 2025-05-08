import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsS8nLvi5WJJHv8LmRomO4StBb7Hq8xk4",
  authDomain: "cpd-anytime.firebaseapp.com",
  projectId: "cpd-anytime",
  storageBucket: "cpd-anytime.appspot.com",
  messagingSenderId: "221514305010",
  appId: "1:221514305010:web:fe079e7a6e59218e4daf6b",
  measurementId: "G-CCM2M1JZXE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const questionsRef = collection(db, "questions");

const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");
const loadingMessage = document.getElementById("loading-message");

let questions = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderQuestions(qList) {
  loadingMessage.style.display = "none";
  quizContainer.innerHTML = "";
  
  qList.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
    
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    q.options.forEach((opt, i) => {
      const id = `q${index}_opt${i}`;
      optionsDiv.innerHTML += `
        <label>
          <input type="radio" name="q${index}" value="${i}" id="${id}">
          ${opt}
        </label>
      `;
    });

    qDiv.appendChild(optionsDiv);
    quizContainer.appendChild(qDiv);
  });

  submitBtn.style.display = "block";
}

function checkAnswers() {
  let score = 0;
  const allQuestions = document.querySelectorAll(".question");

  allQuestions.forEach((qEl, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const correctIndex = questions[index].answer;
    const options = qEl.querySelectorAll("input");

    options.forEach((opt, i) => {
      const label = opt.parentElement;
      label.classList.remove("correct", "incorrect");
      
      if (i === correctIndex) {
        label.classList.add("correct");
      }
      if (selected && parseInt(selected.value) === i && i !== correctIndex) {
        label.classList.add("incorrect");
      }
    });

    if (selected && parseInt(selected.value) === correctIndex) {
      score++;
    }
  });

  resultDiv.innerHTML = `<h3>You scored ${score} / ${questions.length}</h3>`;
}

async function loadQuestions() {
  try {
    console.log("Fetching questions from Firestore...");
    const snapshot = await getDocs(questionsRef);
    
    if (snapshot.empty) {
      throw new Error("No questions found in the database. Please add questions in Firebase Console.");
    }

    let qData = [];
    let invalidQuestions = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Validate question structure
      if (!data.question || !data.options || !Array.isArray(data.options) || data.answer === undefined) {
        console.warn("Invalid question structure in document:", doc.id, data);
        invalidQuestions++;
        return;
      }
      
      // Validate answer is within options range
      if (data.answer < 0 || data.answer >= data.options.length) {
        console.warn("Invalid answer index in document:", doc.id, data);
        invalidQuestions++;
        return;
      }

      qData.push({
        id: doc.id,
        question: data.question,
        options: data.options,
        answer: data.answer
      });
    });

    if (qData.length === 0) {
      throw new Error(`Found ${invalidQuestions} questions but none had the correct structure. 
        Required fields: question (string), options (array), answer (number)`);
    }

    if (invalidQuestions > 0) {
      console.warn(`Skipped ${invalidQuestions} invalid questions`);
    }

    questions = shuffle(qData).slice(0, 20);
    renderQuestions(questions);
    
  } catch (error) {
    console.error("Error:", error);
    loadingMessage.innerHTML = `
      <div class="error">
        <p><strong>Error loading questions:</strong></p>
        <p>${error.message}</p>
        <p>Please check:</p>
        <ul>
          <li>Your Firestore database structure</li>
          <li>Each question must have: question, options[], answer</li>
          <li>Browser console (F12) for more details</li>
        </ul>
      </div>
    `;
    submitBtn.style.display = "none";
  }
}

submitBtn.addEventListener("click", checkAnswers);

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  loadQuestions();
});