//Get required elements
const expression = document.getElementById('expression');
const result = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

//Set up state variables
let currentInput = '';
let operator = '';
let firstValue = '';
let resultShown = false;

//Listen for button clicks
document.getElementById('input').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
 
  const value = btn.dataset.value;
  const action = btn.dataset.action;

  handleAction(action, value);
});

//The handleAction() function
function handleAction(action, value) {
  switch(action) {
    case 'number':  handleNumber(value); break;
    case 'addition':
    case 'substraction':
    case 'multiplication':
    case 'division': handleOperation(value); break;
    case 'equals': handleEquals(); break;
    case 'clear': handleClear(); break;
    case 'mod': handleMod(); break;
    case 'backspace': handleBackspace(); break;
    case 'negate': handleNegate(); break;
  }
}

//implement the handleNumber function
function handleNumber(value) {
  if (resultShown) {
    currentInput = ''; 
    resultShown = false; 
    expressionStr = '';
    expression.textContent = '';
  } 

  if (value === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && value !== '.') currentInput = ''; 

  currentInput+=value;
  result.textContent = currentInput;

  if(operator){
    result.textContent = `${firstValue}${operator}${currentInput}`;
  } else {
    result.textContent = currentInput;
  }
}

//implement the handleOperator function
function handleOperation(value) {
  if(currentInput === '' && firstValue === '') {return;}
  if(currentInput !== '' && firstValue !== '') {handleEquals();}

  firstValue = currentInput || result.textContent;
  operator = value;
  currentInput = '';
  result.textContent = `${firstValue}${operator}`;
  resultShown = false;
}

//implement the handleEquals function
function handleEquals() {

  if (operator === '' && currentInput.includes('%')){
    const calc = parseFloat(currentInput)/100;
    expression.textContent = `${currentInput}`;
    result.textContent = calc;
    currentInput = String(calc);
    resultShown = true;
    return;
  }

  if (firstValue === '' || operator === '' || currentInput === '') return;

  const a = parseFloat(firstValue);
  const isPercent = currentInput.includes('%')
  const b = isPercent ? parseFloat(currentInput) / 100 : parseFloat(currentInput);

  let calc;
  if (operator === '+') calc = a + b;
  if (operator === '-') calc = a - b;
  if (operator === '*') calc = a * b;
  if (operator === '/') calc = b !== 0 ? a/b : 'Error';
  

  expression.textContent = `${firstValue}${operator}${currentInput}`;
  result.textContent = calc;
  currentInput = String(calc);
  firstValue = '';
  operator = '';
  resultShown = true;
}

//implement the handleClear function
function handleClear(){
  currentInput = '';
  operator = '';
  firstValue = '';
  resultShown = false;
  expression.textContent = '';
  result.textContent = '0';
}

//implement the handleNegate function
function handleNegate() {
  if(!currentInput) return;
  currentInput = String(parseFloat(currentInput) * -1);
  result.textContent = currentInput;
}

//implement the handleMod function

function handleMod() {
  if(!currentInput || currentInput.includes('%')) return;
  currentInput += '%';

  if (operator) {
    result.textContent = `${firstValue}${operator}${currentInput}`;
  } else {
    result.textContent = currentInput;
  }
}






