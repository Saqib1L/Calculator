//Get required elements
const expression = document.getElementById('expression');
const result = document.getElementById('result');

//Set up state variables
let currentInput = '';
let operator = '';
let firstValue = '';
let resultShown = false;
let isPercent = false;

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
    case 'subtraction':
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
  if (isPercent) { isPercent = false; } // reset percent flag whenever a digit is typed

  if (resultShown) {
    currentInput = ''; 
    resultShown = false; 
    expression.textContent = '';
  } 

  if (value === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && value !== '.') currentInput = ''; 

  currentInput += value;

  result.textContent = operator
    ? `${firstValue}${operator}${currentInput}`
    : currentInput;
}

//implement the handleOperator function
function handleOperation(value) {
  if (currentInput === '' && firstValue === '') return;

  // operator switch — user changed their mind before typing second number
  if (currentInput === '' && firstValue !== '') {
    if (operator === '%') {
      // was in remainder mode, convert firstValue to its percentage
      firstValue = String(parseFloat(firstValue) / 100);
    }
    operator = value;
    result.textContent = `${firstValue}${operator}`;
    return;
  }

  // chain — both values exist, compute first then continue
  if (currentInput !== '' && firstValue !== '') { handleEquals(); }

  firstValue = currentInput || result.textContent;
  operator = value;
  currentInput = '';
  result.textContent = `${firstValue}${operator}`;
  resultShown = false;
}

// handle negative values
function normalise(value) {
  if (value.startsWith('(-') && value.endsWith(')')) {
    return '-' + value.slice(2, -1);
  }
  return value;
}

//implement the handleEquals function
function handleEquals() {
  if (firstValue === '' || operator === '' || currentInput === '') return;

  const a = parseFloat(normalise(firstValue));
  let b = parseFloat(normalise(currentInput));
  const wasPercent = isPercent;
  if (wasPercent) { b = (a * b) / 100; }
  isPercent = false;

  let calc;

  if (operator === '/' && b === 0) {
    expression.textContent = `${firstValue}${operator}${currentInput}`;
    result.textContent = 'Error';
    currentInput = '';
    firstValue = '';
    operator = '';
    resultShown = true;
    return;
  }

  if (operator === '+') calc = a + b;
  if (operator === '-') calc = a - b;
  if (operator === '*') calc = a * b;
  if (operator === '/') calc = a / b;
  if (operator === '%') calc = a % b;

  const cleaned = parseFloat(parseFloat(calc).toPrecision(10));
  
  expression.textContent = `${firstValue}${operator}${currentInput}${wasPercent ? '%' : ''}`;
  result.textContent = cleaned;
  currentInput = String(cleaned);
  firstValue = '';
  operator = '';
  resultShown = true;
}

//implement the handleClear function
function handleClear() {
  currentInput = '';
  operator = '';
  firstValue = '';
  resultShown = false;
  isPercent = false;
  expression.textContent = '';
  result.textContent = '0';
}

//implement the handleNegate function
function handleNegate() {
  if (!currentInput) return;

  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }

  resultShown = false;
  result.textContent = operator
    ? `${firstValue}${operator}${currentInput}`
    : currentInput;
}

//implement the handleMod function
function handleMod() {
  if (!currentInput) return;
  
  if (operator !== '') {
    // percentage mode: lazy, resolve on =
    isPercent = true;
    result.textContent = `${firstValue}${operator}${currentInput}%`;
  } else {
    // remainder mode: % becomes the operator
    firstValue = currentInput;
    operator = '%';
    currentInput = '';
    result.textContent = `${firstValue}${operator}`;
  }
}

//implement the handleBackspace function
function handleBackspace() {
  if (currentInput === '') return;

  if (currentInput.startsWith('(-') && currentInput.endsWith(')')) {
    const inner = currentInput.slice(2, -1).slice(0, -1);
    currentInput = inner ? `(-${inner})` : '';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  if (currentInput === '-' || currentInput === '(-') {
    currentInput = '';
  }

  if (isPercent) { isPercent = false; }

  result.textContent = operator
    ? `${firstValue}${operator}${currentInput}` || '0'
    : currentInput || '0';
}