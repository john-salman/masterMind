import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

class Status extends Component {
  render() {
    return (
        <td width="50px" height="50px" style={{backgroundColor: this.props.status}}>

        </td>
    )
  }
}

class Reset extends Component {
  render() {
    return (
        <td width="50px" height="50px" style={{backgroundColor: 'red'}}>

        </td>
    )
  }
}


class Cell extends Component {

  render() {
    if (this.props.colIdx === 4) {
      let crrnss_cells = this.props.cell.correctness.slice();
      console.log("This be the cell: ", crrnss_cells);
      let mv_array = [0, 1];
      return (
          <td width="50px" height="50px">
            <tr>
            {
              mv_array.map((current) =>
                <td width="25px" height="25px" style={{backgroundColor: crrnss_cells[current]['color']}}>
                </td>
              )
            }
            </tr>
            <tr>
              {
                mv_array.map((current) =>
                    <td width="25px" height="25px" style={{backgroundColor: crrnss_cells[current + 2]['color']}}>
                    </td>
                )
              }
            </tr>
          </td>
      )
    }

    return (
        <td onClick={() => this.props.handleBoardClick(this.props.colIdx)} width="50px" height="50px"
            style={{backgroundColor: this.props.cell['color']}}>

        </td>
    )
  }
}

class Row extends Component {
  render() {
    if (this.props.draw) {
      return (
          <tr>
            {
              this.props.row.map((cell, idx) =>
                  <Cell key={nextUniqueKey()} cell={cell}
                        handleBoardClick={this.props.handleBoardClick} colIdx={idx}/>)
            }
          </tr>
      )
    }
    else {
      return (
          <tr>Not Drawn Yet</tr>
      )
    }
  }
}

class Palette extends Component {
  render() {
    return (
          <td onClick={() => this.props.handlePalClick(this.props.idx)} width="50px" height="50px"
              style={{backgroundColor: this.props.color}}>

          </td>
    )
  }
}

class App extends Component {
  constructor(props) {
    super (props);

    let board = Array(NUM_ROWS).fill(Array(NUM_COLUMNS).fill({color: "white", isOccupied: false}));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
      if (colIdx === 4)
        return {...board[rowIdx][colIdx],  row: rowIdx, column: colIdx, correctness: Array(4).fill({color:"white"})}
      return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
    console.log(board);

    let colors = ['green', 'orange', 'darkblue', 'yellow', 'darkred', 'lightblue'];

    let correct = false;
    let status = 'white';
    let lost = false;

    let currentRow = 0;
    let fill = 0;

    let code = [];

    let x;
    for (let i = 0; i < 4; i++) {
      x = Math.floor((Math.random() * 5) + 1);
      code[i] = colors[x];
    }

    this.state = {board: board,
                  colors:colors,
                  correct:correct,
                  status: status,
                  code: code,
                  currentRow: currentRow,
                  fill:fill,
                  lost:lost
                  };

    this.reset = this.reset.bind(this);
    this.handlePalClick = this.handlePalClick.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  reset() {
    console.log("RESET");
    return;
  }

  handleClick() {
    this.setState (
        {status: 'white'}
    );
  }

  handlePalClick(palIdx) {
    this.setState (
        {status: this.state.colors[palIdx]}
    )
  }

  handleBoardClick(colIdx) {
    if (this.state.correct || this.state.lost) {
      console.log("correct/lost triggered");
      return;
    }
    if (this.state.board[this.state.currentRow][colIdx].color !== "white") {
        console.log("color filled triggered");
        return;
      }
    let theRow = this.state.board[this.state.currentRow].slice();
    theRow[colIdx].color = this.state.status;

    let newBoard = this.state.board.slice();
    newBoard[this.state.currentRow] = theRow;

    let currentFill = this.state.fill + 1;

    this.setState({board: newBoard});

    if (currentFill === 4) {
        this.isCodeCorrect();
        if (!this.state.correct) {
            console.log("This done been set again");
            this.setState (
                {currentRow: this.state.currentRow + 1,
                  fill: 0,
                  status: 'white'
                }
            );
            return;
        } else if (this.state.correct) {
          return;
        }

        if (this.state.currentRow === 7) {
          console.log("LOST");
          this.setState (
              {lost: true}
          )
          return;
        }

        // else do winner stuff
    } else {
      this.setState (
          {
            fill: currentFill,
            board: newBoard
          }
      );
    }


  }

  isCodeCorrect() {
    let codeAccuracy = this.state.board[this.state.currentRow][4]['correctness'].slice();
    console.log("codeAccuracy: ", codeAccuracy);
    let correctValue = 0;
    this.state.board[this.state.currentRow].forEach((current, index) => {
      console.log("current color: ", current['color'], " code color: ", this.state.code[index]);
      if (index < 4 && current['color'] == this.state.code[index]) {
        console.log("Setting index: ", index, " to red.");
        codeAccuracy[index]['color'] = 'red';
        correctValue++;
      }
    });
    console.log("codeAccuracy now: ", codeAccuracy);
    let newBoard = this.state.board.slice();
    newBoard[this.state.currentRow][4]['correctness'] = codeAccuracy;
    console.log("correctValue: ", correctValue);
    if (correctValue == 4) {
      this.setState(
          {correct: true}
      );
      console.log("WINNER")
    }
    this.setState(
        {board: newBoard}
    )
  }

  render() {
    return (
      <div>
        <table border="1" align="center">
          <tbody>
          <tr><Reset handleClick={this.reset}/><td></td><td></td><td></td><td></td><td></td><Status status={this.state.status}/></tr>
          </tbody>
        </table>
        <table border="1" align="center">
          <tbody>
          <tr>
            {
              this.state.code.map((current, idx) =>
                <SecretCode color={current}/>
              )
            }
          </tr>
          </tbody>
        </table>
        <table border="1" align="center">
          <tbody>
          {
            this.state.board.map((row, idx) =>
                <Row
                     key={nextUniqueKey()}
                     handleBoardClick={this.handleBoardClick}
                     row={row}
                     draw={this.state.currentRow >= idx}
                />)
          }
          </tbody>
        </table>
        <table border="1" align="center">
          <tbody>
          <tr>
          {
            this.state.colors.map((color, idx) =>
              <Palette handlePalClick={this.handlePalClick} color={color} idx={idx}/>
            )
          }
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
