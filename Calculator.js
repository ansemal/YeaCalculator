export default class Calculator  {

  static CALC_SYMBOLS = ['+', '-', '/', '*'];

  constructor(btnsContainer, calcInput, tempResult) {
    this.setInitial();
    this.btnsContainer = btnsContainer;
    this.btnsContainer.addEventListener('click', (event) => this.btnClick(event));
    this.calcInput = calcInput;
    this.calcInput.addEventListener('keydown', (event) => this.keyDown(event));
    this.tempResult = tempResult;
    this.tempResult.classList.add('error-message')
  }

  setInitial() {
    this.state = {result: [], intermediate: [], current: '', history: [] };
  }

  get prevResult() {
    return (this.state.result?.at(-1))?.at(-1) || this.state.intermediate.at(0) || 0;
  }
  get prevIntermediateResult() {
    return this.state.intermediate.at(-1) || (this.state.result?.at(-1))?.at(-1) || 0;
  }

  checkFillCalcInput(currentSymbol) {
    const lastSymbol = this.state.current.slice(-1);
    let typeError;
    if (/[\d.]/.test(currentSymbol)) {
      if (currentSymbol === '.' && lastSymbol === '.') {
        return false;
      } else if (/[\d.]/.test(lastSymbol)) {
        this.state.current += currentSymbol
      } else if (!this.checkDevideByZero()) {
        this.state.history.push({ type: 2, value: this.state.current });
        this.state.current = currentSymbol;
      }
      this.calcIntermediateResult();
      return true;
    } else if (lastSymbol && Calculator.CALC_SYMBOLS.includes(currentSymbol) && !Calculator.CALC_SYMBOLS.includes(lastSymbol)) {
      typeError = this.checkDevideByZero();
      if (!typeError) {
        this.state.history.push({ type: 1, value: this.state.current });
        this.state.result.push( this.state.intermediate );
        this.state.intermediate = [];
        this.state.current = currentSymbol;
        return true;
      }
    }

    this.showErrorMessage(typeError);
    return false
  }

  checkDevideByZero() {
    const devideByZero = +this.state.current === 0 && this.state.history.at(-1)?.value === '/';
    return devideByZero ? 'devideByZero' : null;
  }

  btnClick(event) {
    if (event.target.tagName === 'BUTTON') {
      const btnValue = event.target.value;
      this.handlerClickOrInput(btnValue);
    }
  }
  
  keyDown(event) {
    event.preventDefault();
    this.handlerClickOrInput(event.key)
  }

  handlerClickOrInput(value) {
    if (value === '.' && (this.state.current?.includes('.') || Calculator.CALC_SYMBOLS.includes(this.state.current))) return;

    switch (value) {
      case 'Backspace': this.handlerBackspace(); break;
      case 'Clear': this.handlerClear(); break;
      case 'Enter': this.handlerTotal(); break;
      case 'Shift': break;
      default: this.checkFillCalcInput(value) && this.handlerOther(value);
    }
  }

  handlerBackspace() {
    if (!this.state.current?.length) return;
    this.calcInput.value = this.calcInput.value.slice(0, -1);
    this.state.current = this.state.current.slice(0, -1);
    if (!this.state.current?.length && this.state.history.length) {
      let prev = this.state.history.pop();
      this.state.current = prev.value;
      if (prev.type === 1 && this.state.result.length) {
        this.state.intermediate = this.state.result.pop();
      }
    } else {
      this.state.intermediate.pop();
    }
    this.showHistory()
  }

  handlerClear() {
    this.calcInput.value = '';
    this.tempResult.textContent = '';
    this.setInitial();
  }

  handlerTotal() {
    const devideByZero = this.checkDevideByZero();
    if (!devideByZero) {
      const result = this.prevIntermediateResult;
      this.calcInput.value = result;
      this.setInitial();
      this.state.intermediate = [result];
      this.state.current = result.toString();
    } else {
      this.showErrorMessage(devideByZero);
    }
  }

  handlerOther(btnValue) {
    this.calcInput.value += btnValue;
    if (this.state.current ) {
      this.showHistory()
    }
  }

  calcIntermediateResult() {
      let resNow;
      if (this.state.history.length && Calculator.CALC_SYMBOLS.includes(this.state.history.at(-1)?.value)) {
        switch (this.state.history.at(-1).value) {
          case '+' : resNow = +this.prevResult + +this.state.current; break;
          case '-' : resNow = this.prevResult - this.state.current; break;
          case '*' : resNow = this.prevResult * this.state.current; break;
          case '/' : resNow = this.prevResult / this.state.current; break;      
        }
      } else {
        resNow = +this.state.current;
      }
      this.state.intermediate.push(+resNow.toFixed(10));
  }

  showHistory() {
    const needShowIntermediate = this.state.history.length>1 && !Calculator.CALC_SYMBOLS.includes(this.state.current);
    this.tempResult.textContent = `${this.calcInput.value} ${needShowIntermediate ? '= '+this.prevIntermediateResult : ''}`;
  }

  showErrorMessage(typeError = 'nothing') {
    this.tempResult.classList.add('error-message-active', typeError);
    setTimeout(() => this.tempResult.classList.remove('error-message-active', typeError), 1000);
  }
}