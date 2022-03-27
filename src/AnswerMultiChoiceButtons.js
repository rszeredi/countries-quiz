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
	answerOptions.forEach((i) => {
		const delta = ((i / correctAnswer - 1) * 100).toFixed(2);
		console.log(`${delta}%  `);
	});
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

function getMinDelta(value, valuesList) {
	let currentMinRelative = Infinity;
	let currentMinAbsolute = Infinity;
	for (let v of valuesList) {
		const relativeDelta = value / v;
		const absoluteDelta = Math.abs(value - v);
		currentMinRelative = Math.min(Math.abs(relativeDelta), currentMinRelative);
		currentMinAbsolute = Math.min(Math.abs(absoluteDelta), currentMinAbsolute);
	}
	return { minRelativeDelta: currentMinRelative, minAbsoluteDelta: currentMinAbsolute };
}

function scaleByRandomAmount(value, lb, ub) {
	const sign = Math.random() < 0.5 ? -1 : 1;
	const multiplier = 1 + sign * (Math.random() * (ub - lb) + lb) / 100;

	return value * multiplier;
}

function checkIfAcceptableDelta(
	candidateValue,
	minRelativeDeltaToCurrentOptions,
	minAbsoluteDeltaToCurrentOptions
) {
	if (candidateValue > 1e6) {
		// absolute different needs to be at least 1 million, to avoid cases like:
		if (minAbsoluteDeltaToCurrentOptions < 1e6) {
			console.log('candidateValue 2', candidateValue);
			console.log('minAbsoluteDeltaToCurrentOptions ', minAbsoluteDeltaToCurrentOptions);
			return false;
		}
	}

	// ensure there is at least a 20% relative difference
	if (minRelativeDeltaToCurrentOptions < 1.2 && minRelativeDeltaToCurrentOptions > 0.8) {
		return false;
	}

	return true;
}

function generateIncorrectMultiChoiceOptions(correctAnswer, numToGenerate = 3) {
	console.log('generateIncorrectMultiChoiceOptions for: ', correctAnswer);
	if (typeof correctAnswer === 'number') {
		// return a number that is randomly between these percentage bounds
		const [ lb, ub ] = correctAnswer < 10e6 ? [ 40, 71 ] : [ 20, 70 ];

		let options = [];
		for (let i = 0; i < numToGenerate; i++) {
			let scaledValue = scaleByRandomAmount(correctAnswer, lb, ub);
			let { minRelativeDelta, minAbsoluteDelta } = getMinDelta(scaledValue, options);

			// console.log(i, 'current options   ', options);
			// console.log(i, 'scaledValue   ', scaledValue);
			// console.log(i, 'minRelativeDelta', minRelativeDelta);
			// console.log(i, 'minAbsoluteDelta', minAbsoluteDelta);
			// console.log(
			// 	i,
			// 	'valid delta',
			// 	checkIfAcceptableDelta(scaledValue, minRelativeDelta, minAbsoluteDelta)
			// );

			let j = 0;

			// keep looking for an option while the generated option is within X% of one of the other options
			while (!checkIfAcceptableDelta(scaledValue, minRelativeDelta, minAbsoluteDelta)) {
				j++;
				if (j > 10) {
					console.log('break');
					break;
				}
				scaledValue = scaleByRandomAmount(correctAnswer, lb, ub);
				const deltas = getMinDelta(scaledValue, options);
				minRelativeDelta = deltas['minRelativeDelta'];
				minAbsoluteDelta = deltas['minAbsoluteDelta'];

				// console.log('J    current options', options);
				// console.log('J    new scaledValue', scaledValue);
				// console.log(`J: ${j}    minRelativeDelta`, minRelativeDelta);
				// console.log(`J: ${j}    minAbsoluteDelta`, minAbsoluteDelta);
				// console.log(
				// 	'passes?',
				// 	checkIfAcceptableDelta(scaledValue, minRelativeDelta, minAbsoluteDelta)
				// );
			}
			// console.log('SELECTED', scaledValue);
			// console.log('broken while', j > 5);
			options.push(Math.floor(scaledValue));
		}

		return options;
	}
}
