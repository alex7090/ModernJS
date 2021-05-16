



import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ChatIcon from '@material-ui/icons/Chat';

const tileData = [
    {
        title: 'Image1',
        author: 'author1',
        key: 1,
    }, {
        title: 'Image2',
        author: 'author2',
        key: 2,
    },
    {
        title: 'Image1',
        author: 'author1',
        key: 3,
    }, {
        title: 'Image2',
        author: 'author2',
        key: 4,
    },
    {
        title: 'Image1',
        author: 'author1',
        key: 5,
    }, {
        title: 'Image2',
        author: 'author2',
        key: 6,
    },
];

export class chatGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetchingData: false,
            data: null,
            fullData: null
        };
    }

    componentDidMount() {
        this.setState({ isFetchingData: true });
    }

    render() {
        return (
            <div >
                <GridList width={1} cellHeight={180}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">My Chats</ListSubheader>
                    </GridListTile>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.key}>
                            <GridListTileBar
                                title={tile.title}
                                subtitle={<span>by: {tile.author} with 7 people</span>}
                                actionIcon={
                                    <IconButton aria-label={`info about ${tile.title}`} href="/chat">
                                        <ChatIcon />
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    }
}