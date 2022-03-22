import React from 'react';
import { Route, Routes } from 'react-router';
import Game from './Game';
import QuizMenu from './QuizMenu';

export default function QuizRoutes() {
	return (
		<Routes>
			<Route path="/" element={<QuizMenu />} />
			<Route path="/capital-cities-europe" element={<Game continent="europe" />} />
			<Route path="/capital-cities-africa" element={<Game continent="africa" />} />
			<Route path="/capital-cities-asia" element={<Game continent="asia" />} />
			<Route path="/capital-cities-test" element={<Game continent="test" />} />
		</Routes>
	);
}
