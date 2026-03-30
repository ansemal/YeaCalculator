import Calculator from "./Calculator.js";

const calcInput = document.querySelector('#calc_input');
const btnsContainer = document.querySelector('.btns-container');
const tempResult = document.querySelector('.calc__info-tempResult');
const myCalculator = new Calculator(btnsContainer, calcInput, tempResult);