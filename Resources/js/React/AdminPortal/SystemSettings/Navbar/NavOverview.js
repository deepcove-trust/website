import React, { Component } from 'react';

export default class NavOverview extends Component {
    render() {
        let links = { main: [], education: [] };
        if (!!this.props.links) {
            for (let [key, link] of Object.entries(this.props.links)) {
                let linkObject = <NavItem nav={link} key={key} _key={key}
                    activeId={this.props.activeId}
                    setActive={this.props.setActive.bind(this, key)}
                />;

                if (link.section == "main") {
                    links.main.push(linkObject);
                } else if(link.section == "education") {
                    links.education.push(linkObject)
                }
            }
        }

        return (
            <React.Fragment>
                <h4>Main Navbar</h4>
                {links.main}
                <button className="btn btn-dark btn-sm d-block ml-auto mr-0 my-3" disabled>Add Link <i className="fas fa-plus" /></button>

                <hr />

                <h4>Education Navbar</h4>
                {links.education}
                <button className="btn btn-dark btn-sm d-block ml-auto mr-0 my-3" disabled>Add Link <i className="fas fa-plus" /></button>
            </React.Fragment>
        )
    }
}

class NavItem extends Component {
    render() {
        let active = this.props._key == this.props.activeId;

        return (
            <label className={`btn btn-outline-dark btn-block ${active ? 'active' : ''}`}>
                <input type="radio" name="navitem" onChange={this.props.setActive}/>
                {this.props.nav.text}
            </label>    
        )
    }
}