import React from 'react';
import AnswerChoiceButton from './AnswerChoiceButton';
import './AnswerMultiChoiceButtons.css';

function generateIncorrectMultiChoiceOptions(correctAnswer, numToGenerate = 3) {
	if (typeof correctAnswer === 'number') {
		// return a number that is randomly between +-20% and +-50%
		const [ lb, ub ] = [ 20, 70 ];

		let options = [];
		for (let i = 0; i < numToGenerate; i++) {
			const sign = Math.random() < 0.5 ? -1 : 1;
			const multiplier = 1 + sign * (Math.random() * (ub - lb) + lb) / 100;
			console.log('multiplier', multiplier.toFixed(2));
			options.push(Math.floor(correctAnswer * multiplier));
		}

		options.forEach((i) => {
			const delta = ((i / correctAnswer - 1) * 100).toFixed(2);
			console.log(`${delta}%`);
		});

		return options;
	}
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

export default function AnswerMultiChoiceButtons(props) {
	const { correctAnswer, handleAnswerSubmit } = props;

	const answerOptions = generateIncorrectMultiChoiceOptions(correctAnswer).concat([
		correctAnswer
	]);
	return (
		<div className="AnswerMultiChoiceButtons">
			{answerOptions.map((answer) => (
				<AnswerChoiceButton
					key={answer}
					answerChoiceText={answer}
					correctAnswer={correctAnswer}
					handleAnswerSubmit={handleAnswerSubmit}
				/>
			))}
		</div>
	);
}
