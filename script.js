function initializeBirthCalc() {
  const formLabels = document.querySelectorAll("form label");
  const formInputs = document.querySelectorAll("form input");
  const formParagraphs = document.querySelectorAll("form p");
  const button = document.querySelector(".submit-button");

  const labelsArr = Array.from(formLabels);
  const inputArr = Array.from(formInputs);
  const paragraphArr = Array.from(formParagraphs);

  return {
    button,
    labelsArr,
    inputArr,
    paragraphArr,
  };
}

const birthCalc = initializeBirthCalc();

document.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    return arrValuesToDate(+birthCalc.inputArr[0].value, +birthCalc.inputArr[1].value, +birthCalc.inputArr[2].value);
  }
});
birthCalc.button.addEventListener("click", () => {
  return arrValuesToDate(+birthCalc.inputArr[0].value, +birthCalc.inputArr[1].value, +birthCalc.inputArr[2].value);
});

const months30Days = [4, 6, 9, 11];

function errorAdd(i, statement) {
  const errorStatements = [
    "This field is required",
    "Must be a valid day",
    "Must be a valid month",
    "Must be in the past",
    "Must be a valid Date",
  ];

  birthCalc.labelsArr[i].classList.add("error-text");
  birthCalc.inputArr[i].classList.add("error-border");
  birthCalc.paragraphArr[i].innerText = errorStatements[statement];
}

function errorRemove(i) {
  birthCalc.labelsArr[i].classList.remove("error-text");
  birthCalc.inputArr[i].classList.remove("error-border");
  birthCalc.paragraphArr[i].innerText = "";
}

function validateDay(day, month) {
  if (!day) {
    errorAdd(0, 0);
  } else if (day < 1 || day > 31) {
    errorAdd(0, 1);
  } else if (months30Days.includes(month) && day > 30) {
    errorAdd(0, 4);
  } else if (month === 9 && day > 28) {
    errorAdd(0, 4);
  } else {
    errorRemove(0);
    birthCalc.paragraphArr[0].innerText = "";
    return day;
  }
}

function validateMonth(month) {
  if (!month) {
    errorAdd(1, 0);
  } else if (month < 1 || month > 12) {
    errorAdd(1, 2);
  } else {
    errorRemove(1);
    return month;
  }
}

function validateYear(year) {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  if (!year) {
    errorAdd(2, 0);
  } else if (year > currentYear) {
    errorAdd(2, 3);
  } else {
    errorRemove(2);
    return year;
  }
}

function validateDate(day, month, year) {
  const validDay = validateDay(day, month);
  const validMonth = validateMonth(month);
  const validYear = validateYear(year);
  if (!validDay || !validMonth || !validYear) {
    return false;
  } else {
  }
  return true;
}

function arrValuesToDate(day, month, year) {
  if (!validateDate(day, month, year)) {
    return;
  }

  const birthDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  const milliseconds = currentDate - birthDate;

  const days = milliseconds / 86400000;
  const months = days / 30.4368;
  const years = Math.floor(months / 12);

  const remainingMonths = Math.floor(months % 12);
  const remainingDays = Math.floor(days % 30.4368);

  const results = document.querySelectorAll(".result span");

  const resultSpan = Array.from(results);

  resultSpan[0].innerText = years;
  resultSpan[1].innerText = remainingMonths;
  resultSpan[2].innerText = remainingDays;
}