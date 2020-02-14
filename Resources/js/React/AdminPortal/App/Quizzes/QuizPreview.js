import React, { Component, Fragment } from 'react';

export default class QuizPreview extends Component {

    render() {
        return this.props.questionIndex != null
            ? <QuizQuestionPreview question={this.props.quiz.questions[this.props.questionIndex]} disabled={!this.props.quiz.active} />
            : <QuizTilePreview quiz={this.props.quiz} disabled={!this.props.quiz.active}/>;                
    }

}

class QuizTilePreview extends Component {

    render() {                
        return (
            <div className="quiz-tile">
                <img className="object-fit-cover w-100" src={this.props.quiz.image.filename ? `/media?filename=${this.props.quiz.image.filename}` : '/images/no-image.png'} />
                <div className="quiz-title">
                    <div>{this.props.quiz.title}</div>
                    <small>Not yet attempted</small>
                </div>
            </div>
            )
    }
}

class QuizQuestionPreview extends Component {

    render() {
        
        // Text question text answer - TextOnly
        // Text question image answers - ImageAnswers
        // Image question text answers - ImageQuestion
        // True or false - TrueOrFalse

        let question = this.props.question;        

        let questionType = this.props.question.questionType;

        question.answers = questionType == 'TrueOrFalse' ? [{ text: 'False' }, { text: 'True' }] : this.props.question.answers;


        return this.props.question.image != null
            ? <ImageQuestion question={this.props.question} />
            : <TextQuestion question={this.props.question} />
            }

}

class ImageQuestion extends Component {

    render() {

        let answerTiles = this.props.question.answers.map((answer, index) => {
            return  <TextAnswerTile key={index} text={answer.text} className={index % 2 == 0 ? 'mr-2' : 'ml-2'} />
        })

        let audioIcon = this.props.question.audio != null ? <i className="fas fa-music fa-2x music-icon"></i> : null;

        return <div className="image-question">
            <div className="image">
                <img src={this.props.question.image.filename ? `/media?filename=${this.props.question.image.filename}` : '/images/no-image.png'} className="w-100 object-fit-cover" />
                <div className="question">
                    {this.props.question.text}
                    {audioIcon}
                </div>    
            </div>

            <div className={`row ${this.props.question.answers.length == 2 ? 'true-false-questions' : ''}`}>
                {answerTiles}
            </div>
        </div>
    }

}

class TextQuestion extends Component {    

    render() {

        let audioIcon = this.props.question.audio != null ? <i className="fas fa-music fa-2x music-icon"></i> : null;

        let isImageAnswer = this.props.question.questionType == 'ImageAnswers';

        let answerTiles = this.props.question.answers.map((answer, index) => {
            return !isImageAnswer
                ? <TextAnswerTile key={index} text={answer.text} className={index % 2 == 0 ? 'mr-2' : 'ml-2'} />
                : (<ImageAnswerTile key={index} className={index % 2 == 0 ? 'ml-3' : 'mr-3'}
                    imageSource={answer.image != null ? `/media?filename=${answer.image.filename}` : "/images/no-image.png"} text={answer.text} />)
        })

        return <div className="text-question">
            <div className={`question ${isImageAnswer ? 'question-collapsed' : ''}`}>
                <div className="center-text">
                    {this.props.question.text}
                    {audioIcon}
                </div>
            </div>
            <div className={`row ${this.props.question.answers.length == 2 ? 'true-false-questions' : ''}`}>
                {answerTiles}
            </div>
        </div>
    }

}

class ImageAnswerTile extends Component {

    render() {

        let question = this.props.text ? <div className="text">{this.props.text}</div > : null

        return (
            <div className="col-6 image-answer-tile-container">
                <div className={`image-answer-tile ${this.props.className || ''}`}>
                    <img src={this.props.imageSource} className="w-100 object-fit-cover" />
                    {question}
                </div>
            </div>
        )
    }

}

class TextAnswerTile extends Component {

    render() {
        return (
            <div className="col-6 mt-3">
                <div className={`text-answer-tile ${this.props.className || ''}`}>
                    <h5 className="mb-0">{this.props.text}</h5>
                </div>
            </div>
            )
    }    
}