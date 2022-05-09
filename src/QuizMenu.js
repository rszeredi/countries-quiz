import React from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';
import './CommonStyles.css';

import quizzes from './QuizProps';
import ActionButton from './ActionButton';
import ConfirmationModal from './ConfirmationModal';

export default function QuizMenu() {
	const buildLinks = () => {
		let links = [];
		Object.keys(quizzes).forEach((category) => {
			const [ catText, catEmoji ] = category.split(':');
			const catPath = catText.toLowerCase().replace(' ', '-');

			links.push(
				<Link
					className="btn-contents QuizMenu-quiz-category-link"
					to={'/' + catPath}
					key={category}
				>
					<div className="Quizmenu-category-link-content">
						{/* <div className="QuizMenu-category-emoji">{catEmoji}</div> */}
						<div className="QuizMenu-category-text">{catText}</div>
						<div className="QuizMenu-category-emoji">{catEmoji}</div>
					</div>
				</Link>
			);
			// const buttons = (
			// 	<div key={`buttons-${category}`} className="btn">
			// 		{quizzes[category].map((quiz) => (
			// 			<QuizLink quizProps={quiz} key={quiz.quizId} />
			// 		))}
			// 	</div>
			// );
			// links.push(buttons);
		});
		return links;
	};

	const clearLocalStorage = () => {
		// console.log('will clear localStorage');
		localStorage.clear();
	};

	const resetAllButton = (
		<ActionButton btnContent="Reset History" extraClassNames="QuizMenu-reset-btn" />
	);

	const imgLoaders = (() => {
		const continents = [
			'europe',
			'asia',
			'north-america',
			'south-america',
			'africa',
			'oceania'
		];
		const imgLoaders = continents.map((c) => (
			<div key={c} className={`img-loader img-loader-${c}`} />
		));
		return <div className="img-loader-container">{imgLoaders}</div>;
	})();

	return (
		<div className="QuizMenu">
			<div className="QuizMenu-contents">
				<h1 className="QuizMenu-heading">Choose a Quiz!</h1>
				<div className="QuizMenu-links">{buildLinks()}</div>

				<ConfirmationModal
					btnComponent={resetAllButton}
					confirmationText="Are you sure?"
					confirmationSubText="This can't be undone."
					acceptText="Yes"
					rejectText="No"
					handleAccept={clearLocalStorage}
				/>

				{/* TODO: remove this hack */}
				{imgLoaders}
			</div>
		</div>
	);
}

// function QuizLink(props) {
// 	const { quizProps } = props;
// 	return (
// 		<Link className="btn-contents" to={quizProps.makeQuizRouteString()}>
// 			{quizProps.variant}
// 		</Link>
// 	);
// }
