class Session {
  constructor({
    id,
    title,
    subject,
    tutor,
    date,
    participants,
    maxParticipants,
    status,
    description,
    rating,
  }) {
    this.id = id;
    this.title = title;
    this.subject = subject;
    this.tutor = tutor;
    this.date = date;
    this.participants = participants;
    this.maxParticipants = maxParticipants;
    this.status = status; // 'upcoming' | 'ongoing'
    this.description = description;
    this.rating = rating || null;
  }
}
module.exports = Session;
