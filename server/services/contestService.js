const contestRepository = require('../repositories/contestRepository');

class ContestService {
  async getAll() {
    return await contestRepository.findAll();
  }

  async getOngoing() {
    return await contestRepository.findOpen();
  }

  async getById(id) {
    const contest = await contestRepository.findById(id);
    if (!contest) throw new Error('NOT_FOUND');
    return contest;
  }

  async register(contestId, userId) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    if (contest.status !== 'open') throw new Error('CONTEST_CLOSED');
    return await contestRepository.register(contestId, userId);
  }

  async create(data, organizerId) {
    const contestData = {
      title: data.title,
      type: data.type,
      description: data.description,
      period: {
        start: new Date(data.startDate),
        end: new Date(data.endDate)
      },
      status: 'open',
      organizer: organizerId,
      maxParticipants: data.maxParticipants || 100,
      prize: data.prize || '',
      rules: data.rules || '',
      questions: [],
      results: []
    };
    return await contestRepository.create(contestData);
  }

  async addQuestions(contestId, questions) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    return await contestRepository.updateQuestions(contestId, questions);
  }

  async submitAnswers(contestId, userId, answers) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');

    // Calculate score
    let score = 0;
    const answersWithCorrectness = answers.map((ans, index) => {
      const question = contest.questions[ans.questionIndex];
      const isCorrect = question && question.correctAnswer === ans.selectedAnswer;
      if (isCorrect) {
        score += question.points || 10;
      }
      return {
        questionIndex: ans.questionIndex,
        selectedAnswer: ans.selectedAnswer,
        isCorrect
      };
    });

    // Check if user already has a result
    const existingResultIndex = contest.results.findIndex(
      r => r.userId.toString() === userId.toString()
    );

    const newResult = {
      userId,
      score,
      answers: answersWithCorrectness,
      submittedAt: new Date()
    };

    // Only update if new score is higher
    if (existingResultIndex >= 0) {
      if (score > contest.results[existingResultIndex].score) {
        contest.results[existingResultIndex] = newResult;
      } else {
        return contest.results[existingResultIndex];
      }
    } else {
      contest.results.push(newResult);
    }

    await contest.save();
    return newResult;
  }

  async getResults(contestId) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    
    // Populate user info and sort by score
    await contest.populate('results.userId', 'firstName lastName bknetId email');
    const results = contest.results
      .map(r => ({
        userId: r.userId._id,
        name: `${r.userId.firstName} ${r.userId.lastName}`,
        bknetId: r.userId.bknetId,
        email: r.userId.email,
        score: r.score,
        submittedAt: r.submittedAt
      }))
      .sort((a, b) => b.score - a.score);
    
    return results;
  }

  async getUserResult(contestId, userId) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    
    const result = contest.results.find(
      r => r.userId.toString() === userId.toString()
    );
    
    return result || null;
  }
}

module.exports = new ContestService();
