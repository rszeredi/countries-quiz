import React from 'react';
import { Route, Routes } from 'react-router';
import Quiz from './Quiz';
import QuizCategoryPage from './QuizCategoryPage';
import QuizMenu from './QuizMenu';

import quizzes from './QuizProps';

export default function QuizRoutes() {
	console.log(quizzes);

	const createRoutes = () => {
		let routes = [];

		for (let [ cat, quizList ] of Object.entries(quizzes)) {
			const catPath = cat.toLowerCase().replace(' ', '-');

			routes.push(
				<Route
					path={'/' + catPath}
					element={<QuizCategoryPage quizCategory={cat} quizList={quizList} />}
					key={cat}
				/>
			);
			for (let quiz of quizList) {
				routes.push(
					<Route
						path={quiz.makeQuizRouteString()}
						element={<Quiz quizProps={quiz} />}
						key={quiz.quizId}
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
