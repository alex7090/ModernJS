import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';




import { Chat } from "./components/chat/Chat.js";
// import { Login } from "./components/login/login.js";
import { chatGrid } from "./components/chatGrid";

import Login from "./components/login.component";
import Register from "./components/register.component";


import AuthService from "./services/auth.service";


import './App.css';
import "./styles.css";

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
  
    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    AuthService.logout();
  }


  render() {
    const { classes } = this.props;
    const { currentUser} = this.state;
    return (
      <div className="App">
        <div className="App-content">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                href="/"
                edge="start"
                className={classes.menuButton}
                color="inherit"
              >
                <HomeIcon />
              </IconButton>
              <Typography className={classes.title} variant="h6" noWrap >
                ModernJS
          </Typography>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                {currentUser ? (
                  <div className="navbar-nav ml-auto">
                    <Button color="inherit">Profile</Button>
                    <Button href="/login" onClick={this.logOut} color="inherit">Logout</Button>
                  </div>
                ) : (
                  <div className="navbar-nav ml-auto">
                    <Button href="/login" color="inherit">Login</Button>
                    <Button href="/register" color="inherit">Register</Button>
                  </div>
                )}
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/chat/:id" component={Chat} />
            <Route path="/login" component={Login} />
            <Route path="/" component={chatGrid} />
          </Switch>
        </div>
      </div>
    );
  }
}
export default withStyles(useStyles)(App)