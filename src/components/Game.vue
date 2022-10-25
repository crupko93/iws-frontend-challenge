<template>
  <div id="app">
    <div class="status">{{ status }}</div>
    <button @click="setByDef()">Reset</button>
    <template v-for="(row, i) in board">
      <div class="row" :key="i">
        <button type="button" v-for="(column, n) in board[i]" class="square" style="width:40px;height:40px;" :value="board[i][n]" @click="newTurn(i, n)">{{board[i][n]}}</button>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        status: 'Next player: X',
        board: [
          ['[]', '[]', '[]'],
          ['[]', '[]', '[]'],
          ['[]', '[]', '[]'],
        ],
      };
    },
    methods: {
      newTurn(x, y){
        if (this.board[x][y] !== '[]') {
        // Invalid move
          return;
        }
        // Set the value
        

        // Check whoose turn is
        if (this.status == 'Next player: X'){
            this.board[x][y] = 'X';
            if (this.playerWin('X')){
              this.status = 'Player X win!';
            }else{
              this.status = 'Next player: O';
            }
            
        }else if(this.status == 'Next player: O'){
            this.board[x][y] = 'O';
            if (this.playerWin('O')){
              this.status = 'Player O win!';
            }else{
              this.status = 'Next player: X';
            }
            
        }

        this.$forceUpdate();

      },
      playerWin (player){
        // Check horizontal rows
        for (let i=0; i<3; i++){
          if(this.board[0][i] == player && this.board[1][i] == player && this.board[2][i] == player){
            return true;
          }
        } 

        // Check vertical columns
        for (let i=0; i<3; i++){
          if(this.board[i][0] == player && this.board[i][1] == player && this.board[i][2] == player){
            return true;
          }
        }
        
        // Check diagonals
        if(this.board[0][0] == player && this.board[1][1] == player && this.board[2][2] == player){
            return true;
          }
        if(this.board[2][0] == player && this.board[1][1] == player && this.board[0][2] == player){
            return true;
          }   

        return false;  
      },
      setByDef (){
        this.status = 'Next player: X';
        this.board = [
          ['[]', '[]', '[]'],
          ['[]', '[]', '[]'],
          ['[]', '[]', '[]'],
        ];
      }
    }
  };
</script>