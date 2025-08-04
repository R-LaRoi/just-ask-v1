import React from 'react';
import { Question } from '../types/survey';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import TextInputQuestion from './questions/TextInputQuestion';

import RatingQuestion from './RatingQuestion';
interface QuestionRendererProps {
  question: Question;
  answer?: any;
  onAnswer: (answer: any) => void;
}

export default function QuestionRenderer({ question, answer, onAnswer }: QuestionRendererProps) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedAnswer={answer}
          onAnswer={onAnswer}
        />
      );
    case 'text_input':
      return (
        <TextInputQuestion
          question={question}
          value={answer}
          onAnswer={onAnswer}
        />
      );
    case 'rating':
      return (
        <RatingQuestion

          question={question}
          rating={answer}
          onAnswer={onAnswer}
        />
      );
    default:
      return null;
  }
}