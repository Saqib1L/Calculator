const inputBox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');

let expression = '';
let result = '';
let justEvaluated = false;

function buttonClick(event) {
  const target = event.target;
  const action = target.dataset.action;
  const value = target.dataset.value;

  switch (action) {
    case 'number': handleNumber(value); break;
    case 'clear': handleClear(); break;
    case 'backspace': handleBackspace(); break;
    case 'negate': handleNegate(); break;
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
      if (result === 'Error') break;
      if (justEvaluated && result !== '') {
        startFromResult(value);
      } else if (expression === '' && result !== '') {
        startFromResult(value);
      } else if (expression !== '' && !isLastCharOperator()) {
        expression += value;
      }
      break;
    case 'equals': handleEquals(); break;
    case 'mod':
      if (expression === '' || result === 'Error') break;
      if (justEvaluated && result !== '') {
        expression = result + '%';
        justEvaluated = false;
        break;
      }
      if (!isLastCharOperator() && expression.slice(-1) !== '%') expression += '%';
      break;
  }

  updateDisplay(expression, result);
}
inputBox.addEventListener('click', buttonClick);

function handleNumber(value) {
  if (justEvaluated) {
    expression = '';
    justEvaluated = false;
  }

  if (value === '.') {
    const parts = expression.split(/[+\-*/]/);
    const currentNumber = parts[parts.length - 1].replace('%', '');
    if (currentNumber.includes('.')) return;
    if (currentNumber === '') expression += '0'; // Bug 1 fix — auto-prepend 0
  }

  expression += value;
}

function handleClear() {
  expression = '';
  result = '';
  justEvaluated = false;
}

function handleBackspace() {
  if (justEvaluated) {
    expression = '';
    result = '';
    justEvaluated = false;
    return;
  }
  expression = expression.slice(0, -1);
}

function handleNegate() {
  if (justEvaluated) {
    if (result !== '' && result !== 'Error') {
      result = String(parseFloat(result) * -1);
    }
    return;
  }
  if (expression === '' || isLastCharOperator()) return;
  if (/%\d/.test(expression)) return;
  if (/[+\-*/]/.test(expression.slice(1))) {
    expression = expression.replace(/([+\-*/])(-?)(\d*\.?\d*%?)$/, (_, op, sign, num) =>
      op + (sign ? '' : '-') + num
    );
  } else {
    if (expression === '0') return;
    expression = expression.startsWith('-') ? expression.slice(1) : '-' + expression;
  }
}

function isLastCharOperator() {
  const last = expression.slice(-1);
  return last !== '.' && last !== '%' && isNaN(parseInt(last));
}

function startFromResult(value) {
  expression = result + value;
  justEvaluated = false;
}

function handleEquals() {
  if (expression === '') return;
  const last = expression.slice(-1);
  if (isLastCharOperator() && last !== '%') return;
  const prevExpression = expression;
  result = evaluateExpression();
  expression = prevExpression;
  justEvaluated = true;
}

function preprocessExpression(expr) {
  return expr.replace(/(\d+(?:\.\d+)?)%(?=[+\-*/]|$)/g, '($1/100)');
}

function evaluateExpression() {
  try {
    const processed = preprocessExpression(expression);
    const evalResult = eval(processed);
    return isNaN(evalResult) || !isFinite(evalResult)
      ? 'Error'
      : Math.abs(evalResult) < 1
      ? parseFloat(evalResult.toFixed(10))
      : parseFloat(evalResult.toFixed(2));
  } catch (e) {
    return 'Error';
  }
}

function updateDisplay(expression, result) {
  if (justEvaluated) {
    expressionDiv.textContent = result;
    resultDiv.textContent = expression;
  } else {
    expressionDiv.textContent = expression;
    resultDiv.textContent = '';
  }
}