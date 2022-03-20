import React, { Component } from 'react';
import ScoreCard from './ScoreCard';

import './Game.css';
import QuestionBox from './QuestionBox';

const countryCapitalPairs = [
	{ country: 'Australia', capitalCity: 'Canberra' },
	{ country: 'France', capitalCity: 'Paris' },
	{ country: 'Spain', capitalCity: 'Madrid' },
	{ country: 'Malaysia', capitalCity: 'Kuala Lumpur' },
	{ country: 'Hungary', capitalCity: 'Budapest' }
];

const questionPrefix = 'What is the capital city of ';
const questionSuffix = '?';

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scores: { remaining: 5, correct: 0, incorrect: 0 },
			currentQuestionIdx: 0
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
		this.isCorrectAnswer = this.isCorrectAnswer.bind(this);
		this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
	}

	getCurrentQuestion() {
		const { country, capitalCity } = countryCapitalPairs[this.state.currentQuestionIdx];
		const questionText = `${questionPrefix}${country}${questionSuffix}`;

		return { questionText, answer: capitalCity };
	}

	isCorrectAnswer(answer) {
		const correctAnswer = countryCapitalPairs[this.state.currentQuestionIdx].capitalCity;
		return correctAnswer === answer;
	}

	updateScore(answer) {
		const answerIsCorrect = this.isCorrectAnswer(answer);
		if (answerIsCorrect) {
			this.setState((curSt) => ({ correct: curSt.correct + 1 }));
		} else {
			this.setState((curSt) => ({ incorrect: curSt.incorrect + 1 }));
		}
		this.setState((curSt) => ({ remaining: curSt.remaining - 1 }));
	}

	handleAnswerSubmit(answer) {
		this.updateScore(answer);

		// todo: check if end of questions
		this.setState((curSt) => ({ currentQuestionIdx: curSt.currentQuestionIdx + 1 }));
	}

	render() {
		const questionAnswer = this.getCurrentQuestion();
		return (
			<div className="Game">
				<h1>Capital Cities Quiz</h1>
				<ScoreCard {...this.state.scores} />
				<QuestionBox {...questionAnswer} />
			</div>
		);
	}
}

export default Game;
