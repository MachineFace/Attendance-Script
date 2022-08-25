
class SudokuSolver
{
  constructor({
    board : board
  }) {
    this.gridsize = 9;
    this.board = board ? board : [];
    this.Solve(this.board);
  }

  /**
   * Check if a number exists in a Row 
   */
  IsNumberInRow (number, row) {
    for(let i = 0; i < this.gridsize; i++) {
      if(this.board[row][i] == number) return true;
    }
    return false;
  }

  /**
   * Check if a number exists in a Column
   */
  IsNumberInColumn (number, column) {
    for(let i = 0; i < this.gridsize; i++) {
      if(this.board[i][column] == number) return true;
    }
    return false;
  }

  /**
   * Check if a number exists in a Row
   */
  IsNumberInBox (number, row, column) {
    let localBoxRow = row - row % 3;
    let localBoxColumn = column - column % 3;
    for(let i = localBoxRow; i < localBoxRow + 3; i++ ) {
      for(let j = localBoxColumn; j < localBoxColumn + 3; j++) {
        if(this.board[i][j] == number) return true;
      }
    }
    return false;
  }

  /**
   * Check if the number a valid placement
   */
  IsValidPlacement (number, row, column) {
    return !this.IsNumberInRow(number, row) && !this.IsNumberInColumn(number, column) && !this.IsNumberInBox(number, row, column);
  }

  /**
   * Main Solve Instance
   */
  Solve (board) {
    for(let row = 0; row < this.gridsize; row++) {
      for(let column = 0; column < this.gridsize; column++) {
        if(this.board[row][column] == 0) {
          for(let testNumber = 1; testNumber <= this.gridsize; testNumber++) {
            if(this.IsValidPlacement(testNumber, row, column)) {
              this.board[row][column] = testNumber;
              if(this.Solve(this.board)) return true;
              else this.board[row][column] = 0;
            }
          }
          return false;
        }
      }
    }
    console.warn(`Problem Solved ---> \n`);
    console.warn(this.board);
    return true;
  }

  FindAllSolutions () {
    let original = this.board;
    let solutions = {};
    solutions.push(this.Solve(original));
    
  }


}

const _testSudoku = () => {
  const testBoard = [
    [7, 0, 2, 0, 5, 0, 6, 0, 0,],
    [0, 0, 0, 0, 0, 3, 0, 0, 0,],
    [1, 0, 0, 0, 0, 9, 5, 0, 0,],
    [8, 0, 0, 0, 0, 0, 0, 9, 0,],
    [0, 4, 3, 0, 0, 0, 7, 5, 0,],
    [0, 9, 0, 0, 0, 0, 0, 0, 8,],
    [0, 0, 9, 7, 0, 0, 0, 0, 5,],
    [0, 0, 0, 2, 0, 0, 0, 0, 0,],
    [0, 0, 7, 0, 4, 0, 2, 0, 3,],
  ]; 
  console.info(testBoard);
  new SudokuSolver({board : testBoard});
  console.warn(`=======================================`)
  const testBoard2 = [
    [3, 0, 0, 6, 5, 0, 0, 0, 0,],
    [4, 5, 0, 9, 0, 7, 0, 0, 0,],
    [7, 8, 0, 4, 3, 2, 5, 1, 0,],
    [0, 0, 3, 2, 9, 6, 0, 0, 0,],
    [0, 0, 7, 5, 8, 0, 0, 0, 3,],
    [0, 0, 8, 7, 0, 3, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 2, 0, 1,],
    [0, 0, 0, 1, 0, 0, 4, 6, 7,],
    [0, 6, 1, 3, 7, 4, 8, 9, 0,],
  ]; 
  console.info(testBoard2);
  new SudokuSolver({board : testBoard2});
  console.warn(`=======================================`)

}



