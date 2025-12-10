const qaService = require("../services/qaService");

module.exports = {
  // GET /api/getquestions
  async list(req, res) {
    try {
      const questions = await qaService.list();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/questions/:id
  async detail(req, res) {
    try {
      const question = await qaService.getById(req.params.id);
      res.json(question);
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/addquestion
  async create(req, res) {
    try {
      const newQuestion = await qaService.create(req.body);
      res.json({ message: "Question created", question: newQuestion });
    } catch (error) {
      if (error.message === "MISSING_FIELDS") {
        return res.status(400).json({ error: "Missing required fields" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/questions/:id/answers
  async createAnswer(req, res) {
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing answer content" });
    }

    try {
      const answerData = {
        author: author || "Anonymous",
        content,
        time: new Date().toISOString(),
        likes: 0,
      };

      const question = await qaService.addAnswer(req.params.id, answerData);
      const addedAnswer = question.answers[question.answers.length - 1];

      res.json({ message: "Answer posted", answer: addedAnswer });
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },
};
