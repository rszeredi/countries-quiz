import React from 'react';
import { Route, Routes } from 'react-router';
import Quiz from './Quiz';
import QuizMenu from './QuizMenu';

import quizzes from './QuizProps';

export default function QuizRoutes() {
	console.log(quizzes);

	// let routes = []
	// quizzes
	// 			.foreach((_, categoryQuizzes) =>
	// 				categoryQuizzes.map((quiz) => {
	// 					return (
	// 						<Route
	// 							path={'/' + quiz.route}
	// 							element={<Quiz quizProps={quiz} />}
	// 							key={quiz.route}
	// 						/>
	// 					);
	// 				})
	// 			)
	console.log(Object.values(quizzes));
	return (
		<Routes>
			<Route path="/" element={<QuizMenu />} />
			{Object.values(quizzes).map((categoryQuizzes) =>
				categoryQuizzes.map((quiz) => {
					return (
						<Route
							path={'/' + quiz.route}
							element={<Quiz quizProps={quiz} />}
							key={quiz.route}
						/>
					);
				})
			)}
		</Routes>
	);
}
