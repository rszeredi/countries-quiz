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

	return (
		<div
			className={`btn-contents btn-multichoice ${extraClassNames}`}
			style={{ fontSize: doesFontNeedToBeShrunk(answerChoiceValue) ? '0.95rem' : '1.2rem' }}
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

function doesFontNeedToBeShrunk(answerText) {
	// if single word, more than 8 characters, and does not end in ille (eg. Brazzaville), then shrink
	if (
		Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 700 ||
		answerText.length <= 8 ||
		// answerText.includes(' ') ||
		// answerText.includes('-') ||
		answerText.includes('ill')
	)
		return false;
	else return true;
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
