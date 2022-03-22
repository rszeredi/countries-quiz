import { ThemeProvider, createTheme } from '@mui/material/styles';
import Game from './Game';

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
				<Game />
			</div>
		</ThemeProvider>
	);
}

export default App;
