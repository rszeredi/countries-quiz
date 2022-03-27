import React, { useState } from 'react';
import classNames from 'classnames';
import './AnswerMultiChoiceButtons.css';

export default function AnswerChoiceButton(props) {
	const { answerChoiceText, correctAnswer, handleAnswerSubmit, practiceMode } = props;

	const [ answerStatus, setAnswerStatus ] = useState('none');

	const isCorrectAnswer = () => {
		console.log('answerChoiceText', answerChoiceText);
		console.log('correctAnswer', correctAnswer);
		return answerChoiceText === correctAnswer;
	};

	const handleClick = () => {
		const answerIsCorrect = isCorrectAnswer();
		setAnswerStatus(answerIsCorrect ? 'correct' : 'incorrect');

		setTimeout(() => {
			handleAnswerSubmit(answerIsCorrect);
			if (answerIsCorrect || !practiceMode) {
				setAnswerStatus('none');
			} else {
				setAnswerStatus('practising');
			}
		}, 700);
	};

	return (
		<div
			className={classNames('btn-contents btn-multichoice', {
				'AnswerChoiceButton-btn-correct': answerStatus === 'correct',
				'AnswerChoiceButton-btn-incorrect': answerStatus === 'incorrect'
			})}
			onClick={handleClick}
		>
			{answerChoiceText}
		</div>
	);
}
