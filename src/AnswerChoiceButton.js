import { type } from '@testing-library/user-event/dist/type';
import React, { useState } from 'react';
import './AnswerMultiChoiceButtons.css';

export default function AnswerChoiceButton(props) {
	const {
		answerChoiceText: answerChoiceValue,
		correctAnswer,
		updateAnswerUIAndScores,
		extraClassNames,
		disabled,
		quizCategory
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
	console.log('quizCategory', quizCategory);

	return (
		<div
			className={`btn-contents btn-multichoice ${extraClassNames}`}
			data-value={answerChoiceValue}
			onClick={handleClick}
		>
			{convertAnswerForDisplay(answerChoiceValue, quizCategory)}
		</div>
	);
}
function capitalize(s) {
	const words = s.split(' ');

	return words
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(' ');
}

function convertAnswerForDisplay(answerChoiceValue, quizCategory) {
	if (typeof answerChoiceValue === 'number') return makeNumberHumanReadable(answerChoiceValue);

	if (quizCategory === 'Currencies')
		return capitalize(removeCountryFromCurrency(answerChoiceValue));

	return capitalize(answerChoiceValue);
}

function removeCountryFromCurrency(fullCurrencyString) {
	// lazy solution: just return the last word
	const words = fullCurrencyString.split(' ');
	return capitalize(words[words.length - 1]);
}

function makeNumberHumanReadable(number) {
	console.log('makeNumberHumanReadable', number);
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
