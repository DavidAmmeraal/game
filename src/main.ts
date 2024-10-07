import { Game } from "./core/Game";

const container = document.getElementById("game");

if (!container) throw new Error("No container present!");

const game = new Game(container, {
  width: 800,
  height: 600,
  targetFps: 120,
  showFps: true,
});

game.start();
