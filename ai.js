export function getAIMove(board, difficulty){

  if(difficulty==="easy"){
    const empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
  }

  if(difficulty==="medium"){
    return findWin(board,"O") ?? findWin(board,"X") ?? random(board);
  }

  if(difficulty==="hard"){
    return minimaxRoot(board);
  }
}

function random(board){
  const empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function findWin(board,player){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let combo of wins){
    const vals=combo.map(i=>board[i]);
    if(vals.filter(v=>v===player).length===2 && vals.includes("")){
      return combo[vals.indexOf("")];
    }
  }
  return null;
}

function minimaxRoot(board){
  let best=-Infinity,move;
  board.forEach((cell,i)=>{
    if(cell===""){
      board[i]="O";
      let score=minimax(board,false);
      board[i]="";
      if(score>best){best=score;move=i;}
    }
  });
  return move;
}

function minimax(board,isMax){
  let winner=check(board);
  if(winner!==null){
    return {O:1,X:-1,tie:0}[winner];
  }

  if(isMax){
    let best=-Infinity;
    board.forEach((cell,i)=>{
      if(cell===""){
        board[i]="O";
        best=Math.max(best,minimax(board,false));
        board[i]="";
      }
    });
    return best;
  }else{
    let best=Infinity;
    board.forEach((cell,i)=>{
      if(cell===""){
        board[i]="X";
        best=Math.min(best,minimax(board,true));
        board[i]="";
      }
    });
    return best;
  }
}

function check(board){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let [a,b,c] of wins){
    if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
  }
  if(board.every(c=>c!=="")) return "tie";
  return null;
}