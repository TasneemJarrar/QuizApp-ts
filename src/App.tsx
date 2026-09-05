import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import { Difficulty } from './API';
import type { QuestionsState } from './API';
import QuestionCard from './components/QuestionCard';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
    } catch (error) {
      console.error(error);
      setGameOver(true);
      alert('Failed to load quiz questions, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;

      if (correct) setScore((prev) => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQ = number + 1;

    if (nextQ === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-5">
      <h1 className="my-5 text-center text-6xl font-normal leading-tight text-white drop-shadow-md">
        REACT QUIZ
      </h1>

      {gameOver && userAnswers.length === TOTAL_QUESTIONS ? (
        <div className="my-5 w-full max-w-md rounded-lg border-2 border-cyan-600 bg-cyan-50 p-8 text-center shadow-lg">
          <h2 className="mb-4 text-3xl font-bold">Quiz Completed</h2>
          <p className="mb-2 text-2xl">Your Score</p>
          <p className="mb-6 text-5xl font-bold text-cyan-600">
            {score} / {TOTAL_QUESTIONS}
          </p>
          <p className="mb-6 text-lg">
            You got {Math.round((score / TOTAL_QUESTIONS) * 100)}% correct!
          </p>

          <button
            className="h-10 cursor-pointer rounded-lg border-2 border-orange-400 bg-gradient-to-b from-white to-orange-200 px-10 shadow-lg"
            onClick={startTrivia}
          >
            Restart Quiz
          </button>
        </div>
      ) : null}

      {gameOver && userAnswers.length !== TOTAL_QUESTIONS ? (
        <button
          className="my-5 h-10 max-w-xs cursor-pointer rounded-lg border-2 border-orange-400 bg-gradient-to-b from-white to-orange-200 px-10 shadow-lg"
          onClick={startTrivia}
        >
          Start
        </button>
      ) : null}

      {!gameOver ? <p className="m-0 text-3xl text-white">Score: {score}</p> : null}

      {loading ? <p className="text-white">Loading Questions...</p> : null}

      {!loading && !gameOver && questions.length > 0 ? (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers[number]}
          callback={checkAnswer}
        />
      ) : null}

      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button
          className="my-5 h-10 cursor-pointer rounded-lg border-2 border-orange-400 bg-gradient-to-b from-white to-orange-200 px-10 shadow-lg"
          onClick={nextQuestion}
        >
          Next Question
        </button>
      ) : null}

      {!gameOver && !loading && userAnswers.length === TOTAL_QUESTIONS && number === TOTAL_QUESTIONS - 1 ? (
        <button
          className="my-5 h-10 cursor-pointer rounded-lg border-2 border-orange-400 bg-gradient-to-b from-white to-orange-200 px-10 shadow-lg"
          onClick={nextQuestion}
        >
          Finish Quiz
        </button>
      ) : null}
    </main>
  );
};

export default App;