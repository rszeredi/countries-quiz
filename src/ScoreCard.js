import React, { Component } from 'react';
import ScoreBox from './ScoreBox';

import './ScoreCard.css';

class ScoreCard extends Component {
	render() {
		const { remaining, correct, incorrect } = this.props;
		const total = correct + incorrect + remaining;
		return (
			<div className="ScoreCard">
				<ScoreBox
					scoreValue={remaining}
					scoreName="Remaining"
					color="rgba(67, 67, 242, 100%)"
					width={`${100 * remaining / total}%`}
				/>
				<ScoreBox
					scoreValue={incorrect}
					scoreName="Incorrect"
					color="rgba(232, 70, 70, 100%)"
					width={`${100 * incorrect / total}%`}
				/>
				<ScoreBox
					scoreValue={correct}
					scoreName="Correct"
					color="rgba(9, 213, 67, 100%)"
					width={`${100 * correct / total}%`}
				/>
			</div>
		);
	}
}

export default ScoreCard;
