import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavBar from './NavBar';
import QuizRoutes from './QuizRoutes';

const theme = createTheme({
	typography: {
		fontFamily: [
			'Work Sans',
			'Nunito',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif'
		].join(',')
	}
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				{/* <NavBar /> */}
				<QuizRoutes />
			</div>
		</ThemeProvider>
	);
}

export default App;
