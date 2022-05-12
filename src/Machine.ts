interface ICpu {
  state: string;
  symbol: string;
  tapePosition: number;
}
interface IRule {
  state: string;
  symbol: string;
  newState: string;
  newSymbol: string;
  direction: string;
}
export class TuringMachine {
  private tape: string[];
  private cpu: ICpu;
  private rules: IRule[];

  private read() {
    this.cpu.symbol = this.tape[this.cpu.tapePosition];
  }
  private write(symbol: string) {
    if (symbol !== '*') {
      this.tape[this.cpu.tapePosition] = symbol;
    }
  }
  private moveRight() {
    if (this.cpu.tapePosition === this.tape.length) {
      this.tape.push();
    }
    this.cpu.tapePosition += 1;
  }
  private moveLeft() {
    if (this.cpu.tapePosition === 0) {
      this.tape.unshift();
    } else {
      this.cpu.tapePosition -= 1;
    }
  }
  private moveHead(direction: string) {
    switch (direction) {
      case 'l':
        this.moveLeft();
        break;
      case 'r':
        this.moveRight();
        break;
      case '*':
        return;
      default:
        throw new Error(`invalid direction: ${direction}`);
    }
  }

  private findRule(state: string, symbol: string) {
    let matchingRule = this.rules.find(
      rule => rule.state === state && rule.symbol === symbol,
    );
    if (!matchingRule) {
      matchingRule = this.rules.find(rule => {
        return (
          (rule.state === state && (symbol === '*' || rule.symbol === '*')) ||
          (rule.state === '*' && rule.symbol === symbol)
        );
      });
    }

    if (!matchingRule) {
      throw new Error(`Rule not found: state:${state} symbol:${symbol}`);
    }
    return matchingRule;
  }

  public loadRules(rulesFile: string) {
    const ruleLines = rulesFile
      .split(/\r\n|\n/)
      // clear comments and blank lines
      .filter(line => !line.trim().startsWith(';') && line);

    this.rules = ruleLines.map((line, index) => {
      const ruleLine = line.split(' ');

      if (ruleLine.length !== 5) {
        throw new Error(`invalid rule at line ${index}:${ruleLine}`);
      }
      return {
        state: ruleLine[0],
        symbol: ruleLine[1],
        newSymbol: ruleLine[2],
        direction: ruleLine[3],
        newState: ruleLine[4],
      };
    });
    // console.log(this.rules);
  }
  public reset() {
    this.cpu = {
      state: '0',
      symbol: '',
      tapePosition: 0,
    };
  }
  public loadTape(tape: string) {
    this.tape = tape.split('');
  }
  public step() {
    this.cpu.symbol = this.tape[this.cpu.tapePosition];
    // console.log(this.cpu);
    // console.log(this.tape);
    const rule = this.findRule(this.cpu.state, this.cpu.symbol);
    // console.log(rule);
    this.cpu.state = rule.newState;
    this.write(rule.newSymbol);
    this.moveHead(rule.direction);
  }

  public run(): string {
    while (this.cpu.state !== 'halt') {
      this.step();
    }
    return this.tape.join('');
  }
}
