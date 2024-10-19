const icons = [
  [
    "./images/pointer.webp",
    "./images/furnace.webp",
    "./images/Diamond_Hoe.webp",
    "./images/baker.webp",
    "./images/factory.webp",
    "./images/flour.webp",
    "./images/clock.webp",
    "./images/Quantum.webp",
    "./images/alien.webp",
    "./images/interdimensional.webp",
  ],
  [],
];
const audios = {
  clickCookie: "./audio/plastic-crunch-83779.wav",
  save: "./audio/save_choirboy_2-modific-96757.mp3",
};
const upgradeDiv = document.getElementById("upgradeContainer");
const cookieCountDisplay = document.getElementById("cookieCount");
const cpsCountDisplay = document.getElementById("cpsCount");
const costIncreasePercent = 102;

//retrieve from local
const MultiClickUpgrades = JSON.parse(
  localStorage.getItem("MultiClickUpgrades")
) || [
  { id: 1, name: "Double tap", cost: "150", increase: 2, owned: false },
  { id: 2, name: "Tap dancer", cost: "750", increase: 10, owned: false },
  { id: 3, name: "Burning Finger", cost: "1500", increase: 5, owned: false },
  { id: 4, name: "Carpell tapper", cost: "5000", increase: 2, owned: false },
  { id: 5, name: "Godly taps", cost: "15000", increase: 2.5, owned: false },
];
let localUpgrades = JSON.parse(localStorage.getItem("localUpgrades"));
let cps = JSON.parse(localStorage.getItem("cps")) || 0;
let cookieCount = JSON.parse(localStorage.getItem("cookieCount")) || 0;
let cookieClickMulti =
  JSON.parse(localStorage.getItem("cookieClickMulti")) || 1;
let preferences = JSON.parse(localStorage.getItem("preferences")) || {
  dark: true,
  volume: 80,
};
for (const audio in audios) {
  const sound = document.createElement("audio");
  sound.src = audios[audio];
  sound.id = audio;
  document.body.appendChild(sound);
}
if (localUpgrades) {
  builingsToPage();
} else {
  loadUpgradeAPI();
}
updatePreferences();

let cpsUpdate = setInterval(() => {
  cookieCount = Number(
    (cookieCount + Number((cps / 10).toFixed(1))).toFixed(1)
  );

  update();
}, 100);

let save = setInterval(saveToLocal, 5000);

async function loadUpgradeAPI() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const upgrades = await response.json();
  localUpgrades = await upgrades;
  for (let i = 0; i < upgrades.length; i++) {
    localUpgrades[i].count = "0";
    localUpgrades[i]["currentCost"] = localUpgrades[i]["cost"];
  }
  builingsToPage();
  saveToLocal();
}

function saveToLocal() {
  localStorage.setItem(
    "MultiClickUpgrades",
    JSON.stringify(MultiClickUpgrades)
  );
  localStorage.setItem("preferences", JSON.stringify(preferences));
  localStorage.setItem("cookieClickMulti", cookieClickMulti);
  localStorage.setItem("cookieCount", cookieCount);
  localStorage.setItem("cps", cps);
  localStorage.setItem("localUpgrades", JSON.stringify(localUpgrades));
}

function builingsToPage() {
  for (let i = 0; i < localUpgrades.length; i++) {
    const btn = document.createElement("button");
    const img = document.createElement("img");
    const textCont = document.createElement("div");
    const name = document.createElement("p");
    const cost = document.createElement("p");
    const count = document.createElement("h3");
    btn.classList.add("buyBtn");
    btn.classList.add(localUpgrades[i]["id"] - 1);
    textCont.classList.add("textCont");
    cost.classList.add("cost");
    count.classList.add("count");
    name.textContent = localUpgrades[i]["name"];
    img.alt = localUpgrades[i]["name"];
    img.src = icons[0][i];
    cost.textContent = `Cost: ${localUpgrades[i]["cost"]}`;
    count.textContent = localUpgrades[i]["count"];
    btn.appendChild(img);
    textCont.appendChild(name);
    textCont.appendChild(cost);
    btn.appendChild(textCont);
    btn.appendChild(count);
    upgradeDiv.appendChild(btn);

    btn.addEventListener("click", (event) => {
      upgradePeopleUpgrades(event.currentTarget.classList[1]);
    });
  }
  document.getElementById("buildings").classList.add("active");
  update();
}

function upgradesToPage() {
  for (let i = 0; i < MultiClickUpgrades.length; i++) {
    const btn = document.createElement("button");
    const img = document.createElement("img");
    const textCont = document.createElement("div");
    const name = document.createElement("p");
    const cost = document.createElement("p");
    btn.classList.add("buyBtn");
    btn.classList.add(MultiClickUpgrades[i]["id"] - 1);
    textCont.classList.add("textCont");
    cost.classList.add("cost");
    name.textContent = MultiClickUpgrades[i]["name"];
    img.alt = MultiClickUpgrades[i]["name"];
    img.src = icons[1][i];
    cost.textContent = `Cost: ${MultiClickUpgrades[i]["cost"]}`;
    btn.appendChild(img);
    textCont.appendChild(name);
    textCont.appendChild(cost);
    btn.appendChild(textCont);
    upgradeDiv.appendChild(btn);

    btn.addEventListener("click", (event) => {
      clickUpgradesBought(event.currentTarget.classList[1]);
    });

    if (MultiClickUpgrades[i]["owned"] === true) {
      btn.classList.add("bought");
    }
  }
  document.getElementById("clickUpgrades").classList.add("active");
  update();
}

function settingsToPage() {
  const settingDiv = document.createElement("div");
  const saveBtn = document.createElement("button");
  const resetBtn = document.createElement("button");
  const themeBtn = document.createElement("button");
  const volP = document.createElement("p");
  const vol = document.createElement("input");
  volP.id = "volumeDisplay";
  vol.id = "volumeSlider";
  saveBtn.id = "saveBtn";
  resetBtn.id = "reset";
  themeBtn.id = "theme";
  vol.type = "range";
  vol.min = 0;
  vol.max = 100;
  vol.step = 5;
  vol.value = Number(preferences["volume"]);
  volP.textContent = "Volume: " + vol.value;
  saveBtn.textContent = "Manual Save";
  resetBtn.textContent = "Reset Game";
  themeBtn.textContent = "Change theme";
  saveBtn.addEventListener("click", () => {
    saveToLocal();
    playAudio("save");
    alert("Game Saved to Local Storage");
  });
  resetBtn.addEventListener("click", () => {
    localStorage.clear();
    localStorage.setItem("preferences", JSON.stringify(preferences));
    location.reload();
  });
  themeBtn.addEventListener("click", () => {
    preferences["dark"] = !preferences["dark"];
    updatePreferences();
  });
  vol.addEventListener("change", changeVolume);
  settingDiv.appendChild(saveBtn);
  settingDiv.appendChild(resetBtn);
  settingDiv.appendChild(themeBtn);
  settingDiv.appendChild(volP);
  settingDiv.appendChild(vol);
  upgradeDiv.appendChild(settingDiv);
  document.getElementById("settings").classList.add("active");
  update();
}

function update() {
  cookieCountDisplay.textContent = cookieCount;
  cpsCountDisplay.textContent = cps;
  if (document.getElementById("buildings").classList.contains("active")) {
    for (let i = 0; i < localUpgrades.length; i++) {
      buttonCheck(i);
      document.getElementsByClassName("cost")[
        i
      ].textContent = `Cost: ${localUpgrades[i]["currentCost"]}`;
      document.getElementsByClassName("count")[i].textContent =
        localUpgrades[i]["count"];
    }
  } else if (
    document.getElementById("clickUpgrades").classList.contains("active")
  ) {
    for (let i = 0; i < MultiClickUpgrades.length; i++) {
      buttonCheck(i);
    }
  }
  audioVolumes();
}

function buttonCheck(a) {
  if (
    cookieCount >=
    Number(
      document
        .getElementsByClassName("cost")
        [a].textContent.replace("Cost: ", "")
    )
  ) {
    if (
      document
        .getElementsByClassName("buyBtn")
        [a].classList.contains("affordable") === false
    ) {
      document.getElementsByClassName("buyBtn")[a].classList.add("affordable");
    }
  } else {
    document.getElementsByClassName("buyBtn")[a].classList.remove("affordable");
  }
}
function updatePreferences() {
  document.querySelectorAll("audio").volume = preferences["volume"];
  if (preferences["dark"] === false) {
    document.body.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
  }
}
function changeVolume() {
  preferences["volume"] = document.getElementById("volumeSlider").value;
  document.getElementById("volumeDisplay").textContent =
    "Volume: " + preferences["volume"];
  updatePreferences();
}
function playAudio(a) {
  document.getElementById(a).currentTime = 0;
  document.getElementById(a).play();
}
function audioVolumes() {
  const audio = document.querySelectorAll("audio");
  for (let i = 0; i < audio.length; i++) {
    audio[i].volume = preferences["volume"] / 100;
  }
}

function upgradePeopleUpgrades(a) {
  buttonCheck(a);
  if (
    document
      .getElementsByClassName("buyBtn")
      [a].classList.contains("affordable") === true
  ) {
    cps = cps + localUpgrades[a]["increase"];
    cookieCount = cookieCount - Number(localUpgrades[a]["currentCost"]);
    localUpgrades[a]["count"] = Number(localUpgrades[a]["count"]) + 1;
    localUpgrades[a].currentCost =
      localUpgrades[a]["currentCost"] * costIncreasePercent;
    localUpgrades[a].currentCost = (
      localUpgrades[a]["currentCost"] / 100
    ).toFixed(0);
    document.getElementsByClassName("cost")[
      a
    ].textContent = `Cost: ${localUpgrades[a]["currentCost"]}`;
  }
}

function clickUpgradesBought(a) {
  buttonCheck(a);
  if (
    document
      .getElementsByClassName("buyBtn")
      [a].classList.contains("affordable") === true &&
    MultiClickUpgrades[a]["owned"] === false
  ) {
    cookieClickMulti =
      cookieClickMulti * Number(MultiClickUpgrades[a]["increase"]);
    cookieCount = cookieCount - Number(MultiClickUpgrades[a]["cost"]);
    MultiClickUpgrades[a]["owned"] = true;
    document.getElementsByClassName(`buyBtn ${a}`)[0].classList.add("bought");
  }
}
function clickShrink() {
  document.getElementById("clicker").style.transform = "scale(1)";
}

document.getElementById("clicker").addEventListener("click", () => {
  document.getElementById("clicker").style.transform = "scale(0.98)";
  let x = setTimeout(clickShrink, 100);
  cookieCount = cookieCount + cookieClickMulti;
  playAudio("clickCookie");
  update();
});

document.getElementById("buildings").addEventListener("click", () => {
  if (
    document.getElementById("buildings").classList.contains("active") === false
  ) {
    upgradeDiv.replaceChildren();
    document.getElementById("clickUpgrades").classList.remove("active");
    document.getElementById("settings").classList.remove("active");
    builingsToPage();
  }
});

document.getElementById("clickUpgrades").addEventListener("click", () => {
  if (
    document.getElementById("clickUpgrades").classList.contains("active") ===
    false
  ) {
    upgradeDiv.replaceChildren();
    document.getElementById("buildings").classList.remove("active");
    document.getElementById("settings").classList.remove("active");
    upgradesToPage();
  }
});

document.getElementById("settings").addEventListener("click", () => {
  if (
    document.getElementById("settings").classList.contains("active") === false
  ) {
    upgradeDiv.replaceChildren();
    document.getElementById("clickUpgrades").classList.remove("active");
    document.getElementById("buildings").classList.remove("active");
    settingsToPage();
  }
});
