// src/services/dataFormatters.ts
// Helper functions to format backend data for frontend

export const formatUser = (userData: any) => {
  return {
    id: userData._id || userData.id,
    bknetId: userData.bknetId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    email: userData.email,
    avatar: userData.avatar,
  };
};

export const formatTutor = (tutorData: any) => {
  const user = tutorData.user || {};
  return {
    id: tutorData._id || tutorData.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    department: tutorData.department,
    specialization: tutorData.specialization || [],
    rating: tutorData.rating?.average || 0,
    reviews: tutorData.rating?.count || 0,
    avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`,
    nextAvailable: tutorData.nextAvailable 
      ? new Date(tutorData.nextAvailable).toLocaleString()
      : 'Not available',
    matchScore: 85, // TODO: Implement matching algorithm
    bio: tutorData.bio,
    experience: tutorData.experience,
  };
};

export const formatContest = (contestData: any) => {
  const start = contestData.period?.start ? new Date(contestData.period.start) : null;
  const end = contestData.period?.end ? new Date(contestData.period.end) : null;
  
  return {
    id: contestData._id || contestData.id,
    title: contestData.title,
    type: contestData.type,
    description: contestData.description,
    period: start && end 
      ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      : 'TBA',
    status: contestData.status,
    participants: Array.isArray(contestData.participants) 
      ? contestData.participants.length 
      : contestData.participants || 0,
    organizer: contestData.organizer,
    maxParticipants: contestData.maxParticipants,
    prize: contestData.prize,
  };
};

export const formatSession = (sessionData: any) => {
  const tutor = sessionData.tutor || {};
  const sessionDate = sessionData.date ? new Date(sessionData.date) : new Date();
  
  // Determine if session is happening now
  const now = new Date();
  const isNow = Math.abs(now.getTime() - sessionDate.getTime()) < 3600000; // Within 1 hour
  
  let dateStr = '';
  if (isNow) {
    dateStr = 'Now';
  } else {
    const diffDays = Math.floor((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      dateStr = `Today, ${sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      dateStr = `Tomorrow, ${sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      dateStr = `${sessionDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  }
  
  return {
    id: sessionData._id || sessionData.id,
    title: sessionData.title,
    subject: sessionData.subject,
    tutor: `${tutor.firstName || ''} ${tutor.lastName || ''}`.trim() || 'Unknown Tutor',
    tutorId: tutor._id || tutor.id,
    date: dateStr,
    rawDate: sessionDate,
    participants: Array.isArray(sessionData.participants) 
      ? sessionData.participants.length 
      : sessionData.participants || 0,
    maxParticipants: sessionData.maxParticipants || 30,
    status: sessionData.status,
    description: sessionData.description,
    rating: sessionData.rating?.average || null,
    meetingLink: sessionData.meetingLink,
    duration: sessionData.duration,
  };
};

export const formatQuestion = (questionData: any) => {
  const author = questionData.author || {};
  const createdAt = questionData.createdAt ? new Date(questionData.createdAt) : new Date();
  
  // Calculate time ago
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  let timeStr = '';
  if (diffMins < 60) {
    timeStr = `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    timeStr = `${diffHours} hours ago`;
  } else {
    timeStr = `${diffDays} days ago`;
  }
  
  return {
    id: questionData._id || questionData.id,
    title: questionData.title,
    content: questionData.content,
    author: `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Anonymous',
    authorId: author._id || author.id,
    time: timeStr,
    rawTime: createdAt,
    answers: Array.isArray(questionData.answers) ? questionData.answers.length : 0,
    answersData: questionData.answers || [],
    status: questionData.status,
    topic: questionData.topic,
    tags: questionData.tags || [],
    views: questionData.views || 0,
    upvotes: questionData.upvotes || 0,
  };
};
