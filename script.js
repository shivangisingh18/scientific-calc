let expression = "";
let isDegree = true;

const expressionBox = document.getElementById("expression");
const resultBox = document.getElementById("result");
const modeBtn = document.getElementById("modeBtn");

// Add values to display
function append(value) {
    expression += value;
    expressionBox.textContent = expression;
}

// Clear everything
function clearDisplay() {
    expression = "";
    expressionBox.textContent = "0";
    resultBox.textContent = "0";
}

// Delete last character
function deleteLast() {
    expression = expression.slice(0, -1);
    expressionBox.textContent = expression || "0";
}

// Switch between DEG and RAD
function toggleMode() {
    isDegree = !isDegree;
    modeBtn.textContent = isDegree ? "DEG" : "RAD";
}

// Factorial calculation
function factorial(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) {
        throw new Error("Invalid factorial");
    }

    let answer = 1;

    for (let i = 2; i <= n; i++) {
        answer *= i;
    }

    return answer;
}

// Scientific calculation
function calculate() {
    try {
        if (!expression.trim()) return;

        let exp = expression;

        // Convert factorial
        exp = exp.replace(
            /(\d+(?:\.\d+)?)!/g,
            "factorial($1)"
        );

        // Allow only calculator characters
        if (!/^[0-9+\-*/().%!a-zA-Z\s]+$/.test(exp)) {
            throw new Error("Invalid input");
        }

        // Trigonometric functions
        const sin = x => Math.sin(
            isDegree ? x * Math.PI / 180 : x
        );

        const cos = x => Math.cos(
            isDegree ? x * Math.PI / 180 : x
        );

        const tan = x => Math.tan(
            isDegree ? x * Math.PI / 180 : x
        );

        // Calculate expression
        const answer = new Function(
            "sin", "cos", "tan",
            "sqrt", "log", "ln",
            "pi", "e", "factorial",
            `"use strict"; return (${exp});`
        )(
            sin,
            cos,
            tan,
            Math.sqrt,
            Math.log10,
            Math.log,
            Math.PI,
            Math.E,
            factorial
        );

        if (
            typeof answer !== "number" ||
            !Number.isFinite(answer)
        ) {
            throw new Error("Math error");
        }

        resultBox.textContent =
            Number(answer.toPrecision(12)).toString();

    } catch (error) {
        resultBox.textContent = "Error";
    }
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    if (/^[0-9+\-*/().%! ]$/.test(event.key)) {
        append(event.key);
    }

    else if (event.key === "Enter") {
        calculate();
    }

    else if (event.key === "Backspace") {
        deleteLast();
    }

    else if (event.key === "Escape") {
        clearDisplay();
    }
});