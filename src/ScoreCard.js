import React, { Component } from 'react';
import ScoreBox from './ScoreBox';

import './ScoreCard.css';

class ScoreCard extends Component {
	render() {
		return (
			<div className="ScoreCard">
				<ScoreBox scoreValue={10} scoreName="Remaining" />
				<ScoreBox scoreValue={1} scoreName="Incorrect" />
				<ScoreBox scoreValue={6} scoreName="Correct" />
			</div>
		);
	}
}

export default ScoreCard;
