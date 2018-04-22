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
  const radiusFactor = pickRandom([1, 2, 6]);
  const radius = ball.size * radiusFactor;
  const color = pickRandom(colors);
  drawCircle(ball.position, radius, color);
};

const drawPlayer = (player) => {
  /* I found it really hard to figure out a function to get the correct color so
   * the head is always white. I know it's simple math. I cannot do it right
   * now. I hate myself. For now, associate the colors with the positions up
   * front, then draw them. */
  const positionsAndColors = addIndex(map)(
    (position, index) => ({ position, color: colors[index % colors.length] }),
    player.positions,
  );

  /* Draw it backwards so the head is drawn on top, and you run over yourself
   * instead of under yourself. */
  forEach(
    pac => drawCircle(pac.position, player.size, pac.color),
    reverse(positionsAndColors),
  );
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
