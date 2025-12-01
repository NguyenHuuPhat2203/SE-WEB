const Question = require('../models/Question');

class QuestionRepository {
  constructor() {
    this.questions = [
      new Question({
        id: 1,
        title: 'How to implement Binary Search Tree?',
        author: 'Student A',
        time: '2 hours ago',
        answers: 3,
        status: 'answered',
        topic: 'Data Structures',
        tags: ['BST', 'Trees'],
      }),
      new Question({
        id: 2,
        title: 'Explain Dynamic Programming approach',
        author: 'Student B',
        time: '5 hours ago',
        answers: 1,
        status: 'answered',
        topic: 'Algorithms',
        tags: ['DP', 'Optimization'],
      }),
      new Question({
        id: 3,
        title: 'Database normalization best practices?',
        author: 'Student C',
        time: '1 day ago',
        answers: 0,
        status: 'unanswered',
        topic: 'Database',
        tags: ['SQL', 'Normalization'],
      }),
    ];
  }

  findAll() {
    return this.questions;
  }

  findById(id) {
    return this.questions.find((q) => q.id === Number(id)) || null;
  }

  create({ title, content, topic, author }) {
    const q = new Question({
      id: this.questions.length + 1,
      title,
      author: author || 'Anonymous',
      time: 'Just now',
      answers: 0,
      status: 'unanswered',
      topic,
      tags: [],
    });
    // content có thể lưu chỗ khác; demo này bỏ qua
    this.questions.push(q);
    return q;
  }
}

module.exports = new QuestionRepository();
