document.addEventListener("DOMContentLoaded", function () {
  const numberButtons = document.querySelectorAll(".button");
  const inputBox = document.querySelector(".calculator-screen");
  const para = document.getElementById("para");

  let calculation = "";

  function evaluateExpression(expression) {
    try {
      const withExplicitMultiplication = expression.replace(/([\d.]+)([(])/g, "$1*$2");
      const withoutPercentage = withExplicitMultiplication.replace(/%/g, "/100");
      const withDivideSymbol = withoutPercentage.replace(/÷/g, "/");
      const withExponentiationSymbol = withDivideSymbol.replace(/\^/g, "**");
      return Function(`'use strict'; return (${withExponentiationSymbol})`)();
    } catch (error) {
      console.error("Error evaluating expression:", error);
      return null;
    }
  }

  function handleSignChange() {
    if (inputBox.value === "") {
      inputBox.value = "-";
      calculation += "-";
    } else if (inputBox.value === "-") {
      inputBox.value = "";
      calculation = calculation.slice(0, -1);
    } else {
      const currentValue = parseFloat(inputBox.value);
      const newValue = -currentValue;
      inputBox.value = newValue;
      calculation = newValue.toString();
    }
    para.innerText = calculation;
  }

  function handler() {
    const buttonText = this.innerText;

    if (buttonText === "AC") {
      inputBox.value = "";
      calculation = "";
      para.innerText = "";
    } else if (buttonText === "C") {
      inputBox.value = inputBox.value.slice(0, -1);
      calculation = calculation.slice(0, -1);
      para.innerText = calculation;
    } else if (buttonText === "=") {
      const result = evaluateExpression(calculation);
      inputBox.value = result !== null ? result : "";
      para.innerText = calculation + " = " + inputBox.value;
    } else if (buttonText === "%") {
      const percentage = evaluateExpression(calculation) / 100;
      inputBox.value = percentage;
      calculation = percentage.toString();
      para.innerText = calculation;
    } else if (buttonText === ".") {
      const parts = calculation.split(/[\+\-\*\/\%\^\(\)÷]/);
      const lastPart = parts[parts.length - 1];
      if (!lastPart.includes(".")) {
        inputBox.value += buttonText;
        calculation += buttonText;
        para.innerText = calculation;
      }
    } else if (buttonText === "√") {
      const sqrt = Math.sqrt(evaluateExpression(calculation));
      inputBox.value = sqrt;
      calculation = sqrt.toString();
      para.innerText = calculation;
    } else if (buttonText === "(" || buttonText === ")" || buttonText === "÷" || buttonText === "^") {
      inputBox.value += buttonText;
      calculation += buttonText;
      para.innerText = calculation;
    } else if (buttonText === "+/-") {
      handleSignChange();
    } else {
      inputBox.value += buttonText;
      calculation += buttonText;
      para.innerText = calculation;
    }
  }

  numberButtons.forEach(function (button) {
    button.addEventListener("click", handler);
  });

  document.addEventListener("keydown", function (event) {
    const buttonText = event.key;
    if (buttonText === "Enter") {
      const result = evaluateExpression(inputBox.value);
      inputBox.value = result !== null ? result : "";
      para.innerText = calculation + " = " + inputBox.value;
      calculation = result !== null ? result.toString() : "";
    }
    else if (
      !isNaN(buttonText) ||
      ["+", "-", "*", "/", ".", "%", "(", ")", "÷", "^"].includes(buttonText)
    ) {
      inputBox.value += buttonText;
      calculation += buttonText;
      para.innerText = calculation;
    }
  });
});
