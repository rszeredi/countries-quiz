import React from 'react';
import AnswerChoiceButton from './AnswerChoiceButton';
import './AnswerMultiChoiceButtons.css';

export default function AnswerMultiChoiceButtons(props) {
	const { correctAnswer, handleAnswerSubmit } = props;
	return (
		<div className="AnswerMultiChoiceButtons">
			<AnswerChoiceButton
				answerChoiceText={correctAnswer}
				correctAnswer={correctAnswer}
				handleAnswerSubmit={handleAnswerSubmit}
			/>
			<AnswerChoiceButton
				answerChoiceText={correctAnswer}
				correctAnswer={correctAnswer}
				handleAnswerSubmit={handleAnswerSubmit}
			/>
			<AnswerChoiceButton
				answerChoiceText={correctAnswer}
				correctAnswer={correctAnswer}
				handleAnswerSubmit={handleAnswerSubmit}
			/>
			<AnswerChoiceButton
				answerChoiceText="Incorrect answer"
				correctAnswer={correctAnswer}
				handleAnswerSubmit={handleAnswerSubmit}
			/>
		</div>
	);
}
