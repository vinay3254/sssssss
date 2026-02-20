import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const polls = new Map();
const quizzes = new Map();

router.post('/poll', auth, (req, res) => {
  const { question, options } = req.body;
  const pollId = `poll_${Date.now()}`;
  polls.set(pollId, { question, options, votes: new Array(options.length).fill(0) });
  res.json({ pollId, shareUrl: `/poll/${pollId}` });
});

router.post('/poll/:id/vote', (req, res) => {
  const { optionIndex } = req.body;
  const poll = polls.get(req.params.id);
  if (poll && optionIndex < poll.votes.length) {
    poll.votes[optionIndex]++;
    res.json({ success: true, results: poll.votes });
  } else {
    res.status(404).json({ error: 'Poll not found' });
  }
});

router.post('/quiz', auth, (req, res) => {
  const { question, options, correct } = req.body;
  const quizId = `quiz_${Date.now()}`;
  quizzes.set(quizId, { question, options, correct, responses: [] });
  res.json({ quizId });
});

router.post('/quiz/:id/answer', (req, res) => {
  const { answer } = req.body;
  const quiz = quizzes.get(req.params.id);
  if (quiz) {
    const isCorrect = answer === quiz.correct;
    quiz.responses.push({ answer, correct: isCorrect, timestamp: new Date() });
    res.json({ correct: isCorrect, correctAnswer: quiz.correct });
  } else {
    res.status(404).json({ error: 'Quiz not found' });
  }
});

export default router;