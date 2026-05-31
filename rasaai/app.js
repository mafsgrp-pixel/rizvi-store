/* ===================================
   RASAAI APP.JS
=================================== */

document.addEventListener("DOMContentLoaded", () => {

    initTheme();
    initPriceEngine();
    initCalculator();
    initWhatsApp();

});

/* ===================================
   THEME SYSTEM
=================================== */

function initTheme() {

    const themeBtn = document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("rasaai_theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeBtn.innerHTML = "☀️";
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        if (isDark) {

            localStorage.setItem(
                "rasaai_theme",
                "dark"
            );

            themeBtn.innerHTML = "☀️";

        } else {

            localStorage.setItem(
                "rasaai_theme",
                "light"
            );

            themeBtn.innerHTML = "🌙";
        }

    });

}

/* ===================================
   LIVE PRICE ENGINE
=================================== */

let currentRate = 1238;

function generateRandomRate() {

    return Math.floor(
        Math.random() * (1647 - 1238 + 1)
    ) + 1238;

}

function initPriceEngine() {

    const priceEl =
        document.getElementById("livePrice");

    const countdownEl =
        document.getElementById("countdown");

    currentRate =
        generateRandomRate();

    priceEl.innerText =
        "₹" + currentRate.toLocaleString();

    let seconds = 15 * 60;

    setInterval(() => {

        seconds--;

        const mins =
            Math.floor(seconds / 60);

        const secs =
            seconds % 60;

        countdownEl.innerText =
            `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

        if (seconds <= 0) {

            currentRate =
                generateRandomRate();

            priceEl.innerText =
                "₹" + currentRate.toLocaleString();

            seconds = 15 * 60;

            calculateCampaign();
        }

    }, 1000);

}

/* ===================================
   CALCULATOR
=================================== */

function initCalculator() {

    const btn =
        document.getElementById(
            "calculateBtn"
        );

    if (!btn) return;

    btn.addEventListener(
        "click",
        calculateCampaign
    );

}

function getRickshawCount() {

    const value =
        document.getElementById(
            "rickshaws"
        ).value;

    return parseInt(value);

}

function getDurationDays() {

    const value =
        document.getElementById(
            "duration"
        ).value;

    return parseInt(value);

}

function getZoneViews(zone) {

    switch (zone) {

        case "Zone 1":
            return 13500;

        case "Zone 2":
            return 16000;

        case "Zone 3":
            return 24500;

        case "Zone 4":
            return 15000;

        default:
            return 12000;
    }

}

function calculateCampaign() {

    const zone =
        document.getElementById(
            "zone"
        ).value;

    const rickshaws =
        getRickshawCount();

    const days =
        getDurationDays();

    const totalCost =
        currentRate *
        rickshaws *
        days;

    const dailyViews =
        getZoneViews(zone);

    const estimatedViews =
        dailyViews *
        rickshaws *
        days;

    const estimatedReach =
        Math.round(
            estimatedViews * 0.35
        );

    document.getElementById(
        "totalCost"
    ).innerText =
        "₹" +
        totalCost.toLocaleString();

    document.getElementById(
        "estimatedViews"
    ).innerText =
        estimatedViews.toLocaleString();

    document.getElementById(
        "estimatedReach"
    ).innerText =
        estimatedReach.toLocaleString();

}

/* ===================================
   WHATSAPP BOOKING
=================================== */

function initWhatsApp() {

    const btn =
        document.getElementById(
            "whatsappBooking"
        );

    if (!btn) return;

    btn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            const name =
                document.querySelector(
                    'input[placeholder="Full Name"]'
                ).value;

            const phone =
                document.querySelector(
                    'input[placeholder="Phone Number"]'
                ).value;

            const email =
                document.querySelector(
                    'input[placeholder="Email Address"]'
                ).value;

            const business =
                document.querySelector(
                    'input[placeholder="Business Name"]'
                ).value;

            const language =
                document.getElementById(
                    "language"
                ).value;

            const zone =
                document.getElementById(
                    "zone"
                ).value;

            const rickshaws =
                document.getElementById(
                    "rickshaws"
                ).value;

            const duration =
                document.getElementById(
                    "duration"
                ).value;

            const totalCost =
                document.getElementById(
                    "totalCost"
                ).innerText;

            if (
                !name ||
                !phone ||
                !business
            ) {

                alert(
                    "Please fill Name, Phone and Business Name."
                );

                return;
            }

            const message =

`*RASAAI CAMPAIGN BOOKING*

Name: ${name}

Phone: ${phone}

Email: ${email}

Business: ${business}

Language: ${language}

Zone: ${zone}

Rickshaws: ${rickshaws}

Duration: ${duration}

Campaign Cost: ${totalCost}

Campaign Setup Time:
3 Working Days

First Time Advertiser Bonus:
30 FREE Social Media Creatives`;

            const whatsappNumber =
                "919594306625";

            const url =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            window.open(
                url,
                "_blank"
            );

        }
    );

}
