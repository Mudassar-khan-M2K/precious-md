const questions = [
  { q: "What is the capital of Pakistan?", a: "Islamabad" },
  { q: "Who painted the Mona Lisa?", a: "Da Vinci" },
  { q: "What is the capital of Pakistan?", a: "Islamabad" },
  { q: "What is the largest ocean on Earth?", a: "Pacific" },
  { q: "Which country has the most natural lakes?", a: "Canada" },
  { q: "What is the smallest country in the world?", a: "Vatican City" },
  { q: "Which desert is the largest non-polar desert?", a: "Sahara" },
  
  // Art & History
  { q: "Who painted the Mona Lisa?", a: "Da Vinci" },
  { q: "Who painted the Starry Night?", a: "Van Gogh" },
  { q: "Which ancient wonder was at Alexandria?", a: "Lighthouse" },
  { q: "Who discovered penicillin?", a: "Fleming" },
  { q: "Which year did World War II end?", a: "1945" },
  
  // Science
  { q: "What is the hardest natural substance?", a: "Diamond" },
  { q: "What gas do plants absorb?", a: "Carbon Dioxide" },
  { q: "What is the fastest animal on land?", a: "Cheetah" },
  { q: "What is the boiling point of water in Celsius?", a: "100" },
  { q: "Which planet is known as the Red Planet?", a: "Mars" },
  
  // Fun / Pop Culture
  { q: "Who played Jack in Titanic?", a: "Leonardo DiCaprio" },
  { q: "What is the name of Harry Potter's owl?", a: "Hedwig" },
  { q: "Which band sang 'Bohemian Rhapsody'?", a: "Queen" },
  { q: "What is the most watched YouTube video?", a: "Baby Shark" },
  { q: "Who wrote 'Harry Potter' books?", a: "Rowling" },
  
  // Food
  { q: "Which fruit has its seeds on the outside?", a: "Strawberry" },
  { q: "What is the main ingredient in guacamole?", a: "Avocado" },
  { q: "Which country invented pizza?", a: "Italy" },
  { q: "What is the most expensive spice?", a: "Saffron" },
  { q: "What is the only food that never spoils?", a: "Honey" },
  { q: "What is the largest ocean?", a: "Pacific" }
]
let currentQuiz = {}

module.exports = {
  name: 'quiz',
  alias: [],
  category: 'games',
  reactEmoji: '❓',
  async execute(sock, msg, { from, sender }) {
    const q = questions[Math.floor(Math.random() * questions.length)]
    currentQuiz[sender] = { question: q.q, answer: q.a }
    await sock.sendMessage(from, { text: `❓ *Quiz:* ${q.q}\nReply with your answer.` }, { quoted: msg })
    // Wait for answer (simplified – real would need a message collector)
  }
}
