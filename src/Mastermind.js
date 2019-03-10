import React, { Component } from 'react';
import './Mastermind.css';

const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');



class Mastermind extends Component {

    paletteColors = [
        {color: green, colorName: 'Green'},
        {color: teal, colorName: 'Teal'},
        {color: magenta, colorName: 'Magenta'},
        {color: blue, colorName: 'Blue'},
        {color: red, colorName: 'Red'},
        {color: purple, colorName: 'Purple'}
    ];

    nonFilledCircle = {
        color: emptyCircle,
        colorName: 'Empty circle'
    };


    constructor(props) {
        super(props);

        let firstRow = [
            this.paletteColors[1],
            this.paletteColors[3],
            this.paletteColors[0],
            this.paletteColors[5],
        ];
        let secondRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

        let firstRowFeedback = [
            {color: red, colorName: 'Red'},
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle
        ];

        this.state = {
            mastermindArray: [firstRow, secondRow],
            feedbackArray: [firstRowFeedback],
            statusCircle: {color: emptyCircle, colorName: 'Empty circle'}
        }
    }

    componentDidMount() {

    }

    selectedPaletteCircle(circle) {
        console.log('selected a palette color', circle.colorName);
        this.setState({statusCircle: circle});
    }

    getRandomIdx(low, high) {

            return Math.floor(Math.random() * (high - low + 1) + low);
    }

    paletteCircles() {
        return <table className="palette_circles"><tbody><tr>
            {
                this.paletteColors.map((paletteElement, idx) =>
                    <td key={idx} onClick={() => this.selectedPaletteCircle(paletteElement)}>
                        <img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName} /></td>)
            }
          </tr></tbody></table>;

    }

    feedbackCircles(feedback) {
        return (<table>
            <tbody className="feedback_table">
                <tr><td><img className="small_circle" src={feedback[0].color} alt={feedback[0].colorName} /></td>
                    <td><img className="small_circle" src={feedback[1].color} alt={feedback[1].colorName} /></td></tr>
                <tr><td><img className="small_circle" src={feedback[2].color} alt={feedback[2].colorName} /></td>
                    <td><img className="small_circle" src={feedback[3].color} alt={feedback[3].colorName} /></td></tr>
            </tbody>
            </table>);
    }

    mastermindTableRow(row, feedback = undefined) {
        return <tr>
            {row.map((circle, idx) => <td key={idx}><img className="large_circle" src={circle.color} alt={circle.colorName} /></td>)}
            <td className="feedback_cell">{feedback ? this.feedbackCircles(feedback) : ""}</td>
        </tr>

    }

    mastermindTable() {
        return <table className="board_table"><tbody>
            {this.mastermindTableRow(this.state.mastermindArray[1])}
            {this.mastermindTableRow(this.state.mastermindArray[0], this.state.feedbackArray[0])}
        </tbody></table>;
    }

    statusRow() {
        let {
            color,
            colorName
        } = this.state.statusCircle;

        return <table className="status_circles"><tbody>
           <tr><td><img className="large_circle" src={red} alt="red circle" /></td>
           <td><img className="large_circle" src={color} alt={colorName} /></td></tr>
               </tbody></table>
    }

    render() {
        return (
            <div className="Mastermind">
                {this.statusRow()}
                <div style={{height: "400px"}}>&nbsp;</div>
                    { this.mastermindTable() }
                    {this.paletteCircles()}

            </div>
        )

    }
}

export default Mastermind;
