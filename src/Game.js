import React, { Component } from 'react';
import ScoreBox from './ScoreBox';
import ScoreCard from './ScoreCard';

import './Game.css';
import QuestionBox from './QuestionBox';

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = { scores: { remaining: 10, correct: 0, incorrect: 0 } };
	}

	render() {
		return (
			<div className="Game">
				<h1>Capital Cities</h1>
				<ScoreCard />
				<QuestionBox />
			</div>
		);
	}
}

export default Game;
