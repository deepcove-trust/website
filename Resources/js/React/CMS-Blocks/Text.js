import React, { Component, Fragment } from 'react';
import TextBlockLink from './Link';
import { FormGroup, Input, TextArea } from '../Components/FormControl';

// For Dev purposes
const dataTemplate = {
    id: 0,
    title: "Text Block Heading (Optional)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id felis lobortis, sodales dui vitae, finibus augue. Curabitur non vehicula dui. Mauris rutrum fermentum nulla, a porta magna interdum vitae.Morbi consectetur id diam in placerat.Aliquam ultrices nunc in ex lobortis dignissim.Nullam lorem ligula, euismod sed erat in, vulputate venenatis dui.Ut sit amet porta felis.",
    link: {//Button or hyperlink
        id: 0, 
        text: "Download our Pricelist",
        href: "https://localhost:44314/url-to-action",// Relative URL means instie, absolute means we show an external icon
        isButton: true, // Button or link
        color: "danger",// Btn Colours (Only used on buttons)
        align: null,//Left, Right, Center, Block (should be converted to classes  )
    }
}

export default class TextBlock extends Component {
    render() {
        let heading;
        if (dataTemplate.title) {
            heading = <h6>{dataTemplate.title}</h6>
        }

        let link;
        if (dataTemplate.link) {
            link = <TextBlockLink link={dataTemplate.link} />
        }

        return (
            <Fragment>
                {heading}
                <p>{dataTemplate.text}</p>
                {link}
            </Fragment>
        )
    }
}