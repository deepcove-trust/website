import React, { Component, Fragment } from 'react';
import { Checkbox } from '../../Components/FormControl';
import $ from 'jquery';

export default class Notifications extends Component {
    toggleChannel(id, method) {
        $.ajax({
            type: method ? 'post' : 'delete',// Callback, is the checkbox checked?
            url: `${this.props.baseUri}/channel/${id}`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            Console.err(`[Notifications@toggleChannel] Error leaving/removing a notification channel: ${err.ResponseText}`);
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
                    <Checkbox id={channel.id}
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