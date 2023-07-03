const screenDisplay = document.querySelector(".result");
const screenStore = document.querySelector(".history");

let firstNumber = "";
let operator = "";
let secondNumber = "";

let firstNumberChosen = false;
let operatorChosen = false;
let equated = false;

let firstDot = false;
let secondDot = false;

function display(text) {
    screenDisplay.textContent = text;
}

function store(text) {
    screenStore.textContent = text;
}

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", buttonClicked));

function buttonClicked() {
    if (this.className === "number") {
        if (equated && !operatorChosen) reset();

        if (!firstNumberChosen) {
            firstNumber += this.textContent;
            display(firstNumber);
        }

        if (operatorChosen) {
            secondNumber += this.textContent;
            display(secondNumber);
        }
    }

    if (this.className === "operator") {
        if (firstNumber !== "") {
            if (secondNumber !== "") equate();
            if (!(this.textContent === "\u2212" && (operator === "\u00D7" || operator === "\u00F7")))
                operator = this.textContent;
            firstNumberChosen = true;
            operatorChosen = true;
            store(`${firstNumber} ${operator}`);
        }
        if (this.textContent === "\u2212")
        {
            if (firstNumber === "") {firstNumber = "-"; display(firstNumber);}
            if (operatorChosen && (operator === "\u00D7" || operator === "\u00F7") && secondNumber === "") {
                secondNumber = "-";
                display(secondNumber);
            }
        }
    }

    if (this.className === "equals") {
        store(`${firstNumber} ${operator} ${secondNumber}`);
        equate();
    }

    if (this.className === "control") {
        if (this.textContent === "CLEAR") {
            reset();
            display("");
            store("");
        }
        if (this.textContent === "DEL") {
            if (equated && !operatorChosen) reset();

            if (firstNumberChosen && secondNumber === "") {
                operator = "";
                operatorChosen = false;
                firstNumberChosen = false;
                store(firstNumber);
            }

            else if (!operatorChosen) {
                if (firstNumber.endsWith(".")) firstDot = false;
                firstNumber = firstNumber.slice(0, -1);
                if (firstNumber === "0") firstNumber = "";
                display(firstNumber);
            }

            else if (operatorChosen && secondNumber !== "") {
                if (secondNumber.endsWith(".")) secondDot = false;
                secondNumber = secondNumber.slice(0, -1);
                if (secondNumber === "0") secondNumber = "";
                display(secondNumber);
            }
        }
    }

    if (this.className === "dot") {
        if (equated && !operatorChosen) reset();

        if (!operatorChosen && !firstDot) {
            if (firstNumber === "" || firstNumber === "-") firstNumber += "0.";
            else firstNumber += ".";
            firstDot = true;
            display(firstNumber);
        }
        if (operatorChosen && !secondDot) {
            if (secondNumber === "" || secondNumber === "-") secondNumber += "0.";
            else secondNumber += ".";
            secondDot = true;
            display(secondNumber);
        }
    }
}

function equate() {
    let result = operate(+firstNumber, +secondNumber, operator);
    equated = true;
    if (!result) return;
    firstNumber = String(result);
    display(firstNumber);
    firstDot = firstNumber.includes(".");
}

function operate(a, b, op) {
    if (isNaN(a) || isNaN(b)) return null;
    let result;
    if (op === "\u002B") result = a+b;
    if (op === "\u2212") result = a-b;
    if (op === "\u00D7") result = a*b;
    if (op === "\u00F7") {
        result = a/b;
        if (b === 0) return "Math sin detected";
    }

    if (result) {
        reset();
        return Math.round(result*100)/100;
    } else return null;
}

function reset() {
    firstNumber = "";
    operator = "";
    secondNumber = "";

    firstNumberChosen = false;
    operatorChosen = false;
    equated = false;

    firstDot = false;
    secondDot = false;

    display("");
    store("");
}