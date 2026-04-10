export default class CalculatorModel {
  static CALC_SYMBOLS = ['+', '-', '/', '*'];

  TYPE_INIT = 0;
  TYPE_NUMBER = 1;
  TYPE_OPERATION = 2;

  constructor(view) {
    this.view = view;
    this.setInitial();
  }

  setInitial() {
    this.current = { type: this.TYPE_INIT, value: '' };
    this.historyString = '';
    this.historyArr = [];
    this.intermediate = [];
    this.prevResults = [];
  }

  get prevResult() {
    return this.prevResults?.at(-1) || 0;
  }

  get previous() {
    return this.historyArr.at(-1);
  }

  get lastIntermediate() {
    return this.intermediate.at(-1) ?? '';
  }

  get lastSymbol() {
    return this.current.value.slice(-1);
  }

  check = {
    isDoubleDot: value => value === '.' && this.current.value.includes('.'),
    isStartDoubleZero: value => this.current?.value === '0' && value === '0',
    isNumberOrDot: value => /[\d.]/.test(value),
    isTypeNumber: () => this.current?.type === this.TYPE_NUMBER,
    isDevideByZero: () => {
      const devByZero = +this.current.value === 0 && this.previous?.value === '/';
      devByZero && this.view.showErrorMessage('devideByZero');
      return devByZero;
    },
    isValidOperator: currentSymbol => {
      const hasLastSymbol = this.lastSymbol && this.lastSymbol !== '.';
      const isNotDoubleOperator = CalculatorModel.CALC_SYMBOLS.includes(currentSymbol) && !CalculatorModel.CALC_SYMBOLS.includes(this.lastSymbol)
      return  hasLastSymbol && isNotDoubleOperator;
    },
    hasHistory: () => this.historyString?.length,
  };

  shiftToNextType(typeValue, currentSymbol) {
    this.historyArr.push({type: this.current.type, value: this.current.value});
    this.current = {type: typeValue, value: currentSymbol};
  }

  handleNumberOrDot(currentSymbol) {
    if (this.check.isStartDoubleZero(currentSymbol)) return;
    if (this.check.isNumberOrDot(this.lastSymbol)) {
      this.current.value += currentSymbol;
    } else {
      this.startNewNumber(currentSymbol);
    }
    this.historyString += currentSymbol;
    currentSymbol !== '.' && this.calcIntermediateResult();
    this.view.updateDisplay(this.historyString, this.lastIntermediate)
  }

  startNewNumber(currentSymbol) {
    if (this.check.hasHistory()) {
      this.shiftToNextType(this.TYPE_NUMBER, currentSymbol);
      this.intermediate.length && this.prevResults.push(this.lastIntermediate);
    } else {
      this.current = {type: this.TYPE_NUMBER, value: currentSymbol};
    }
  }

  handleOperation(currentSymbol) {
    if (!this.check.isDevideByZero()) {
      this.shiftToNextType(this.TYPE_OPERATION, currentSymbol)
      this.historyString += currentSymbol;
      this.view.updateDisplay(this.historyString)
    }
  }

  handleBackspace() {
    let intermResult = '';
    this.historyString = this.historyString.slice(0, -1);
    this.current.value = this.current.value.slice(0, -1);

    if (this.current.value === '') {
      this.check.isTypeNumber() && this.intermediate.pop();
      this.current = {...this.historyArr.pop()};
      if (this.check.isTypeNumber()) {
        intermResult = this.lastIntermediate
        this.prevResults.pop();
      }
      !this.current && this.setInitial();
    } else {
      this.lastSymbol !== '.' && this.intermediate.pop()
      intermResult = this.lastIntermediate
    }
    this.view.updateDisplay(this.historyString, intermResult);
  }

  calcIntermediateResult() {
    let resultNow;
    if (this.previous?.type === this.TYPE_OPERATION) {
      switch (this.previous.value) {
        case '+': resultNow = +this.prevResult + +this.current.value; break;
        case '-': resultNow = this.prevResult - this.current.value; break;
        case '*': resultNow = this.prevResult * this.current.value; break;
        case '/': resultNow = this.prevResult / this.current.value; break;
      }
    } else {
      resultNow = +this.current.value;
    }
    this.intermediate.push(+resultNow.toFixed(10));
  }
}
