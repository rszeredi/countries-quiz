import React from 'react';

import './QuestionHistorySummary.css';

export default function QuestionHistorySummary(props) {
	const { title, quizId, incorrectCounterThisQuiz } = props;
	console.log('incorrectCounterThisQuiz', incorrectCounterThisQuiz);
	return (
		<div className="QuestionHistorySummary">
			<div className="QuestionHistorySummary-incorrect-heading">{title}</div>
			<div>
				<div className="QuestionHistorySummary-incorrect-questions-row QuestionHistorySummary-incorrect-questions-row-header">
					<div>Question</div>
					<div># times missed</div>
				</div>
				{Object.entries(incorrectCounterThisQuiz).map(([ q, count ]) => (
					<div
						key={`${quizId}-${q}`}
						className="QuestionHistorySummary-incorrect-questions-row"
					>
						<div>{q}</div>
						<div>{count}</div>
					</div>
				))}
			</div>
		</div>
	);
}
