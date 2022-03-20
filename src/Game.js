import React, { Component } from 'react';
import axios from 'axios';

import ScoreCard from './ScoreCard';

import './Game.css';
import QuestionBox from './QuestionBox';

const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital';

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
			questions: {},
			correct: 0,
			incorrect: 0,
			currentQuestionIdx: 0
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
		this.isCorrectAnswer = this.isCorrectAnswer.bind(this);
		this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
		this.resetQuestions = this.resetQuestions.bind(this);
	}

	async componentDidMount() {
		const response = await axios.get(COUNTRIES_API_URL);
		const countryData = this.parseCountryData(response.data);
		this.setState({ questions: countryData.sort(() => Math.random() - 0.5) });
	}

	parseCountryData(data) {
		return data.map((country) => ({
			country: country.name.common,
			capitalCity: country.capital[0]
		}));
	}

	getCurrentQuestion() {
		const { country, capitalCity } = this.state.questions[this.state.currentQuestionIdx];
		const questionText = `${questionPrefix}${country}${questionSuffix}`;

		return { questionText, answer: capitalCity };
	}

	getNumRemainingQuestions() {
		return this.state.questions.length - this.state.currentQuestionIdx;
	}

	isCorrectAnswer(answer) {
		const correctAnswer = this.state.questions[this.state.currentQuestionIdx].capitalCity;
		return correctAnswer.toLowerCase() === answer.toLowerCase();
	}

	updateScore(answer) {
		const answerIsCorrect = this.isCorrectAnswer(answer);
		if (answerIsCorrect) {
			this.setState((curSt) => ({ correct: curSt.correct + 1 }));
		} else {
			this.setState((curSt) => ({ incorrect: curSt.incorrect + 1 }));
		}
	}

	handleAnswerSubmit(answer) {
		this.updateScore(answer);

		// todo: check if end of questions
		this.setState((curSt) => ({ currentQuestionIdx: curSt.currentQuestionIdx + 1 }));
	}

	resetScores() {
		this.setState({ correct: 0, incorrect: 0 });
	}

	resetQuestions() {
		this.setState({ currentQuestionIdx: 0 });
		this.resetScores();
	}

	render() {
		const { correct, incorrect } = this.state;
		const remaining = this.getNumRemainingQuestions();
		return (
			<div className="Game">
				<h1>Capital Cities Quiz</h1>
				<ScoreCard correct={correct} incorrect={incorrect} remaining={remaining} />
				{remaining > 0 ? (
					<QuestionBox
						{...this.getCurrentQuestion()}
						handleAnswerSubmit={this.handleAnswerSubmit}
					/>
				) : (
					<div className="Game-restart">
						{/* <i className="fa-solid fa-arrow-rotate-left" /> */}
						<i className="fa-solid arrow-left" />
						Finished all questions!
						<button className="Game-restart-btn" onClick={this.resetQuestions}>
							Start Over
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default Game;
