const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your questions data structure
const questions = [
  // Example question format:
  {
    id: 1,
    question: "Deepa stitches clothes. She is already busy with many orders. She gets an urgent order. Which option is a contributor's choice?",
    options: [
      "She explains that she will be unable to take the order as she will not be able to do justice to it.",
      "She completes the order hurriedly in the short-time she has with her.",
      "She explains her problem and tells the date by which she can complete the order.",
      "She takes the help of another tailor to deliver the order on time without reducing the quality."
    ],
    answer: 3, // index of correct answer
    year: 2012,
    marks: 5,
    section: "A"
  },{
  question: "Deepa stitches clothes. She is already busy with many orders. She gets an urgent order. Which option is a contributor's choice?",
  options: [
    "She explains that she will be unable to take the order as she will not be able to do justice to it.",
    "She completes the order hurriedly in the short-time she has with her.",
    "She explains her problem and tells the date by which she can complete the order.",
   "She takes the help of another tailor to deliver the order on time without reducing the quality."
  ],
  answer: 2, // Index of correct answer (0-based)
  year: 2012,
  source: "CPD 2012.pdf",
  section: "General"
},
{
  question: "Anannya has a PhD degree. What is your advice to her on how she should define herself, when she interacts with others who may not have studied so much?",
  options: [
    "It is better that you share your knowledge with them and spend time talking to people who may know more than you.",
    "There is always something or the other to learn from everyone. Therefore, the more you interact and listen to others, the more you can learn.",
    "There is no need to pay too much attention as you obviously know more than them.",
    "They may be able to give you fresh viewpoints which are different from yours. Therefore it is useful to listen to them."
  ],
  answer: 1,
  year: 2012,
  source: "CPD 2012.pdf",
  section: "General"
},
// Add more questions from CPD 2012.pdf here...

// Questions from CPD_S23.pdf
{
  question: "Mr. Ray achieved many awards and was recognized internationally. What helped him achieve sustainable success?",
  options: [
    "He kept improving his techniques of storytelling, cinematography, and film making.",
    "He chose topics and themes that had strong appeal to the audience."
  ],
  answer: 0,
  year: 2023,
  source: "CPD_S23.pdf",
  section: "A"
},
{
  question: "Mr. Ray's funds got over while making his first movie. How did this instance demonstrate his Creator Approach?",
  options: [
    "Mr. Ray was able to get inspired and learn from foreign movies.",
    "Mr. Ray didn't let resources like money or people stop him from achieving his goal of making a film."
  ],
  answer: 1,
  year: 2023,
  source: "CPD_S23.pdf",
  section: "A"
},
// Add more questions from CPD_S23.pdf here...

// Questions from CPD_S24.pdf
{
  question: "Which of these demonstrate the highest level of contribution made by Tilak?",
  options: [
    "His life became more purposeful, and his work led to the welfare of society and inspired others.",
    "There will be less accidents and reduced damage to vehicles.",
    "He was able to quit his job and do what he wanted to do."
  ],
  answer: 0,
  year: 2024,
  source: "CPD_S24.pdf",
  section: "A"
},
{
  question: "Which of the following Career Development Pathways did Tilak choose to develop himself in?",
  options: [
    "Professional achiever",
    "Changemaker"
  ],
  answer: 1,
  year: 2024,
  source: "CPD_S24.pdf",
  section: "A"
},
// Add more questions from CPD_S24.pdf here...

// Questions from CPD_W23.pdf
{
  question: "Which of these statements demonstrate Neeraj's most expanded Zone of I Can?",
  options: [
    "'I CAN practice religiously and consistently to gain mastery in the sport.'",
    "'I CAN continue pursuing the sport despite injuries.'",
    "'I CAN win all tough competitions.'"
  ],
  answer: 1,
  year: 2023,
  source: "CPD_W23.pdf",
  section: "A"
},
{
  question: "We can say that Neeraj uses a contributive approach to grow his Tree of Sustainable Success because –",
  options: [
    "He seeks excellence – he wants to keep improving his javelin throw.",
    "He looks for smart strategies to win all competitions at any cost."
  ],
  answer: 0,
  year: 2023,
  source: "CPD_W23.pdf",
  section: "A"
},
// Add more questions from CPD_W23.pdf here...

// Questions from CPD_W24.pdf
{
  question: "Salim Ali was denied a job in any institute or museum, despite having formal training. He made the decision to take up freelance assignments in the field. Which Creator Practice does this demonstrate?",
  options: [
    "From Sheep Thinking to Lion Thinking.",
    "Face the Brute."
  ],
  answer: 0,
  year: 2024,
  source: "CPD_W24.pdf",
  section: "A"
},
{
  question: "Salim Ali worked hard towards promoting and advocating environmental conservation. Why do you think Salim Ali made that choice?",
  options: [
    "Because he wanted to create awareness about environmental conservation.",
    "Because he wanted to popularize Ornithology – the study of Birds in India.",
    "Because he wanted to be recognized for the work that he did in the field."
  ],
  answer: 0,
  year: 2024,
  source: "CPD_W24.pdf",
  section: "A"
}
  // Add all 90 questions from CPD_2012.pdf in this format
  // Then add questions from other years
];

async function uploadQuestions() {
  const batch = db.batch();
  const questionsRef = db.collection('questions');
  
  questions.forEach((question, index) => {
    const docRef = questionsRef.doc(`question_${index + 1}`);
    batch.set(docRef, question);
  });

  try {
    await batch.commit();
    console.log('Questions uploaded successfully!');
  } catch (error) {
    console.error('Error uploading questions:', error);
  }
}

uploadQuestions();