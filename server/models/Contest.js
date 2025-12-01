class Contest {
  constructor({ id, title, type, description, period, status, participants }) {
    this.id = id;
    this.title = title;
    this.type = type; // 'academic' | 'non-academic'
    this.description = description;
    this.period = period;
    this.status = status; // 'open' | 'closed'
    this.participants = participants;
  }
}
module.exports = Contest;