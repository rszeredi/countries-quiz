import React, { Component } from 'react';
import axios from 'axios';

import ScoreCard from './ScoreCard';

import './Game.css';
import QuestionBox from './QuestionBox';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';

const COUNTRIES_API_URL =
	'https://restcountries.com/v3.1/all?fields=name,capital,unMember,continents';
const numQuestions = 2000;

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
			questions: [],
			loadingData: true,
			correct: 0,
			incorrect: 0,
			currentQuestionIdx: 0,
			learningMode: true,
			practiceMode: false,
			showAnswer: false,
			answerStatus: 'none'
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
		this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
		this.resetQuestions = this.resetQuestions.bind(this);
	}

	async componentDidMount() {
		const response = await axios.get(COUNTRIES_API_URL);
		const countryData = this.parseCountryData(response.data);
		this.setState({
			questions: countryData.sort(() => Math.random() - 0.5).slice(0, numQuestions),
			loadingData: false
		});
		// this.setState({ questions: countryCapitalPairs, loadingData: false });
	}

	parseCountryData(data, unMembersOnly = true, continent = 'europe') {
		return data
			.filter((country) => !unMembersOnly || country.unMember)
			.filter(
				(country) =>
					continent === 'all' || country.continents[0].toLowerCase() === continent
			)
			.map((country) => ({
				country: country.name.common,
				capitalCity: country.capital[0]
			}));
	}

	getCurrentQuestion() {
		const { country, capitalCity } = this.state.questions[this.state.currentQuestionIdx];

		return { questionMainText: country, answer: capitalCity };
	}

	getNumRemainingQuestions() {
		return this.state.questions.length - this.state.currentQuestionIdx;
	}

	updateScore(answerIsCorrect) {
		if (answerIsCorrect) {
			this.setState((curSt) => ({ correct: curSt.correct + 1 }));
		} else {
			this.setState((curSt) => ({ incorrect: curSt.incorrect + 1 }));
		}
	}

	handleAnswerSubmit(answerIsCorrect) {
		// Only update the score if we're not in practice mode
		if (!this.state.practiceMode) {
			this.updateScore(answerIsCorrect);
		}

		// if the answer is not correct, show the answer prompt the user to type the correct answer
		if (!answerIsCorrect) {
			this.setState({ practiceMode: true });
		} else {
			// if the answer is correct, switch off practice mode and proceed to the next question
			this.setState((curSt) => ({
				practiceMode: false,
				currentQuestionIdx: curSt.currentQuestionIdx + 1
			}));
		}
	}

	resetScores() {
		this.setState({ correct: 0, incorrect: 0 });
	}

	resetQuestions() {
		this.setState({ currentQuestionIdx: 0 });
		this.resetScores();
	}

	getDisplay(remaining) {
		const { loadingData, practiceMode, answerStatus } = this.state;
		if (remaining > 0) {
			return (
				<QuestionBox
					{...this.getCurrentQuestion()}
					{...{ questionPrefix, questionSuffix }}
					handleAnswerSubmit={this.handleAnswerSubmit}
					practiceMode={practiceMode}
					answerStatus={answerStatus}
				/>
			);
		} else if (loadingData) {
			return (
				<div className="Game-loading">
					<h1>Loading...</h1>
				</div>
			);
		} else {
			return (
				<div className="Game-restart">
					{/* <i className="fa-solid fa-arrow-rotate-left" /> */}
					<i className="fa-solid arrow-left" />
					Finished all questions!
					<button className="Game-restart-btn" onClick={this.resetQuestions}>
						Start Over
					</button>
				</div>
			);
		}
	}

	render() {
		const { correct, incorrect } = this.state;
		const remaining = this.getNumRemainingQuestions();

		return (
			<div className="Game">
				<h1>Capital Cities Quiz</h1>
				<ScoreCard correct={correct} incorrect={incorrect} remaining={remaining} />
				{this.getDisplay(remaining)}
			</div>
		);
	}
}

export default Game;
