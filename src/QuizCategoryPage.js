import React from 'react';
import { Link } from 'react-router-dom';

import africa from './images/africa.jpeg';
import asia from './images/asia.jpeg';
import europe from './images/europe.jpeg';
import northAmerica from './images/north-america.jpeg';
import southAmerica from './images/south-america.jpeg';
import oceania from './images/oceania.jpeg';
import './QuizCategoryPage.css';

const imagesDict = {
	africa,
	asia,
	europe,
	'north-america': northAmerica,
	'south-america': southAmerica,
	oceania
};

export default function QuizCategoryPage(props) {
	const { quizCategory, quizList } = props;

	const makeQuizLink = (quizProps) => {
		const variant = quizProps.makeVariantString();
		// console.log('variant', variant);

		return (
			// key={quiz.quizId}
			<Link
				className={`btn-contents QuizCategoryPage-quiz-link QuizCategoryPage-background-${variant}`} //QuizCategoryPage-background-${variant}
				// className={`QuizCategoryPage-quiz-link`} //QuizCategoryPage-background-${variant}
				to={quizProps.makeQuizRouteString()}
				key={quizProps.quizId}
			>
				{/* <div className="QuizCategoryPage-btn-background">
					<img src={imagesDict[variant]} />
				</div> */}
				<div className="QuizCategoryPage-btn-text">{quizProps.variant}</div>
			</Link>
		);
	};

	const buttons =
		// <div className="QuizCategoryPage-buttons">{quizList.map((quiz) => makeQuizLink(quiz))}</div>
		quizList.map((quiz) => makeQuizLink(quiz));

	return (
		<div className="QuizCategoryPage">
			<div className="QuizCategoryPage-contents">
				<div className="QuizCategoryPage-back-button">
					<Link to="/">
						<i className="fa fa-thin fa-arrow-left" /> Back to quiz menu
					</Link>
				</div>
				<h1 className="QuizCategoryPage-category-heading">{quizCategory}</h1>
				<div className="QuizCategoryPage-links">{buttons}</div>
			</div>
		</div>
	);
}

// function QuizLink(props) {
// 	const { quizProps } = props;
// }
