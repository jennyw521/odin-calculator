const resultText = document.querySelector(".result-container");
const workingText = document.querySelector(".working-container");
const buttons = document.querySelectorAll("button");
const clearAllBtn = document.querySelector("#ac");
const backSpaceBtn = document.querySelector("#c");
const dotBtn = document.querySelector("#dot");
let operator = "";
let num1 = [];
let num2 = [];
let working = [];
let result = null;

workingText.textContent = "0";

function add(a, b) {
    return result =  Number((parseFloat(a) + parseFloat(b)).toFixed(8));
};

function subtract(a, b) {
    return result = Number((parseFloat(a) - parseFloat(b)).toFixed(8));
};

function multiply(a, b) {
    return result = Number((parseFloat(a) * parseFloat(b)).toFixed(8));
};

function divide(a, b) {
    if (b == 0) {
        return result = "Not a number";
    } else {
        return result = Number((parseFloat(a) / parseFloat(b)).toFixed(8));
    }
};

function operate(operator, num1, num2) {
    num1 = num1.join("");
    num2 = num2.join("");
    switch(operator) {
        case "+":
            add(num1, num2);
            break;
        case "-":
            subtract(num1, num2);
            break;
        case "*":
            multiply(num1, num2);
            break;
        case "/":
            divide(num1, num2);
            break;
    }
};

function handleNumber(button) {
    const newInput = button.textContent || button.key;
    // remove unnecessary "0" from input 
    if (working[0] === "0" && working.length == 1 && newInput != ".") {
        working[0] = newInput;
    } else {
        working.push(newInput);
    }

    // handle number input after pressing equal sign
    if (resultText.textContent !== "") {
        num1 = [];
        result = null;
        resultText.textContent = "";
        workingText.textContent = working.join("");
    } else if (num1.length > 0) {
        workingText.textContent = num1.join("") + operator + working.join("");
    } else {
        workingText.textContent = working.join("");
        resultText.textContent = "";
    }
};

function handleOperator(button) {
    resultText.textContent = "";
    // store first number 
    if (num1.length == 0) {
        num1 = working.slice();
    // calculate only a pair of numbers at a time
    } else if (num1.length > 0 && working.length > 0) {
        num2 = working.slice();
        operate(operator, num1, num2);
        num1 = [result];
        num2 = [];
        result = null;
    }
    working = [];
    dotBtn.disabled = false;
    operator = button.textContent || button.key;
    workingText.textContent = num1.join("") + operator;
};

function handleEqualSign() {
    if (num1.length > 0 && working.length > 0) {
        num2 = working.slice();
        operate(operator, num1, num2);
        resultText.textContent = result;
        if (isNaN(result)) {
            num1 = [];
        } else {
            num1 = [result];
        }
        operator = [];
        num2 = [];
        working = [];
        result = null;
        dotBtn.disabled = false;
    }
};

// prevent more than one decimal point in a number
function handleDot() {
    if (working.includes(".")) {
        dotBtn.setAttribute("disabled", "true");
    // handle dot input after pressing equal sign
    } else {
        if (resultText.textContent !== "") {
            num1 = [];
            result = null;
            resultText.textContent = "";
            workingText.textContent = ".";
        } else if (working.length == 0 && num1.length == 0) {
            workingText.textContent = ".";
        } else {
            workingText.textContent += ".";
        }
        working.push(".");
    };
};

// handle positive/negative sign in the working number and result 
function handleSign() {
    if (resultText.textContent !== "") {
        num1 = [Number(num1) * -1]; 
        resultText.textContent = num1.join("");
    } else {
        if (working[0] !== "-" && working.length > 0) {
            working.unshift("-");
        } else if (working[0] === "-") {
            working.shift();
        } 
    
        if (num1.length > 0) {
            workingText.textContent = num1.join("") + operator + working.join("")
        } else {
            workingText.textContent = working.join("") | "0";
        }
    }
}

function updateDisplay(button) {
    if (button.className === "number") {
        handleNumber(button);
    } else if (button.className === "operator") {
        handleOperator(button);
    } else if (button.id === "equal") {
        handleEqualSign();
    } else if (button.id === "dot") {
        handleDot();
    } else if (button.id === "sign") {
        handleSign();
    }
};

function clearAll() {
    operator = "";
    num1 = [];
    num2 = [];
    working = [];
    result = null;
    workingText.textContent = "0";
    resultText.textContent = "";
    dotBtn.disabled = false;
}

function clear() {
    working.pop();
    if (num1.length == 0) {
        workingText.textContent = working.join("");
    } else if (resultText.textContent !== "") {
        clearAll();
    } else {
        workingText.textContent = num1.join("") + operator + working.join("");
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        updateDisplay(button)});
    });


clearAllBtn.addEventListener("click", clearAll);
backSpaceBtn.addEventListener("click", clear);
document.addEventListener("keydown", (e) => {
    let button = e;
    switch(e.key) {
        case "Backspace":
            clear();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            handleOperator(button);
            break;
        case ".":
            handleDot();
            break;
        case "=":
        case "Enter":
            handleEqualSign();
            break;
    }
    if (!isNaN(e.key)) {
        handleNumber(button);
    };
})
