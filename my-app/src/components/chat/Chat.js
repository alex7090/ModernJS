import React from 'react';
import { ChannelList } from './ChannelList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";
import AuthService from "../../services/auth.service";
const SERVER = "http://127.0.0.1:8080";

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            socket: null,
            channel: null,
            id: null
        }
    }
    // state = {
    //     currentUser: null,
    //     socket: null,
    //     channel: null,
    //     id: null
    // }
    socket;
    componentDidMount() {
        let id = this.props.match.params.id;
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                id: id,
                currentUser: user
            });

            this.loadChannel();
            this.configureSocket();
        }
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('channel', channel => {

            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            let channel = this.state.channel;
            if (!channel.messages) {
                channel.messages = [message];
            } else {
                channel.messages.push(message);
            }
            this.setState({ channel });
        });
        this.socket = socket;
    }

    loadChannel = async () => {
        var chan_id = this.props.match.params.id;
        fetch("http://localhost:8080/chat/channel?id=" + this.props.match.params.id).then(async response => {
            let data = await response.json();
            let tmp = {
                id: parseInt(this.props.match.params.id),
                sockets: []
            };
            if (data.List) {
                data.List.forEach(function(element){
                    let msg = {
                        channel_id: chan_id,
                        text: element.message,
                        senderName: element.username,
                        id: 1 + Math.random() * (56165654)
                    }
                    if (!tmp.messages) {
                        tmp.messages = [msg];
                    } else {
                        tmp.messages.push(msg);
                    }
                  });
                
            }
            this.setState({ channel: tmp })
        })
    }

    handleSendMessage = (channel_id, text) => {
        console.log(this.state.id)
        this.socket.emit('send-message', { channel_id: parseInt(this.state.id), text, senderName: this.state.currentUser.Username, id: Date.now() });
    }

    render() {

        return (
            <div className='chat-app'>
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}