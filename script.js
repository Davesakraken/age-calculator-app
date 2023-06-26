function periodConstructor(i, labels, inputs, paragraphs) {
  return {
    label: labels[i],
    input: inputs[i],
    value: +inputs[i].value,
    errorMessage: paragraphs[i],
    errorAdd(statement) {
      this.input.classList.add("error-border");
      this.label.classList.add("error-text");
      this.errorMessage.innerText = statement;
    },
    errorRemove() {
      this.input.classList.remove("error-border");
      this.label.classList.remove("error-text");
      this.errorMessage.innerText = "";
    },
  };
}

function initializeBirthCalc() {
  const formLabels = document.querySelectorAll("form label");
  const formInputs = document.querySelectorAll("form input");
  const formParagraphs = document.querySelectorAll("form p");

  const labels = Array.from(formLabels);
  const inputs = Array.from(formInputs);
  const paragraphs = Array.from(formParagraphs);

  const day = periodConstructor(0, labels, inputs, paragraphs);
  const month = periodConstructor(1, labels, inputs, paragraphs);
  const year = periodConstructor(2, labels, inputs, paragraphs);

  return {
    day,
    month,
    year,
  };
}

const button = document.querySelector(".submit-button");

document.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    return arrValuesToDate();
  }
});
button.addEventListener("click", () => {
  return arrValuesToDate();
});

const errorStatements = {
  fieldRequired: "This field is required",
  invalidDay: "Must be a valid day",
  invalidMonth: "Must be a valid month",
  invalidYear: "Must be a valid year",
  dateInFuture: "Must be in the past",
  invalidDate: "Must be a valid Date",
};

function leapYearCalculator(year) {
  if (year % 4 === 0 && year % 100 !== 0) {
    return true;
  } else if (year % 100 === 0 && year % 400 === 0) {
    return true;
  }

  return false;
}

function validateDay(day, month, year) {
  const monthsWith30Days = [4, 6, 9, 11];
  const leapYearCheck = leapYearCalculator(year.value);

  if (!day.value) {
    day.errorAdd(errorStatements.fieldRequired);
  } else if (day.value < 1 || day.value > 31) {
    day.errorAdd(errorStatements.invalidDay);
  } else if (monthsWith30Days.includes(month.value) && day.value >= 31) {
    day.errorAdd(errorStatements.invalidDate);
  }
  //leap year check
  else if (leapYearCheck && month.value === 2 && day.value > 29) {
    day.errorAdd(errorStatements.invalidDay);
  } else if (!leapYearCheck && month.value === 2 && day.value > 28) {
    day.errorAdd(errorStatements.invalidDay);
  } else {
    day.errorRemove();
    day.errorMessage.innerText = "";
    return day.value;
  }
}

function validateMonth(month) {
  if (!month.value) {
    month.errorAdd(errorStatements.fieldRequired);
  } else if (month.value < 1 || month.value > 12) {
    month.errorAdd(errorStatements.invalidMonth);
  } else {
    month.errorRemove();
    return month.value;
  }
}

function validateYear(year) {
  if (!year.value) {
    year.errorAdd(errorStatements.fieldRequired);
  } else if (year.value < 100) {
    year.errorAdd(errorStatements.invalidYear);
  } else {
    year.errorRemove();
    return year.value;
  }
}

function validateDate(day, month, year) {
  const birthDate = new Date(`${year.value}-${month.value}-${day.value}`);
  let newDateObj = new Date();

  if (newDateObj - birthDate < 0) {
    console.log(newDateObj - birthDate);
    year.errorAdd(errorStatements.dateInFuture);
    return;
  }

  const validDay = validateDay(day, month, year);
  const validMonth = validateMonth(month);
  const validYear = validateYear(year);
  if (!validDay || !validMonth || !validYear) {
    return false;
  }
  return true;
}

function arrValuesToDate() {
  const { day, month, year } = initializeBirthCalc();

  if (!validateDate(day, month, year)) return;

  const birthDate = new Date(`${year.value}-${month.value}-${day.value}`);
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
