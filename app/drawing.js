import { pickRandom } from './util';

const ONE_TURN = 2 * Math.PI;

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d', { alpha: false });

const drawCircle = (position, radius, fillStyle) => {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(...position, radius, 0, ONE_TURN);
  ctx.fill();
};

const drawBackground = (world) => {
  ctx.fillStyle = '#334';
  ctx.fillRect(0, 0, ...world.size);
};

const drawBall = (ball) => {
  const radiusFactor = pickRandom([1, 2, 6]);
  const radius = ball.size * radiusFactor;
  const color = pickRandom(['cyan', 'magenta', 'yellow', 'white']);
  drawCircle(ball.position, radius, color);
};

const drawPlayer = (player) => {
  drawCircle(player.position, player.size, 'magenta');
};

const setCanvasSize = (size) => {
  [canvas.width, canvas.height] = size;
};

const drawScene = (state) => {
  const { world, ball, player } = state;
  drawBackground(world);
  drawBall(ball);
  drawPlayer(player);
};

export {
  drawScene,
  setCanvasSize,
};
