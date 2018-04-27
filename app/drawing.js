import { addIndex, forEach, map, reverse } from 'ramda';
import { pickRandom } from './util';

const ONE_TURN = 2 * Math.PI;

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d', { alpha: false });

const colors = ['white', 'cyan', 'magenta', 'yellow'];

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
  const radiusFactor = pickRandom([0.25, 0.5, 1]);
  const radius = ball.size * radiusFactor;
  const color = pickRandom(colors);
  drawCircle(ball.position, radius, color);
};

const drawPlayer = (player) => {
  /* Draw it backwards so the head is drawn on top, and you run over yourself
   * instead of under yourself. */
  addIndex(forEach)((position, index) => {
    const color = colors[(player.positions.length - index - 1) % colors.length];
    drawCircle(position, player.size, color);
  }, reverse(player.positions));
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
  canvas,
  drawScene,
  setCanvasSize,
};
