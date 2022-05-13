/* eslint-disable no-multi-str */
import fs from 'fs';

import { TuringMachine } from './Machine';

function readFile(path: string) {
  const content = fs.readFileSync(`./data/${path}`, 'utf8');
  return content;
}

function exec(turingMachine: TuringMachine, ruleFile: string, input: string) {
  const rules = readFile(ruleFile);
  turingMachine.reset();
  turingMachine.loadRules(rules);
  turingMachine.loadTape(input);
  try {
    return turingMachine.run();
  } catch (erro) {
    return 'ERR';
  }
}

function main() {
  const dataFile = process.argv[2];
  if (!dataFile) {
    console.error('Error:You must provide the data File');
    process.exit(-1);
  }

  const turingMachine = new TuringMachine();

  const dataFileContent = readFile(dataFile);
  const batches = dataFileContent.split(/\r\n|\n/);
  batches.forEach(batch => {
    if (batch) {
      const [ruleFile, input] = batch.split(',');

      const output = exec(turingMachine, ruleFile, input);
      console.log([ruleFile, input, output.trim()].join(','));
    }
  });
}

main();
