import React, { Component } from 'react';
import $ from 'jQuery';

export default class NavOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            links: { main: [], education: [] }
        };
    }
    
    componentDidUpdate(prevProps) {
        if (this.props == prevProps) return null;
        let links = { main: [], education: [] };
        let section = 'main';
        let index = 0;

        // Add top-most dropzone to main section
        let dropzone = (<Dropzone index={index} key={index} section={section} onReorder={this.onReorder.bind(this)} />);
        links.main.push(dropzone);
        index++;

        // Iterate through links and add to component arrays
        // (API returns all main section items before education)
        if (this.props.links) {
            for (let linkIndex in this.props.links) {
                let link = this.props.links[linkIndex];
                let linkObject;

                if (link.section == 'main') {
                    linkObject = (
                        <NavItem nav={link} key={index} index={index} section={section}
                            activeId={this.props.activeId}
                            setActive={this.props.setActive.bind(this, link.id)}
                            addingNew={this.props.addingNew}
                        />
                    );
                    index++;
                    links.main.push(linkObject);
                } else if (link.section == 'education') {
                    if (section == 'main') {
                        // Add initial dropzone for education section if first link of education
                        section = 'education';
                        dropzone = (<Dropzone index={index} key={index} section={section} onReorder={this.onReorder.bind(this)} />);
                        links.education.push(dropzone);
                        index++;
                    }
                    linkObject = (
                        <NavItem nav={link} key={index} index={index} section={section}
                            activeId={this.props.activeId}
                            setActive={this.props.setActive.bind(this, link.id)}
                            addingNew={this.props.addingNew}
                        />
                    );
                    index++;
                    links.education.push(linkObject);
                }

                dropzone = (<Dropzone index={index} key={index} section={section} onReorder={this.onReorder.bind(this)} afterId={link.id} />);
                section == 'main' ? links.main.push(dropzone) : links.education.push(dropzone);
                index++;
            }
        }

        // If there were no education links, add a dropzone for education
        if (section == 'main') {
            section = 'education';
            dropzone = (<Dropzone index={index} key={index} section={section} onReorder={this.onReorder.bind(this)} />);
            links.education.push(dropzone);
        }

        console.log(links);

        this.setState({
            links
        });
    }

    onReorder(id, afterId, section) {        

        // Build list of all navitems from both sections
        let navItems = this.state.links.main.concat(this.state.links.education);

        // Remove dropzones 
        navItems = navItems.filter((item) => item.type.name == 'NavItem');

        // Remove the item that has been shifted
        let movedItemIndex = navItems.findIndex((item) => item.props.nav.id == id);
        let movedItem = navItems.splice(movedItemIndex, 1)[0];

        // Keep only links from the section being set
        navItems = navItems.filter((item) => item.props.section == section);

        // Insert shifted item to the beginning if no afterId is set
        if (!afterId) {
            navItems.unshift(movedItem);
        }
        // Otherwise, find the index of the new position and insert there
        else {
            let newIndex = navItems.findIndex((item) => item.props.nav.id == afterId);
            navItems.splice(newIndex + 1, 0, movedItem);
        }

        // Convert list of react components into a list of IDs
        navItems = navItems.map((item) => item.props.nav.id);

        // Send the new array up to the parent component for API submission
        this.props.onReorder(section, navItems, id);
    }

    render() {
        return (
            <React.Fragment>
                <h4>Main Navbar</h4>
                {this.state.links.main}
                <button className="btn btn-dark btn-sm d-block ml-auto mr-0 my-3" onClick={() => this.props.onAdd('main')} disabled={this.props.addingNew}>Add Link &nbsp; <i className="fas fa-plus" /></button>

                <hr />

                <h4>Education Navbar</h4>
                {this.state.links.education}
                <button className="btn btn-dark btn-sm d-block ml-auto mr-0 my-3" onClick={() => this.props.onAdd('education')} disabled={this.props.addingNew}>Add Link &nbsp; <i className="fas fa-plus" /></button>
            </React.Fragment>
        )
    }
}

class NavItem extends Component {
    onDrag(ev) {
        ev.dataTransfer.setData('drag-item', this.props.index);
        ev.dataTransfer.setData('drag-id', this.props.nav.id);
        ev.dataTransfer.setData('drag-type', 'nav-item');
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.dropEffect = 'none';
        this.toggleDragUi(ev);
    }

    onDragEnd(ev) {
        ev.dataTransfer.clearData();
        this.toggleDragUi(ev);
    }

    toggleDragUi = (ev) => $('.dropzone.dropzone-overview').toggleClass('dropzone-enabled');

    render() {
        let active = this.props.nav.id == this.props.activeId;

        return (
            <label className={`btn btn-outline-dark btn-block ${active ? 'active' : ''} ${this.props.addingNew && this.props.nav.id != 0 ? 'btn-invisible' : 'btn-visible'}`} data-index={this.props.index} data-section={this.props.section} data-id={this.props.nav.id} draggable={!this.props.addingNew}
                onDragStart={this.onDrag.bind(this)} onDragEnd={this.onDragEnd.bind(this)}>
                <input type="radio" name="navitem" onChange={this.props.setActive} disabled={this.props.addingNew}/>
                {this.props.nav.text}
            </label>
        )
    }
}

class Dropzone extends Component {
    onDragEnter(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        this.toggleHover(ev);
    }

    onDragLeave(ev) {
        this.toggleHover(ev);
    }

    onDragOver(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
    }

    onDrop(ev) {
        ev.preventDefault();
        this.toggleHover(ev);
        //let dragItem = ev.dataTransfer.getData('drag-item');

        // Change order of appearance in the view
        //let navitem = $(`[data-index=${dragItem}]`);
        //ev.target.replaceWith(navitem[0]);

        // Update navitem section value
        //navitem.attr('data-section', this.props.section);

        // Change order of appearance in the array
        this.props.onReorder(ev.dataTransfer.getData('drag-id'), this.props.afterId, this.props.section);

    }

    toggleHover = (ev) => $(`#${ev.target.id}`).toggleClass('dropzone-hover');

    render() {
        return (
            <div id={`dropzone-${this.props.index}`} data-index={this.props.index} className='dropzone dropzone-overview' data-section={this.props.section} onDragEnter={this.onDragEnter.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)} onDragOver={this.onDragOver.bind(this)} onDrop={this.onDrop.bind(this)}>
            </div>
        )
    }
}