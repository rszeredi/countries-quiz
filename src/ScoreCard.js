import React, { Component } from 'react';
import ScoreBox from './ScoreBox';

import './ScoreCard.css';

class ScoreCard extends Component {
	render() {
		const { remaining, correct, incorrect } = this.props;
		return (
			<div className="ScoreCard">
				<ScoreBox scoreValue={remaining} scoreName="Remaining" />
				<ScoreBox scoreValue={incorrect} scoreName="Incorrect" />
				<ScoreBox scoreValue={correct} scoreName="Correct" />
			</div>
		);
	}
}

export default ScoreCard;
