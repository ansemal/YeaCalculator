import CalculatorModel from "./CalculatorModel.js";
import CalculatorView from "./CalculatorView.js";

export default class CalculatorController {
  constructor(btnsContainer, calcInput, tempResult) {
    this.view = new CalculatorView(calcInput, tempResult);
    this.model = new CalculatorModel(this.view);
    this.btnsContainer = btnsContainer;
    this.btnsContainer.addEventListener('click', (e) => this.btnsContainerClick(e));
    calcInput.addEventListener('keydown', (e) => this.keyDown(e));
  }

  btnsContainerClick(event) {
    const button = event.target.closest('.btn');
    button && this.handleInput(event.target.value);
  }

  keyDown(event) {
    event.preventDefault();
    this.handleInput(event.key);
  }

  handleInput(value) {
    switch (value) {
      case 'Backspace': this.model.check.hasHistory() && this.model.handleBackspace(); break;
      case 'Clear': this.handleClear(); break;
      case 'Enter': this.handleTotal(); break;
      default: this.handleOther(value); break;
    }
  }

  handleClear() {
    this.model.setInitial();
    this.view.clear();
  }

  handleTotal() {
    if (!this.model.check.isDevideByZero()) {
      const result = this.model.lastIntermediate;
      this.view.calcInput.value = result;
      this.model.setInitial();
      this.model.intermediate = [result];
      this.model.current = {type: this.model.TYPE_NUMBER, value: result.toString()};
      this.model.historyString = result.toString();
      this.view.updateDisplay(result);
    }
  }

  handleOther(currentSymbol) {
    if (this.model.check.isDoubleDot(currentSymbol)) return false;
    if (this.model.check.isNumberOrDot(currentSymbol)) {
      this.model.handleNumberOrDot(currentSymbol);
    } else if (this.model.check.isValidOperator(currentSymbol)) {
      this.model.handleOperation(currentSymbol)
    }
  }
}