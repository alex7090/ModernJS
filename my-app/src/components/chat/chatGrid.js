import React from 'react';

import IconButton from '@material-ui/core/IconButton';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';

import AuthService from "../../services/auth.service";
import ChatService from "../../services/chat.service";


export class chatGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openI: false,
            isFetchingData: false,
            data: null,
            fullData: null,
            currentUser: null,
            name: null,
            mail: null,
            channel_id: null
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    onChangeMail(e) {
        this.setState({
            mail: e.target.value
        });
    }

    openDialog() {
        this.setState({ open: true });
    }

    closeDialog() {
        this.setState({ open: false });
    };

    closeDialogCreate() {
        const { name, currentUser } = this.state;
        ChatService.create(name, currentUser.ID)
            .then((response) => {
                this.setState({ open: false });
                this.props.history.push("/");
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
            });

    }

    openDialogI(id, e) {
        console.log(id);
        this.setState({ openI: true, channel_id: id});
    }

    closeDialogI() {
        this.setState({ openI: false });
    };

    closeDialogInvite(e) {
        const { mail, channel_id } = this.state;
        this.setState({ openI: false });
        console.log(mail);
        console.log(channel_id);
        ChatService.invite(mail, channel_id)
            .then((response) => {
                this.setState({ open: false });
                this.props.history.push("/");
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
            });

    }

    componentDidMount() {
        this.setState({ isFetchingData: true });
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user
            });
            ChatService.fetch(user.ID)
                .then((response) => {
                    console.log(response.List);
                    this.setState({ data: response.List, fullData: response.List })
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    openChat(id, e) {
        this.props.history.push(`/chat/${id}`);
          window.location.reload();
    }

    render() {
        const { data, currentUser } = this.state;
        return (
            <div >
                {currentUser && data ? (
                    <List>
                        {data.map((tile) => (
                            <ListItem id={tile.id} button alignItems="flex-start" key={tile.id} onClick={this.openChat.bind(this, tile.id)}>
                                <ListItemText
                                    primary={tile.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary">{tile.admin}
                            </Typography>
                                            {' — Do you have Paris recommendations? Have you ever…'}
                                        </React.Fragment>
                                    }
                                />
                                {currentUser.ID == tile.admin_id ? (
                                    <ListItemSecondaryAction>
                                        <IconButton id={tile.id} edge="end" aria-label="comments" onClick={this.openDialogI.bind(this, tile.id)}>
                                            <SettingsIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                ) : (
                                    <div >
                                    </div>
                                )}
                            </ListItem>
                        ))}
                        <IconButton onClick={this.openDialog.bind(this)} aria-label={`info about`} >
                                <AddCircleOutlineIcon />
                            </IconButton>
                            <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Create a Chat</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Give a name to your chat. You will be able to invite your friends later.
                                    </DialogContentText>
                                    <TextField autoFocus margin="dense" id="name" label="Chat Name" fullWidth onChange={this.onChangeName.bind(this)} />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.closeDialog.bind(this)} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.closeDialogCreate.bind(this)} color="primary">
                                        Create
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={this.state.openI} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Invite</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Enter email adress to invite a friend.
                                    </DialogContentText>
                                    <TextField autoFocus margin="dense" id="email" label="email" type="email" fullWidth onChange={this.onChangeMail.bind(this)} />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.closeDialogI.bind(this)} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.closeDialogInvite.bind(this)} color="primary">
                                        Invite
                                    </Button>
                                </DialogActions>
                            </Dialog>
                    </List>
                ) : (
                    <p>Log in to access your chats</p>
                )}
            </div>
        );
    }
}