import React, { useState } from 'react';
import './AnswerMultiChoiceButtons.css';

export default function AnswerChoiceButton(props) {
	const {
		answerChoiceText: answerChoiceValue,
		correctAnswer,
		updateAnswerUIAndScores,
		extraClassNames,
		disabled
	} = props;

	const isCorrectAnswer = () => {
		return answerChoiceValue === correctAnswer;
	};

	const handleClick = (e) => {
		if (disabled) return;
		const answerIsCorrect = isCorrectAnswer();
		const selectedAnswer = e.target.getAttribute('data-value');
		updateAnswerUIAndScores(answerIsCorrect, selectedAnswer);
	};

	return (
		<div
			className={`btn-contents btn-multichoice ${extraClassNames}`}
			data-value={answerChoiceValue}
			onClick={handleClick}
		>
			{makeNumberHumanReadable(answerChoiceValue)}
		</div>
	);
}

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
