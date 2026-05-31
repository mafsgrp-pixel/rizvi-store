/* =========================================
   RASAAI APP.JS
========================================= */

/* THEME SYSTEM */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.innerHTML = "☀️";
  } else {
    document.body.classList.remove("dark");
    if (themeToggle) themeToggle.innerHTML = "🌙";
  }
}

const savedTheme = localStorage.getItem("rasaai_theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.classList.contains("dark")
      ? "dark"
      : "light";

    const next = current === "dark" ? "light" : "dark";

    localStorage.setItem("rasaai_theme", next);

    applyTheme(next);
  });
}

/* =========================================
   RANDOM PRICE ENGINE
========================================= */

const livePriceEl = document.getElementById("livePrice");

let currentPrice = generateRandomPrice();

function generateRandomPrice() {
  return Math.floor(Math.random() * (1647 - 1238 + 1)) + 1238;
}

function updatePrice() {
  currentPrice = generateRandomPrice();

  if (livePriceEl) {
    livePriceEl.innerText =
      "₹" + currentPrice.toLocaleString("en-IN");
  }
}

updatePrice();

/* =========================================
   15 MIN COUNTDOWN
========================================= */

const countdownEl = document.getElementById("countdown");

let secondsLeft = 15 * 60;

function updateCountdown() {
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;

  if (countdownEl) {
    countdownEl.innerText =
      String(min).padStart(2, "0") +
      ":" +
      String(sec).padStart(2, "0");
  }

  secondsLeft--;

  if (secondsLeft < 0) {
    updatePrice();
    secondsLeft = 15 * 60;
  }
}

setInterval(updateCountdown, 1000);

updateCountdown();

/* =========================================
   CAMPAIGN CALCULATOR
========================================= */

const calculateBtn =
  document.getElementById("calculateBtn");

const totalCostEl =
  document.getElementById("totalCost");

const estimatedViewsEl =
  document.getElementById("estimatedViews");

const estimatedReachEl =
  document.getElementById("estimatedReach");

function getRickshawCount() {
  const value =
    document.getElementById("rickshaws").value;

  return parseInt(value);
}

function getDays() {
  const value =
    document.getElementById("duration").value;

  return parseInt(value);
}

function calculateCampaign() {
  const rickshaws = getRickshawCount();

  const days = getDays();

  const cost =
    currentPrice *
    rickshaws *
    days;

  const views =
    rickshaws *
    days *
    15000;

  const reach =
    Math.floor(views * 0.40);

  if (totalCostEl) {
    totalCostEl.innerText =
      "₹" + cost.toLocaleString("en-IN");
  }

  if (estimatedViewsEl) {
    estimatedViewsEl.innerText =
      views.toLocaleString("en-IN");
  }

  if (estimatedReachEl) {
    estimatedReachEl.innerText =
      reach.toLocaleString("en-IN");
  }
}

if (calculateBtn) {
  calculateBtn.addEventListener(
    "click",
    calculateCampaign
  );
}

/* =========================================
   WHATSAPP BOOKING
========================================= */

const whatsappBtn =
  document.getElementById("whatsappBooking");

if (whatsappBtn) {
  whatsappBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const name =
      document.querySelector(
        'input[placeholder="Full Name"]'
      )?.value || "";

    const phone =
      document.querySelector(
        'input[placeholder="Phone Number"]'
      )?.value || "";

    const email =
      document.querySelector(
        'input[placeholder="Email Address"]'
      )?.value || "";

    const business =
      document.querySelector(
        'input[placeholder="Business Name"]'
      )?.value || "";

    const language =
      document.getElementById("language").value;

    const zone =
      document.getElementById("zone").value;

    const rickshaws =
      document.getElementById("rickshaws").value;

    const duration =
      document.getElementById("duration").value;

    const transaction =
      document.querySelector(
        'input[placeholder="Transaction ID"]'
      )?.value || "";

    const message =
`Hello Rasaai,

I would like to book a campaign.

Name: ${name}
Phone: ${phone}
Email: ${email}

Business: ${business}

Language: ${language}

Zone: ${zone}

Fleet Size: ${rickshaws}

Duration: ${duration}

Current Rate: ₹${currentPrice}

Transaction ID: ${transaction}

Please contact me for campaign activation.`;

    const whatsappNumber =
      "919594306625";

    const url =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank");
  });
}

/* =========================================
   BASIC FORM VALIDATION
========================================= */

const campaignForm =
  document.getElementById("campaignForm");

if (campaignForm) {
  campaignForm.addEventListener("submit", function (e) {
    e.preventDefault();
  });
}

/* =========================================
   AUTO CALCULATE ON CHANGE
========================================= */

[
  "rickshaws",
  "duration"
].forEach(id => {
  const el = document.getElementById(id);

  if (el) {
    el.addEventListener("change", calculateCampaign);
  }
});

/* =========================================
   INITIAL CALCULATION
========================================= */

calculateCampaign();

console.log("RASAAI READY");
