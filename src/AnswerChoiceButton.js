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

	function makeNumberHumanReadable(number) {
		if (number > 1e9) {
			const parsedNumber = parseFloat((number / 1e9).toFixed(1));
			return `${parsedNumber}B`;
		} else if (number > 1e6) {
			const parsedNumber = Math.round(number / 1e6);
			return `${parsedNumber}M`;
		} else if (number > 1e3) {
			const parsedNumber = Math.round(number / 1e3);
			return `${parsedNumber}K`;
		} else {
			return number;
		}
	}

	return (
		<div
			className={classNames('btn-contents btn-multichoice', {
				'AnswerChoiceButton-btn-correct': answerStatus === 'correct',
				'AnswerChoiceButton-btn-incorrect': answerStatus === 'incorrect'
			})}
			onClick={handleClick}
		>
			{makeNumberHumanReadable(answerChoiceText)}
		</div>
	);
}
