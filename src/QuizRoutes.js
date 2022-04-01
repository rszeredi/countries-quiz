import React from 'react';
import { Route, Routes } from 'react-router';
import Quiz from './Quiz';
import QuizCategoryPage from './QuizCategoryPage';
import QuizMenu from './QuizMenu';
import QuizPage from './QuizPage';

import quizzes from './QuizProps';

export default function QuizRoutes() {
	console.log(quizzes);

	const createRoutes = () => {
		let routes = [];

		for (let [ cat, quizList ] of Object.entries(quizzes)) {
			const [ catText, catEmoji ] = cat.split(':');
			const catPath = catText.toLowerCase().replace(' ', '-');

			routes.push(
				<Route
					path={'/' + catPath}
					element={<QuizCategoryPage quizCategory={catText} quizList={quizList} />}
					key={cat}
				/>
			);
			for (let quiz of quizList) {
				const baseRoute = quiz.makeQuizRouteString();
				// make a route for the "home" page of each quiz
				routes.push(
					<Route
						path={baseRoute}
						element={<QuizPage quizProps={quiz} />}
						key={`${quiz.quizId}`}
					/>
				);

				// make a route for test mode
				routes.push(
					<Route
						path={baseRoute + '/quiz'}
						element={<Quiz quizProps={quiz} isInStudyMode={false} />}
						key={`quiz-${quiz.quizId}`}
					/>
				);

				// make another route for study mode
				routes.push(
					<Route
						path={baseRoute + '/study'}
						element={<Quiz quizProps={quiz} isInStudyMode={true} />}
						key={`study-${quiz.quizId}`}
					/>
				);
			}
		}

		return routes;
	};

	return (
		<Routes>
			<Route path="/" element={<QuizMenu />} />
			{createRoutes()}
		</Routes>
	);
}
