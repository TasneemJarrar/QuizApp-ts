import React from 'react';
import type { AnswerObject } from '../App';

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNr: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNr,
  totalQuestions,
}) => (
  <div className="w-full max-w-6xl rounded-lg border-2 border-cyan-600 bg-cyan-50 p-5 text-center shadow-lg">
    <p className="text-base">Question: {questionNr} / {totalQuestions}</p>
    <p className="text-base" dangerouslySetInnerHTML={{ __html: question }} />
    <div>
      {answers.map((answer) => {
        const correct = userAnswer?.correctAnswer === answer;
        const userClicked = userAnswer?.answer === answer;
        const background = correct
          ? 'bg-gradient-to-r from-green-400 to-green-600'
          : userClicked
            ? 'bg-gradient-to-r from-red-400 to-red-600'
            : 'bg-gradient-to-r from-sky-400 to-cyan-600';

        return (
          <div key={answer} className="transition-all duration-300 hover:opacity-80">
            <button
              disabled={!!userAnswer}
              value={answer}
              onClick={callback}
              className={`my-1 h-10 w-full cursor-pointer select-none rounded-lg border-2 border-white text-sm text-white shadow-sm disabled:cursor-default ${background}`}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export default QuestionCard;