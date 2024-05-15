function startGame() {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  if (!canvas || !context) {
    return;
  }

  canvas.width = 400;
  canvas.height = 400;
}

startGame();
