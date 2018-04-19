import './style.css';
import * as Drawing from './drawing';
import * as Input from './input';
import * as Simulation from './simulation';

// Setup
const { world } = Simulation.init();
Drawing.init(world);
Input.press(Simulation.save, 'i');
Input.press(Simulation.load, 'o');
Input.toggle('left', 'ArrowLeft j J a A');
Input.toggle('right', 'ArrowRight l L d D');

// Start simulation
requestAnimationFrame(Simulation.step(0, 0));
