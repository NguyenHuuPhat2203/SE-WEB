class Question {
  constructor({ id, title, author, time, answers, status, topic, tags }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.time = time;       // string demo
    this.answers = answers;
    this.status = status;   // 'answered' | 'unanswered'
    this.topic = topic;
    this.tags = tags;
  }
}
module.exports = Question;
