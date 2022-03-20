import React, { Component } from 'react';
import './ScoreBox.css';

class ScoreBox extends Component {
	render() {
		const { scoreValue, scoreName, color, width } = this.props;
		return (
			<div className="ScoreBox">
				<div>{scoreValue}</div>
				<div>{scoreName}</div>
				<div
					className="ScoreBox-score-bar"
					style={{ backgroundColor: color.replace('100%', '30%'), position: 'relative' }}
				>
					<div
						className="ScoreBox-score-bar"
						style={{ backgroundColor: color, position: 'absolute', width: width }}
					/>
				</div>
			</div>
		);
	}
}

export default ScoreBox;
