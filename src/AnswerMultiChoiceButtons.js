import React, { useState } from 'react';
import AnswerChoiceButton from './AnswerChoiceButton';
import './AnswerMultiChoiceButtons.css';

// AnswerMultiChoiceButtons holds the logic for generating random fake answers
// AnswerMultiChoiceButtonsInner: tracks what answer was click, fake answers stay the same

export default function AnswerMultiChoiceButtons(props) {
	const { correctAnswer, handleAnswerSubmit } = props;
	const answerOptions = generateIncorrectMultiChoiceOptions(correctAnswer)
		.concat([ correctAnswer ])
		.sort(() => Math.random() - 0.5);
	console.log('answerOptions', answerOptions);
	return (
		<AnswerMultiChoiceButtonsInner
			answerOptions={answerOptions}
			correctAnswer={correctAnswer}
			handleAnswerSubmit={handleAnswerSubmit}
		/>
	);
}

function AnswerMultiChoiceButtonsInner(props) {
	const { answerOptions, correctAnswer, handleAnswerSubmit } = props;
	const [ answerStatus, setAnswerStatus ] = useState('none');

	const [ selectedAnswer, setSelectedAnswer ] = useState('none');

	const updateAnswerUIAndScores = (answerIsCorrect, selectedAnswer) => {
		setAnswerStatus('answered');
		setSelectedAnswer(selectedAnswer);

		setTimeout(() => {
			handleAnswerSubmit(answerIsCorrect);
			setAnswerStatus('none');
		}, 700);
	};

	const getExtraClassNames = (answer) => {
		if (answerStatus === 'answered') {
			if (answer === correctAnswer) {
				return 'AnswerChoiceButton-btn-correct';
			} else if (answer !== correctAnswer && selectedAnswer === answer) {
				return 'AnswerChoiceButton-btn-incorrect';
			}
		}
		return '';
	};

	return (
		<div className="AnswerMultiChoiceButtons">
			{answerOptions.map((answer) => (
				<AnswerChoiceButton
					key={answer}
					answerChoiceText={answer}
					correctAnswer={correctAnswer}
					updateAnswerUIAndScores={updateAnswerUIAndScores}
					extraClassNames={getExtraClassNames(answer)}
				/>
			))}
		</div>
	);
}

function generateIncorrectMultiChoiceOptions(correctAnswer, numToGenerate = 3) {
	if (typeof correctAnswer === 'number') {
		// return a number that is randomly between +-20% and +-50%
		const [ lb, ub ] = [ 20, 70 ];

		let options = [];
		for (let i = 0; i < numToGenerate; i++) {
			const sign = Math.random() < 0.5 ? -1 : 1;
			const multiplier = 1 + sign * (Math.random() * (ub - lb) + lb) / 100;
			// console.log('multiplier', multiplier.toFixed(2));
			options.push(Math.floor(correctAnswer * multiplier));
		}

		options.forEach((i) => {
			const delta = ((i / correctAnswer - 1) * 100).toFixed(2);
			// console.log(`${delta}%`);
		});

		return options;
	}
}
