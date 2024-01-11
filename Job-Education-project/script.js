"use strict";

/*  id = (Date.now() + '').slice(-10); genera id */

const admin = document.getElementById("adminName");
const password = document.getElementById("adminPassword");
const loginBtn = document.getElementById("btn-login");
const adsBox = document.getElementsByClassName("ads-box");
const selectOption = document.getElementById("offer");
const selectVal = document.getElementById("sel");
const bulletin = document.getElementsByClassName("bulletin")[0];
/*form items selected*/
const offertType = document.getElementById("offert-type"); //job or education
const specific = document.getElementById("specific"); // ral or hour text
const ralEuro = document.getElementById("ral"); // placeholder
const submitBtn = document.getElementsByClassName("submit-btn")[0];

//input values
let offerTitle = document.getElementById("job-title");
let offerLocation = document.getElementById("job-location");
let offerDescription = document.getElementById("description-job");

//close button
let closeButtons = document.getElementsByClassName("exit-btn");

class Offert {
  constructor(type, location, description, id) {
    this.type = type;
    this.location = location;
    this.description = description;
    this.id = id;
  }
}

class Job extends Offert {
  constructor(type, location, description, id, ral) {
    super(type, location, description, id);
    this.ral = ral;
  }
}

class Education extends Offert {
  constructor(type, location, description, id, hours) {
    super(type, location, description, id);
    this.hours = hours;
  }
}

//Show form when login
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("funziona");
  if (admin.value === "admin01" && password.value == "1111") {
    adsBox[0].classList.toggle("hidden"); //shows form
    showRemoveBtn(); //show remouve btn

    if (adsBox[0].classList.contains("hidden")) {
      loginBtn.innerHTML = "Log in";
      //change button login/logout
      admin.value = "";
      password.value = "";
      hideRemoveBtn();
    } else {
      loginBtn.innerHTML = "LogOut";
    }
  } else alert("Admin is: admin01\n Password is: 1111 ");
});
/*********CHANGING IF ITS JOB OR EDUCATION***********/
let chosed = "select"; //indica che cosa ho scelto
selectOption.addEventListener("change", function (e) {
  console.log(e.target.value);

  if (e.target.value === "education") {
    chosed = "education";
    offertType.innerHTML = "Course name: ";
    specific.innerHTML = "Duration: ";
    ralEuro.placeholder = "duration in hours";
  } else {
    chosed = "job";
    offertType.innerHTML = "Job: ";
    specific.innerHTML = "RAL: ";
    ralEuro.placeholder = "€/year";
  }
  console.log(`nell opzione c'e ${chosed}`);
});

console.log(`nell opzione c'e ${chosed}`);

let allElements = [];

//BOTTONE SUBMIT
submitBtn.addEventListener("click", function () {
  if (chosed == "select") {
    alert("NOT SELECT");
    return;
  }

  if (chosed == "job") {
    let JobAds = new Job(...allValeus());
    allElements.push(JobAds); //put in the array
    printJob(JobAds, "job");
  } else {
    let CourseAds = new Education(...allValeus());
    allElements.push(CourseAds);
    printJob(CourseAds, "course");
  }
  emptyAll();
  console.log(allElements);
  delateLi();
  setLocalStorage(); //call for local storage
});

//FUNCTION

//get all values
let allValeus = function () {
  let name = offerTitle.value;
  let position = offerLocation.value;
  let info = offerDescription.value;
  let additionalInfo = parseInt(ralEuro.value);
  console.log(`ECCO IL VALORE INSERITO ${additionalInfo}`);
  //console.log(` RAL O ORARIO RISULTANO ${additionalInfo}`);
  let id = (Date.now() + "").slice(-10);
  let allInfo = [name, position, info, id, additionalInfo];
  return allInfo;
};

//Empty from function
let emptyAll = () => {
  offerTitle.value =
    offerLocation.value =
    offerDescription.value =
    ralEuro.value =
      "";
  selectOption.value = selectVal.value;
  chosed = "select";
};

//print JOB/course function

let printJob = function (el, type) {
  let value = el.ral ? el.ral : el.hours;
  let simbol = el.ral ? "€" : "hours";
  let html = `<li class="offer-${type}" id=${el.id}>
  <button class="exit-btn">X</button>
  <h3 class="offer-title">${el.type}</h3>
  <p class="description">${el.description}</p>
  <div class="additional-info">
    <p class="location info-style">${el.location}</p>
    <p class="btn-${type} info-style">${value} ${simbol}</p>
  </div>

  <div class="centered-btn">
    <button class="apply-btn">Apply</button>
  </div>
</li>`;
  bulletin.insertAdjacentHTML("beforeend", html);
};

//show Delate buttons to admins
let showRemoveBtn = function () {
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].classList.remove("hidden");
  }
};

let hideRemoveBtn = function () {
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].classList.add("hidden");
  }
};

//REMOVE ELEMENT FROM LIST

let delateLi = function () {
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", function () {
      console.log("click funziona");
      delateArrayEl(this);
      this.parentNode.remove();
    });
  }
};
delateLi();

//FUNCTION delate from allElements Array
let delateArrayEl = function (el) {
  for (let j = 0; j < allElements.length; j++) {
    if (el.parentNode.id == allElements[j].id) {
      allElements.splice(j, 1);
      setLocalStorage(); //local storage dopo cancellazione
    }
  }
};

window.addEventListener("load", function () {
  setLocalStorage();
  getLocalStrg();
});

//Local storage
let setLocalStorage = function () {
  localStorage.setItem("JobAndEducation", JSON.stringify(allElements));
};

let getLocalStrg = function () {
  let data = JSON.parse(localStorage.getItem("JobAndEducation"));
  console.log("sotto ho data");
  console.log(data);

  if (!data) return;

  allElements = data;

  for (let i = 0; i < allElements.length; i++) {
    console.log("allElements sotto:");
    console.log(allElements[i]);
    if (allElements[i].ral) {
      printJob(allElements[i], "job");
    } else {
      printJob(allElements[i], "course");
    }
  }
};

getLocalStrg();
