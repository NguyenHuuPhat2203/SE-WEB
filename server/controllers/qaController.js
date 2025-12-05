// Hard-coded data in-memory
let questions = [
  {
    id: 1,
    title: "How to implement Binary Search Tree?",
    content: "I am struggling with the implementation of BST insert method.",
    author: "Nguyen Huu Phat",
    time: "2 hours ago",
    topic: "Data Structures",
    tags: ["BST", "Trees"],
    answers: [
      {
        id: 1,
        author: "Tran Ngoc Bao Duy",
        content: "Use recursion carefully. Base case first, then left/right subtree.",
        time: "1 hour ago",
        likes: 5,
        isTutor: true
      }
    ]
  }
];

module.exports = {
  // GET /api/questions
  list(req, res) {
    res.json(questions);
  },

  // GET /api/questions/:id
  detail(req, res) {
    const q = questions.find(q => q.id === Number(req.params.id));
    if (!q) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(q);
  },

  // POST /api/questions
  create(req, res) {
    const { title, content, topic, author } = req.body;

    if (!title || !content || !topic) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newQuestion = {
      id: Date.now(),
      title,
      content,
      topic,
      author: author || "Anonymous",
      time: "Just now",
      tags: [],
      answers: []
    };

    questions.unshift(newQuestion);   // Add to top like FE
    res.json({ message: "Question created", question: newQuestion });
  },

  // POST /api/questions/:id/answers
  createAnswer(req, res) {
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing answer content" });
    }

    const questionId = Number(req.params.id);
    const q = questions.find(q => q.id === questionId);

    if (!q) {
      return res.status(404).json({ error: "Question not found" });
    }

    const newAnswer = {
      id: Date.now(),
      author: author || "Anonymous",
      content,
      time: "Just now",
      likes: 0
    };

    q.answers.push(newAnswer);

    res.json({ message: "Answer posted", answer: newAnswer });
  }
};
