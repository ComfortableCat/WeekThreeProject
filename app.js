const upgradeDiv = document.getElementById("upgradeContainer");
const cookieCountDisplay = document.getElementById("cookieCount");
const cpsCountDisplay = document.getElementById("cpsCount");
const costIncreasePercent = 105;

//retrieve from local
let localUpgrades = JSON.parse(localStorage.getItem("localUpgrades")); //need to retrieve and send to local
let cps = JSON.parse(localStorage.getItem("cps")) || 0;
let cookieCount = JSON.parse(localStorage.getItem("cookieCount")) || 0;
let cookieClickMulti =
  JSON.parse(localStorage.getItem("cookieClickMulti")) || 1;

if (localUpgrades) {
  console.log("there is local data");
  upgradesToPage();
} else {
  loadUpgradeAPI();
  console.log(localUpgrades);
}

let cpsUpdate = setInterval(() => {
  cookieCount = Number(
    (cookieCount + Number((cps / 10).toFixed(1))).toFixed(1)
  );

  update();
}, 100);

let save = setInterval(saveToLocal, 60000);

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
  upgradesToPage();
  saveToLocal();
}

function saveToLocal() {
  localStorage.setItem("cookieClickMulti", cookieClickMulti);
  localStorage.setItem("cookieCount", cookieCount);
  localStorage.setItem("cps", cps);
  localStorage.setItem("localUpgrades", JSON.stringify(localUpgrades));
}

function upgradesToPage() {
  for (let i = 0; i < localUpgrades.length; i++) {
    const upgradeCont = document.createElement("div");
    const textCont = document.createElement("div");
    const name = document.createElement("p");
    const cost = document.createElement("p");
    const img = document.createElement("img");
    const btn = document.createElement("button");
    const count = document.createElement("p");
    upgradeCont.classList.add("upgrade");
    upgradeCont.classList.add(localUpgrades[i]["id"] - 1);
    textCont.classList.add("textCont");
    cost.classList.add("cost");
    btn.classList.add("buyBtn");
    btn.classList.add(localUpgrades[i]["id"] - 1);
    count.classList.add("count");
    name.textContent = localUpgrades[i]["name"];
    img.alt = localUpgrades[i]["name"];
    cost.textContent = `Cost: ${localUpgrades[i]["cost"]}`;
    count.textContent = localUpgrades[i]["count"];
    upgradeCont.appendChild(img);
    textCont.appendChild(name);
    textCont.appendChild(cost);
    upgradeCont.appendChild(textCont);
    upgradeCont.appendChild(btn);
    upgradeCont.appendChild(count);
    upgradeDiv.appendChild(upgradeCont);

    document
      .getElementsByClassName(`buyBtn ${i}`)[0]
      .addEventListener("click", (event) => {
        console.log("w");
        upgradePeopleUpgrades(event.target.classList[1]);
      });
  }
}

function update() {
  cookieCountDisplay.textContent = cookieCount;
  cpsCountDisplay.textContent = cps;
  for (let i = 0; i < localUpgrades.length; i++) {
    buttonCheck(i);
    document.getElementsByClassName("cost")[
      i
    ].textContent = `Cost: ${localUpgrades[i]["currentCost"]}`;
  }
}

function buttonCheck(a) {
  if (cookieCount >= localUpgrades[a]["currentCost"]) {
    if (
      document
        .getElementsByClassName("buyBtn")
        [a].classList.contains("affordable") === false
    ) {
      document.getElementsByClassName("buyBtn")[a].classList.add("affordable");
      console.log("changed state");
    }
  } else {
    document.getElementsByClassName("buyBtn")[a].classList.remove("affordable");
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
    cookieCount = cookieCount - localUpgrades[a]["currentCost"];
    localUpgrades[a].currentCost =
      localUpgrades[a]["currentCost"] * costIncreasePercent;
    localUpgrades[a].currentCost = (
      localUpgrades[a]["currentCost"] / 100
    ).toFixed(0);
    document.getElementsByClassName("cost")[
      a
    ].textContent = `Cost: ${localUpgrades[a]["currentCost"]}`;
  }
  console.log("a: ", a);
}

document.getElementById("clicker").addEventListener("click", () => {
  cookieCount = cookieCount + cookieClickMulti;
  update();
});

/*document
  .getElementsByClassName(`buyBtn ${i}`)[0]
  .addEventListener("click", (event) => {
    console.log("w");
    upgradePeopleUpgrades(event.target.classList[1]);
  });
*/
