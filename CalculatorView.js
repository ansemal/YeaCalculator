export default class CalculatorView {
 constructor(calcInput, tempResult) {
    this.calcInput = calcInput;
    this.tempResult = tempResult;
    this.tempResult.classList.add('error-message');
  }

  updateDisplay(history, currentResult = '') {
    // this.tempResult.textContent = `${history}${currentResult ? ' = '+currentResult : ''}`
    this.tempResult.textContent = `${history} = ${currentResult}`
    this.calcInput.value = history;
  }

  showErrorMessage(typeError = 'nothing') {
    this.tempResult.classList.add('error-message-active', typeError);
    setTimeout(() => this.tempResult.classList.remove('error-message-active', typeError), 1000);
  }

  clear() {
    this.calcInput.value = '';
    this.tempResult.textContent = '';
  }
}