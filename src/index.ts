/* eslint-disable no-multi-str */
import { TuringMachine } from './Machine';

const turingMachine = new TuringMachine();

turingMachine.loadTape('A/B/C/D@');
turingMachine.loadRules(
  '* @ . * halt\n' +
    '0 * * r 0\n' +
    '0 / x r y\n' +
    'y * * r y\n' +
    'y / y r 0',
);
turingMachine.reset();

const value = turingMachine.run();
console.log(value);
