/**
 * Temporary mock surveys for Dashboard Phase 2 development.
 * This is strictly separated from production code and will be replaced
 * with Cloud Firestore collections in Phase 4.
 */

export const INITIAL_MOCK_SURVEYS = [
  {
    id: 'survey-101',
    title: 'Tech Stack Preferences 2026',
    description: 'Audience opinion poll on preferred frontend and cloud architectures.',
    status: 'active', // 'active' | 'completed' | 'draft'
    questionCount: 3,
    questionSummary: 'Multiple Choice, Word Cloud',
    responsesCount: 48,
    lastModified: '2 hours ago',
    createdAt: '2026-10-18T09:30:00Z',
    favorite: true,
    joinCode: '489201',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Which technology would you most like to learn this semester?',
        options: ['Full-Stack React & Firebase', 'AI & Autonomous Agents', 'Cloud Architecture', 'Cybersecurity']
      },
      {
        id: 'q2',
        type: 'word-cloud',
        text: 'Describe our engineering department in one word.',
        maxLength: 25
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        text: 'What is your primary platform for project deployment?',
        options: ['Firebase / Google Cloud', 'Vercel / Next', 'AWS', 'Self-hosted Docker']
      }
    ]
  },
  {
    id: 'survey-102',
    title: 'Campus Tech Symposium Feedback',
    description: 'Post-presentation attendee sentiment and rating survey.',
    status: 'completed',
    questionCount: 2,
    questionSummary: 'Word Cloud, Multiple Choice',
    responsesCount: 124,
    lastModified: 'Yesterday',
    createdAt: '2026-10-17T14:15:00Z',
    favorite: true,
    joinCode: '839102',
    questions: [
      {
        id: 'q1',
        type: 'word-cloud',
        text: 'What was your favorite takeaway from the keynote?',
        maxLength: 30
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        text: 'How relevant was the speaker panel to your career goals?',
        options: ['Extremely Relevant', 'Moderately Relevant', 'Neutral', 'Needs Improvement']
      }
    ]
  },
  {
    id: 'survey-103',
    title: 'CS101 Mid-Semester Check-in',
    description: 'Lecture comprehension check for Week 7 topics.',
    status: 'active',
    questionCount: 4,
    questionSummary: 'Multiple Choice, Word Cloud',
    responsesCount: 67,
    lastModified: '3 days ago',
    createdAt: '2026-10-15T11:00:00Z',
    favorite: false,
    joinCode: '294118',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Which data structure was most challenging this week?',
        options: ['Binary Search Trees', 'Graph Traversal (BFS/DFS)', 'Hash Map Collisions', 'Dynamic Programming']
      },
      {
        id: 'q2',
        type: 'word-cloud',
        text: 'In one word, how are you feeling about the upcoming midterm?',
        maxLength: 20
      }
    ]
  },
  {
    id: 'survey-104',
    title: 'Annual Hackathon Icebreaker',
    description: 'Team formation icebreaker and theme selection poll.',
    status: 'draft',
    questionCount: 2,
    questionSummary: 'Multiple Choice, Word Cloud',
    responsesCount: 0,
    lastModified: '5 days ago',
    createdAt: '2026-10-13T16:45:00Z',
    favorite: false,
    joinCode: null,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Which project track are you planning to enter?',
        options: ['Healthcare & Biotech', 'FinTech & Payments', 'EdTech & Learning', 'Open Innovation']
      }
    ]
  },
  {
    id: 'survey-105',
    title: 'AI in Higher Education Debate',
    description: 'Classroom discussion warmup on generative AI tools in coursework.',
    status: 'completed',
    questionCount: 3,
    questionSummary: 'Multiple Choice, Word Cloud',
    responsesCount: 89,
    lastModified: 'Oct 12, 2026',
    createdAt: '2026-10-12T10:00:00Z',
    favorite: false,
    joinCode: '592031',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Do you use coding assistants for daily assignments?',
        options: ['Daily', 'Occasionally', 'Rarely', 'Never']
      }
    ]
  }
];
