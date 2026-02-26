import { getAIMove } from "./ai.js";


document.addEventListener("DOMContentLoaded", () => {
  const tilesContainer = document.getElementById("tiles");
  if (!tilesContainer) return;

  const tileSize = 100;
  const cols = Math.ceil(window.innerWidth / tileSize);
  const rows = Math.ceil(window.innerHeight / tileSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.style.left = `${x * tileSize}px`;
      tile.style.top = `${y * tileSize}px`;

      const variation = Math.random() * 20 - 10;
      const gray = 224 + variation;
      tile.style.background = `rgb(${gray}, ${gray}, ${gray})`;

      const borderOpacity = Math.random() * 0.3 + 0.1;
      tile.style.borderColor = `rgba(160,160,160,${borderOpacity})`;

      tilesContainer.appendChild(tile);
    }
  }

  const tiles = document.querySelectorAll(".tile");

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const tileCenterX = rect.left + rect.width / 2;
      const tileCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - tileCenterX, 2) +
        Math.pow(mouseY - tileCenterY, 2)
      );

      tile.classList.toggle("hovered", distance < 100);
    });
  });

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const rect = tile.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      tiles.forEach((otherTile) => {
        const otherRect = otherTile.getBoundingClientRect();
        const otherCenterX = otherRect.left + otherRect.width / 2;
        const otherCenterY = otherRect.top + otherRect.height / 2;

        const distance = Math.sqrt(
          Math.pow(centerX - otherCenterX, 2) +
          Math.pow(centerY - otherCenterY, 2)
        );

        const delay = distance * 0.5;

        setTimeout(() => {
          otherTile.classList.add("shake");
          setTimeout(() => {
            otherTile.classList.remove("shake");
          }, 300);
        }, delay);
      });
    });
  });
});



window.addEventListener("load", () => {

  const modal = document.getElementById("game-modal");
  const fab = document.getElementById("minigame-fab");
  const closeBtn = document.getElementById("close-game");
  const boardEl = document.getElementById("board");
  const statusText = document.getElementById("status");
  const restartBtn = document.getElementById("restart");
  const difficultySelect = document.getElementById("difficulty");

  if (!modal || !fab) return;

  let board, history, gameActive;



  function startGame() {
    board = Array(9).fill("");
    history = { X: [], O: [] };
    gameActive = true;

    statusText.textContent = "";
    restartBtn.style.display = "none";
    difficultySelect.style.display = "block";

    drawBoard();
  }

  function closeGame() {
    modal.classList.remove("active");
    fab.style.display = "flex";
  }



  fab.addEventListener("click", () => {
    modal.classList.add("active");
    fab.style.display = "none";
    startGame();
  });


  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeGame();
    });
  }



  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeGame();
    }
  });



  function drawBoard() {
    boardEl.innerHTML = "";

    board.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = board[i];
      cell.addEventListener("click", () => playerMove(i));
      boardEl.appendChild(cell);
    });
  }



  function playerMove(i) {
    if (!gameActive || board[i]) return;

    difficultySelect.style.display = "none";

    place(i, "X");

    if (checkWin("X")) {
      endGame("You win 🎉");
      return;
    }

    setTimeout(botMove, 300);
  }



  function botMove() {
    if (!gameActive) return;

    const move = getAIMove([...board], difficultySelect.value);

    place(move, "O");

    if (checkWin("O")) {
      endGame("You lose 😢");
    }
  }



  function place(i, player) {
    board[i] = player;
    history[player].push(i);

    if (history[player].length > 3) {
      board[history[player].shift()] = "";
    }

    drawBoard();
  }


  function checkWin(player) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    return wins.some(combo =>
      combo.every(index => board[index] === player)
    );
  }



  function endGame(text) {
    statusText.textContent = text;
    gameActive = false;
    restartBtn.style.display = "inline-block";
  }



  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      startGame();
    });
  }

});