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
			scores: { remaining: 10, correct: 0, incorrect: 0 },
			currentQuestionIdx: 3
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
	}

	getCurrentQuestion() {
		const { country, capitalCity } = countryCapitalPairs[this.state.currentQuestionIdx];
		const questionText = `${questionPrefix}${country}${questionSuffix}`;

		return { questionText, answer: capitalCity };
	}

	render() {
		const questionAnswer = this.getCurrentQuestion();
		return (
			<div className="Game">
				<h1>Capital Cities Quiz</h1>
				<ScoreCard />
				<QuestionBox {...questionAnswer} />
			</div>
		);
	}
}

export default Game;
