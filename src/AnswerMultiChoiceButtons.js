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
