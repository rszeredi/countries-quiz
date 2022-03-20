import React, { Component } from 'react';
import './ScoreBox.css';

class ScoreBox extends Component {
	render() {
		const { scoreValue, scoreName } = this.props;
		return (
			<div className="ScoreBox">
				<div>{scoreValue}</div>
				<div>{scoreName}</div>
				<div className="ScoreBox-score-bar" />
			</div>
		);
	}
}

export default ScoreBox;
