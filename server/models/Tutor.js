class Tutor {
  constructor({ id, name, department, specialization, rating, reviews, avatar, nextAvailable, matchScore }) {
    this.id = id;
    this.name = name;
    this.department = department;
    this.specialization = specialization;
    this.rating = rating;
    this.reviews = reviews;
    this.avatar = avatar;
    this.nextAvailable = nextAvailable;
    this.matchScore = matchScore;
  }
}
module.exports = Tutor;
