import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import Card, { CardHighlight, CardBody } from '../../../Components/Card';
import { FormGroup, Input } from '../../../Components/FormControl';
import { Button } from '../../../Components/Button';

const url = '/admin/app/quizzes';

export default class QuizIndex extends Component {    

    constructor(props) {
        super(props);

        this.state = {
            quizzes: null,
            code: null,
            codeChanged: false
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${url}/data`,
        }).done((data) => {
            this.setState({
                quizzes: data
            });
        }).fail((err) => {
            this.props.alert(null, err.responseText);
        });

        $.ajax({
            type: 'get',
            url: `${url}/master`
        }).done(code => {
            this.setState({ code, codeChanged: false })
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
    }

    onCodeUpdate(e) {
        e.preventDefault();

        $.ajax({
            type: 'patch',
            url: `${url}/master`,
            data: {newCode: this.state.code}
        }).done(() => {
            this.props.alert.success('Code updated!');
            this.setState({ codeChanged: false });
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
            this.getData();
        })
    }

    render() {

        let quizCards = [];
        if (this.state.quizzes) quizCards = this.state.quizzes.map(q => {
            return <QuizCard key={q.id} quiz={q} cb={this.props.onSelect.bind(this, q.id)} />
        })

        quizCards.push(<NewQuizCard key="0" cb={this.props.onAdd.bind(this)} />)

        let buttons = this.state.codeChanged ? (
            <div className="text-center">
                <Button className="btn btn-danger" cb={this.getData.bind(this)}><i className="fas fa-times"></i></Button>
                <Button className="btn btn-success" type="submit"><i className="fas fa-check"></i></Button>
            </div>
        ) : null;

        return (
            <Fragment>
                <Card className="card px-0 col-xl-5 col-lg-6 col-md-8 mx-auto mt-5">
                    <CardHighlight>
                        <h3 className="pt-3 pb-2">Global Settings</h3>
                    </CardHighlight>
                    <CardBody>
                        <form onSubmit={(e) => this.onCodeUpdate(e)}>
                            <FormGroup htmlFor="master-code" label="Master Unlock Code" required>
                                <Input type="number" inputClass="no-buttons" id="master-code" cb={(code) => this.setState({ code, codeChanged: true })} value={this.state.code} required />
                                <small>Code must be numeric only</small> 
                            </FormGroup>                           
                            {buttons}
                        </form>
                    </CardBody>
                </Card>
            <Card className="card px-0 col-xl-5 col-lg-6 col-md-8 mx-auto my-5">
                <CardHighlight>
                        <h3 className="pt-3 pb-2">Select Quiz</h3>
                    </CardHighlight>
                    <div>
                        {quizCards}
                    </div>
                </Card>
            </Fragment>
            )
    }
}

class QuizCard extends Component {
    render() {
        let active = this.props.quiz.active;

        return (
            <div className="m-2 row quiz-card p-3 pointer" onClick={this.props.cb.bind(this, this.props.quiz.title)}>
                <div></div>
                <div className="col-7">
                    <h5>{this.props.quiz.title}</h5>
                    <span className="question-count">{this.props.quiz.questionCount} questions</span>
                </div>
                <div className="col-5 text-right">
                    <small className={`font-weight-bold ${active ? "text-success" : "text-danger"}`}>{active ? "ENABLED" : "DISABLED"}</small> 
                </div>
            </div>
            )
    }
}

class NewQuizCard extends Component {
    render() {
        return (
            <div className="text-center m-2 quiz-card pointer py-3" onClick={this.props.cb.bind(this)} style={{ color: "#AEAEAE" }}>
                <div className="inline-block ff-category-card">
                    <i className="far fa-plus-circle fa-3x"></i>
                    <small className="d-block">Add new</small>
                </div>
            </div>
            )
    }
}