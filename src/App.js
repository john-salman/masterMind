import React, {Component} from 'react';
import './Mastermind.css';

const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');

let uniqueSeed = 0;
function nextUniqueKey() {
  return uniqueSeed += 1;
}

const NUM_ROWS = 6, NUM_COLUMNS = 5;

class SecretCode extends Component {
  render() {
    return (
        <td width="50px" height="50px" style={{backgroundColor: this.props.color}}>

        </td>
    )
  }
}

class StatusRow extends Component {
  render() {
      let {
          color,
          colorName
      } = this.props.statusCircle;

      return (<table className="status_circles">
                <tbody>
                    <tr>
                        <td><img onClick={() => this.props.reset()} className="large_circle" src={red} alt="red circle" /></td>
                        <td><img className="large_circle" src={color} alt={colorName} /></td>
                    </tr>
                </tbody>
              </table>)
  }
}



class MasterMindCell extends Component {
    render() {
        return (
            <td key={this.props.key}>
                <img className="large_circle"  onClick={() => this.props.handleBoardClick(this.props.colIdx)} src={this.props.src} alt={this.props.alt} />
            </td>
        )
    }
}

class MasterMindRow extends Component {

    make_cells(feedback) {
        let feedback_table = [[],[]];
        for (let i = 0; i < 2; i++){
            if (feedback[i] !== null) {
                feedback_table[0][i] = <td><img className="small_circle" src={feedback[i].color} alt={feedback[i].colorName} /></td>;
            } else {
                feedback_table[0][i] = <td></td>;
            }
        }
        for (let i = 2; i < 4; i++) {
            if (feedback[i] !== null) {
                feedback_table[1][i] = <td><img className="small_circle" src={feedback[i].color} alt={feedback[i].colorName} /></td>;
            } else {
                feedback_table[1][i] = <td></td>;
            }
        }
        return feedback_table;
    }

    feedbackCircles(feedback) {
        let feedback_cells = this.make_cells(feedback);
        return (
            <table>
                <tbody className="feedback_table">
                    <tr>
                        {
                            feedback_cells[0].map((current) =>
                                current
                            )
                        }
                    </tr>
                    <tr>
                        {
                            feedback_cells[1].map((current) =>
                                current
                            )
                        }
                    </tr>
                </tbody>
            </table>
        )
    }

    render () {
        return (
            <tr>
                {this.props.row.map((circle, idx) =>
                    <MasterMindCell colIdx={idx} handleBoardClick={this.props.handleBoardClick} src={circle.color} alt={circle.colorName} />
                )}
                <td className="feedback_cell">{this.props.feedback ? this.feedbackCircles(this.props.feedback) : ""}</td>
            </tr>
        )
    }
}

class MasterMindTable extends Component {

    render() {

        console.log("Feedback Array now: ", this.props.feedbackArray);
        let masterMindArray = this.props.masterMindArray;
        let feedbackArray = this.props.feedbackArray ? this.props.feedbackArray : null;

        return (
                    masterMindArray.map((current, index) => {
                        return current[0] !== 0 ? <MasterMindRow idx={index} handleBoardClick={this.props.handleBoardClick} row={current} feedback={feedbackArray[index] ? feedbackArray[index] : null}/> : <div className="spacer"></div>;
                    })

        )

    }
}

class Palette extends Component {
  render() {
      return <table className="palette_circles"><tbody><tr>
          {
              this.props.paletteColors.map((paletteElement, idx) =>
                  <td key={idx} >
                      <img className="large_circle" onClick={() => this.props.handlePalClick(idx)} src={paletteElement.color} alt={paletteElement.colorName} />
                  </td>
              )
          }
      </tr></tbody></table>;
  }
}

class App extends Component {

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
    super (props);

    let currentRow = 6; // 6
    let firstRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

    let code = this.createCode();

    this.state = {
        mastermindArray: [[0], [0], [0], [0], [0], [0], firstRow],
        feedbackArray: [],
        statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
        currentRow: currentRow,
        code: code,
        fill: 0
    };

    console.log("Here's the code you cheater: ", code);


    this.reset = this.reset.bind(this);
    this.handlePalClick = this.handlePalClick.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  reset() {
      let currentRow = 0;
      let firstRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

      let code = this.createCode();

      this.setState( {
          mastermindArray: [firstRow],
          feedbackArray: [],
          statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
          currentRow: currentRow,
          code: code,
          fill: 0
      });
    console.log("RESET");
  }

  handleClick() {
    this.setState (
        {statusCircle: this.nonFilledCircle}
    );
  }

  handlePalClick(palIdx) {
        this.setState (
        {statusCircle: this.paletteColors[palIdx]}
    )
  }

  handleBoardClick(colIdx) {
    if (this.state.correct || this.state.lost) {
      console.log("correct/lost triggered");
      return;
    }
    if (this.state.mastermindArray[this.state.currentRow][colIdx]['colorName'] !== 'Empty circle') {
        console.log("color filled triggered");
        return;
      }

    let newRow = JSON.parse(JSON.stringify(this.state.mastermindArray[this.state.currentRow].slice()));
    newRow[colIdx] = this.state.statusCircle;

    let newArray = JSON.parse(JSON.stringify(this.state.mastermindArray.slice()));
    newArray[this.state.currentRow] = newRow;

    /*
    * We should probably make a new fill.
    * Also, we dont need to check for a full fill yet as
    * the color check above will prevent overflow.
    * */
    let newFill = this.state.fill + 1;

    console.log("The fill is now: ", newFill);
    let newCRow;
    if (newFill === 4) {
        console.log("Now entering fill protected code with fill: ", this.state.fill);

        if (this.isCodeCorrect(newRow)) { // the row matches the secret code
            this.setState(
                {correct: true}
            );
        } else if (this.state.currentRow === 0) { // we have filled the last row
            this.setState(
                {lost: true}
            )
        } else { // the row didn't match and user still has tries
            newFill = 0;
            newCRow = this.state.currentRow - 1;
            newArray[newCRow] = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];
            //this.createNewRow();
        }
    }
    this.setState(
          {mastermindArray: newArray,
              fill: newFill,
              currentRow: newCRow ? newCRow: this.state.currentRow,
              statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
          }
      );


  }
  createNewRow() {
      let newCRow = this.state.currentRow + 1;
        let newRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];
        let newArray = JSON.parse(JSON.stringify(this.state.mastermindArray.slice()));
        newArray[newCRow] = newRow;

        this.setState(
            {mastermindArray: newArray,
                statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
                currentRow: newCRow
            }
        );
  }

    getRandomIdx(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

  createCode() {
        let code = [];
        for (let i = 0; i < 4; i++) {
            code[i] = this.paletteColors[this.getRandomIdx(0, 5)]
        }
        return code;
  }

  isCodeCorrect(row) {
        // create feedback circles
        let feedbackRow = [];
        console.log("The row as it be: ", row);
        let numCorrect = 0;
        row.forEach((current, index) => {
            if (current['colorName'] === this.state.code[index]['colorName']) { // add a red circle
                numCorrect++;
                feedbackRow[index] = {color: red, colorName: 'red'};
                console.log("Index ", index, " matches code exactly");
            } else if (this.state.code.find(obj => obj['colorName'] === current['colorName']) !== undefined){ // add a skeleton circle
                feedbackRow[index] = this.nonFilledCircle;
                console.log("Index ", index, " has a color of the code");
            } else {// do nothing
                feedbackRow[index] = null;
                console.log("Index ", index, " doesn't have anything right");
            }
        });
        let newFeedback = JSON.parse(JSON.stringify(this.state.feedbackArray.slice()));
        newFeedback[this.state.currentRow] = feedbackRow;

        this.setState({feedbackArray: newFeedback});

        return numCorrect === 4;

  }



  render() {
    return (
        <div className="outter">
            <div className="inner">
                <div className="Mastermind">
                    <StatusRow reset={this.reset} statusCircle={this.state.statusCircle}/>
                    <div style={{height: "100 %"}}>&nbsp;</div>
                    <table className="board_table">
                        <tbody>
                        {
                            <MasterMindTable
                                handleBoardClick={this.handleBoardClick}
                                masterMindArray={this.state.mastermindArray}
                                feedbackArray={this.state.feedbackArray}
                            />
                        }
                        </tbody>
                    </table>
                    <Palette
                        handlePalClick={this.handlePalClick}
                        paletteColors={this.paletteColors}
                    />

                </div>
            </div>
        </div>
    )
  }
}

export default App;
