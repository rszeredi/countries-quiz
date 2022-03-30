import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import ActionButton from './ActionButton';

import './ConfirmationModal.css';
import { withStyles } from '@mui/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmationModal(props) {
	const [ open, setOpen ] = React.useState(false);
	const { confirmationText, confirmationSubText, acceptText, rejectText, handleAccept } = props;

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAcceptAndClose = () => {
		setOpen(false);
		setTimeout(handleAccept, 200);
	};

	return (
		<div className="ConfirmationModal">
			<ActionButton
				btnContent="Reset Quiz Progress"
				handleClick={handleClickOpen}
				extraClassNames="QuizPage-question-history-reset-btn"
			/>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{confirmationText}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{confirmationSubText}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAcceptAndClose}>{acceptText}</Button>
					<Button onClick={handleClose}>{rejectText}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ConfirmationModal;
