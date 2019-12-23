import React, { Component, Fragment } from 'react';
import { Checkbox } from '../../Components/FormControl';
import $ from 'jquery';

export default class Notifications extends Component {
    toggleChannel(id, method) {
        $.ajax({
            // Callback, is the checkbox checked?
            type: method ? 'post' : 'delete',
            url: `${this.props.baseUri}/channel/${id}`
        }).done((msg) => {
            this.props.alert.info(msg);
            this.props.u();
        }).fail((err) => {
            this.props.alert.error(null, err.ResponseText);
        });
    }

    render() {
        let avaliableChannels;
        if (this.props.channels) {
            avaliableChannels = this.props.channels.map((channel, key) => {
                // Mark the groups the user is in
                let checked = false;
                for (let i = 0; i < this.props.channelMemberships.length; i++) {
                    if (this.props.channelMemberships[i] == channel.id) {
                        checked = true;
                        continue;
                    }
                }
                // Render the actual checkmark.
                return (
                    <Checkbox id={channel.id} key={key}
                        label={channel.name}
                        tooltip={channel.description}
                        checked={checked}
                        cb={this.toggleChannel.bind(this, channel.id)}
                    />
                )
            });
        }

        return (
            <Fragment>
                <p>Send me emails when...</p>
                {avaliableChannels}
            </Fragment>
        )
    }
}