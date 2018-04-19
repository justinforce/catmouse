import './style.css';
import * as Drawing from './drawing';
import * as Input from './input';
import * as State from './state';

// Setup
const { world } = State.init();
Drawing.init(world);
Input.press(State.save, 'i');
Input.press(State.load, 'o');
Input.toggle('left', 'ArrowLeft j J a A');
Input.toggle('right', 'ArrowRight l L d D');

// Start simulation
requestAnimationFrame(State.step(0, 0));
