import CalculatorController from './CalculatorController.js'

const calcInput = document.querySelector('#calc_input');
const btnsContainer = document.querySelector('.btns-container');
const tempResult = document.querySelector('.calc__info-tempResult');

const calculator = new CalculatorController(btnsContainer, calcInput, tempResult);
