const MODE_KEYS = {
  index: ["R", "T", "F", "G", "V", "B", "Y", "U", "H", "J", "N", "M"],
  middle: ["E", "D", "C", "I", "K", ","],
  ring: ["W", "S", "X", "O", "L", "."],
  little: ["Q", "A", "Z", "P", ";", "/"],
  home: ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
  top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  bottom: ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  all: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
};

const CODE_CHAR = { Comma: ",", Period: ".", Semicolon: ";", Slash: "/" };

const HAND_HINTS = {
  Q: "左手の小指", A: "左手の小指", Z: "左手の小指",
  W: "左手の薬指", S: "左手の薬指", X: "左手の薬指",
  E: "左手の中指", D: "左手の中指", C: "左手の中指",
  R: "左手の人差し指", T: "左手の人差し指", F: "左手の人差し指", G: "左手の人差し指", V: "左手の人差し指", B: "左手の人差し指",
  Y: "右手の人差し指", U: "右手の人差し指", H: "右手の人差し指", J: "右手の人差し指", N: "右手の人差し指", M: "右手の人差し指",
  I: "右手の中指", K: "右手の中指", ",": "右手の中指",
  O: "右手の薬指", L: "右手の薬指", ".": "右手の薬指",
  P: "右手の小指", ";": "右手の小指", "/": "右手の小指"
};

const FINGER_IDS = {
  Q: "left-little", A: "left-little", Z: "left-little",
  W: "left-ring", S: "left-ring", X: "left-ring",
  E: "left-middle", D: "left-middle", C: "left-middle",
  R: "left-index", T: "left-index", F: "left-index", G: "left-index", V: "left-index", B: "left-index",
  Y: "right-index", U: "right-index", H: "right-index", J: "right-index", N: "right-index", M: "right-index",
  I: "right-middle", K: "right-middle", ",": "right-middle",
  O: "right-ring", L: "right-ring", ".": "right-ring",
  P: "right-little", ";": "right-little", "/": "right-little"
};

const QUESTION_COUNT = 30;
const JAPANESE_PROMPTS = [
  { text: "会議", parts: [["ka"], ["i"], ["gi"]] },
  { text: "資料", parts: [["shi", "si"], ["ryo"], ["u"]] },
  { text: "予定", parts: [["yo"], ["te"], ["i"]] },
  { text: "確認", parts: [["ka"], ["ku"], ["n", "nn"], ["i"], ["n", "nn"]] },
  { text: "質問", parts: [["shi", "si"], ["tsu", "tu"], ["mo"], ["n", "nn"]] },
  { text: "連絡", parts: [["re"], ["n", "nn"], ["ra"], ["ku"]] },
  { text: "報告", parts: [["ho"], ["u"], ["ko"], ["ku"]] },
  { text: "相談", parts: [["so"], ["u"], ["da"], ["n", "nn"]] },
  { text: "提出", parts: [["te"], ["i"], ["shu", "syu"], ["tsu", "tu"]] },
  { text: "期限", parts: [["ki"], ["ge"], ["n", "nn"]] },
  { text: "お世話になっております", parts: [["o"], ["se"], ["wa"], ["ni"], ["na"], ["tte"], ["o"], ["ri"], ["ma"], ["su"]] },
  { text: "ご査収ください", parts: [["go"], ["sha", "sya"], ["shu", "syu"], ["u"], ["ku"], ["da"], ["sa"], ["i"]] },
  { text: "お疲れさまです", parts: [["o"], ["tsu", "tu"], ["ka"], ["re"], ["sa"], ["ma"], ["de"], ["su"]] },
  { text: "ありがとうございます", parts: [["a"], ["ri"], ["ga"], ["to"], ["u"], ["go"], ["za"], ["i"], ["ma"], ["su"]] },
  { text: "よろしく お願いいたします", parts: [["yo"], ["ro"], ["shi", "si"], ["ku"], [" "], ["o"], ["ne"], ["ga"], ["i"], ["i"], ["ta"], ["shi", "si"], ["ma"], ["su"]] },
  { text: "承知しました", parts: [["sho", "syo"], ["u"], ["chi", "ti"], ["shi", "si"], ["ma"], ["shi", "si"], ["ta"]] },
  { text: "かしこまりました", parts: [["ka"], ["shi", "si"], ["ko"], ["ma"], ["ri"], ["ma"], ["shi", "si"], ["ta"]] },
  { text: "ご確認ください", parts: [["go"], ["ka"], ["ku"], ["n", "nn"], ["i"], ["n", "nn"], ["ku"], ["da"], ["sa"], ["i"]] },
  { text: "少々 お待ちください", parts: [["sho", "syo"], ["u"], ["sho", "syo"], ["u"], [" "], ["o"], ["ma"], ["chi", "ti"], ["ku"], ["da"], ["sa"], ["i"]] },
  { text: "失礼いたします", parts: [["shi", "si"], ["tsu", "tu"], ["re"], ["i"], ["i"], ["ta"], ["shi", "si"], ["ma"], ["su"]] }
];

let selectedMode = "index";
let currentKey = "";
let question = 0;
let misses = 0;
let missByKey = {};
let acceptingInput = false;
let questionShownAt = 0;
let totalResponseTime = 0;
let practiceType = "letter";
let jpIndex = 0;
let jpTyped = "";
let jpCandidates = [];
let jpMisses = 0;
let jpCorrectInputs = 0;
let jpPromptShownAt = 0;
let jpLastAcceptedAt = 0;
let jpActiveTime = 0;
let jpCompletionTimer = null;

const setup = document.querySelector("#setup");
const practice = document.querySelector("#practice");
const result = document.querySelector("#result");
const target = document.querySelector("#target");
const targetWrap = document.querySelector("#target-wrap");
const progress = document.querySelector("#progress");
const missesText = document.querySelector("#misses");
const hint = document.querySelector("#hint");
const japanesePractice = document.querySelector("#japanese-practice");
const japaneseResult = document.querySelector("#japanese-result");
const jpCard = document.querySelector("#jp-card");

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach((item) => {
      item.classList.remove("is-selected");
      item.setAttribute("aria-checked", "false");
    });
    button.classList.add("is-selected");
    button.setAttribute("aria-checked", "true");
    selectedMode = button.dataset.mode;
  });
});

document.querySelector("#start").addEventListener("click", startGame);
document.querySelector("#start-japanese").addEventListener("click", startJapanese);
document.querySelector("#to-japanese").addEventListener("click", startJapanese);
document.querySelector("#retry").addEventListener("click", startGame);
document.querySelector("#change").addEventListener("click", showSetup);
document.querySelector("#jp-retry").addEventListener("click", startJapanese);
document.querySelector("#jp-back").addEventListener("click", showSetup);
window.addEventListener("keydown", handleKeydown);

function startGame() {
  practiceType = "letter";
  question = 0;
  misses = 0;
  missByKey = {};
  totalResponseTime = 0;
  missesText.textContent = "0";
  setup.hidden = true;
  result.hidden = true;
  japanesePractice.hidden = true;
  japaneseResult.hidden = true;
  practice.hidden = false;
  acceptingInput = true;
  nextQuestion();
}

function nextQuestion() {
  question += 1;
  const keys = MODE_KEYS[selectedMode];
  let next = keys[Math.floor(Math.random() * keys.length)];
  if (keys.length > 1) {
    while (next === currentKey) next = keys[Math.floor(Math.random() * keys.length)];
  }
  currentKey = next;
  questionShownAt = performance.now();
  target.textContent = currentKey;
  hint.textContent = HAND_HINTS[currentKey];
  document.querySelectorAll(".finger[data-finger]").forEach((finger) => {
    finger.classList.toggle("is-active", finger.dataset.finger === FINGER_IDS[currentKey]);
  });
  progress.textContent = `${question} / ${QUESTION_COUNT}`;
}

function handleKeydown(event) {
  if (!acceptingInput || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  if (practiceType === "japanese") {
    handleJapaneseKeydown(event);
    return;
  }

  const pressed = event.code.startsWith("Key") ? event.code.replace("Key", "") : CODE_CHAR[event.code];
  if (!pressed) return;
  event.preventDefault();
  targetWrap.classList.remove("is-correct", "is-wrong");
  void targetWrap.offsetWidth;

  if (pressed === currentKey) {
    totalResponseTime += performance.now() - questionShownAt;
    acceptingInput = false;
    targetWrap.classList.add("is-correct");
    if (question >= QUESTION_COUNT) {
      window.setTimeout(finishGame, 120);
    } else {
      window.setTimeout(() => {
        targetWrap.classList.remove("is-correct");
        nextQuestion();
        acceptingInput = true;
      }, 100);
    }
  } else {
    misses += 1;
    missByKey[currentKey] = (missByKey[currentKey] || 0) + 1;
    missesText.textContent = String(misses);
    targetWrap.classList.add("is-wrong");
  }
}

function finishGame() {
  const elapsed = totalResponseTime / 1000;
  const totalInputs = QUESTION_COUNT + misses;
  const accuracy = Math.round((QUESTION_COUNT / totalInputs) * 100);
  practice.hidden = true;
  result.hidden = false;
  document.querySelector("#accuracy").textContent = `${accuracy}%`;
  document.querySelector("#average-response").textContent = `${(elapsed / QUESTION_COUNT).toFixed(2)}秒`;
  document.querySelector("#time").textContent = `${elapsed.toFixed(1)}秒`;
  document.querySelector("#result-misses").textContent = String(misses);

  const weakKeys = Object.entries(missByKey)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => `${key}（${count}回）`);
  document.querySelector("#weak-keys").textContent = weakKeys.length
    ? `もう一度練習したいキー：${weakKeys.join(" ・ ")}`
    : "ノーミスです！";
}

function showSetup() {
  acceptingInput = false;
  window.clearTimeout(jpCompletionTimer);
  result.hidden = true;
  practice.hidden = true;
  japanesePractice.hidden = true;
  japaneseResult.hidden = true;
  setup.hidden = false;
}

function startJapanese() {
  practiceType = "japanese";
  jpIndex = 0;
  jpMisses = 0;
  jpCorrectInputs = 0;
  jpActiveTime = 0;
  window.clearTimeout(jpCompletionTimer);
  setup.hidden = true;
  practice.hidden = true;
  result.hidden = true;
  japaneseResult.hidden = true;
  japanesePractice.hidden = false;
  document.querySelector("#jp-misses").textContent = "0";
  acceptingInput = true;
  showJapanesePrompt();
}

function buildCandidates(parts) {
  return parts.reduce(
    (candidates, choices) => candidates.flatMap((candidate) => choices.map((choice) => candidate + choice)),
    [""]
  );
}

function showJapanesePrompt() {
  const prompt = JAPANESE_PROMPTS[jpIndex];
  jpTyped = "";
  jpCandidates = buildCandidates(prompt.parts);
  skipJapaneseSpaces();
  jpPromptShownAt = performance.now();
  jpLastAcceptedAt = jpPromptShownAt;
  document.querySelector("#jp-text").textContent = prompt.text;
  document.querySelector("#jp-progress").textContent = `${jpIndex + 1} / ${JAPANESE_PROMPTS.length}`;
  jpCard.classList.remove("is-wrong");
  renderJapaneseInput();
}

function handleJapaneseKeydown(event) {
  const pressed = event.code.startsWith("Key")
    ? event.code.replace("Key", "").toLowerCase()
    : event.code === "Space" ? " " : "";
  if (!pressed) return;
  event.preventDefault();
  if (pressed === " ") return;
  window.clearTimeout(jpCompletionTimer);

  const nextTyped = jpTyped + pressed;
  const matches = jpCandidates.filter((candidate) => candidate.startsWith(nextTyped));
  jpCard.classList.remove("is-wrong");
  void jpCard.offsetWidth;

  if (!matches.length) {
    jpMisses += 1;
    document.querySelector("#jp-misses").textContent = String(jpMisses);
    jpCard.classList.add("is-wrong");
    if (jpCandidates.includes(jpTyped)) {
      jpCompletionTimer = window.setTimeout(completeJapanesePrompt, 350);
    }
    return;
  }

  jpTyped = nextTyped;
  jpCandidates = matches;
  jpCorrectInputs += 1;
  jpLastAcceptedAt = performance.now();
  skipJapaneseSpaces();
  renderJapaneseInput();

  const hasExact = jpCandidates.includes(jpTyped);
  if (hasExact) {
    const hasLonger = jpCandidates.some((candidate) => candidate.length > jpTyped.length);
    if (hasLonger) {
      jpCompletionTimer = window.setTimeout(completeJapanesePrompt, 350);
    } else {
      completeJapanesePrompt();
    }
  }
}

function skipJapaneseSpaces() {
  while (
    jpCandidates.length > 0 &&
    jpCandidates.every((candidate) => candidate[jpTyped.length] === " ")
  ) {
    jpTyped += " ";
  }
}

function renderJapaneseInput() {
  const displayCandidate = jpCandidates[0] || jpTyped;
  const romaji = document.querySelector("#jp-romaji");
  romaji.replaceChildren();
  const typed = document.createElement("span");
  typed.className = "typed";
  typed.textContent = jpTyped;
  const remaining = document.createElement("span");
  remaining.className = "remaining";
  remaining.textContent = displayCandidate.slice(jpTyped.length);
  romaji.append(typed, remaining);
  updateJapaneseFinger(displayCandidate[jpTyped.length] || "");
}

function updateJapaneseFinger(character) {
  const fingerId = FINGER_IDS[character.toUpperCase()];
  document.querySelectorAll("[data-jp-finger]").forEach((finger) => {
    finger.classList.toggle("is-active", finger.dataset.jpFinger === fingerId);
  });
}

function completeJapanesePrompt() {
  acceptingInput = false;
  jpActiveTime += jpLastAcceptedAt - jpPromptShownAt;
  if (jpIndex >= JAPANESE_PROMPTS.length - 1) {
    window.setTimeout(finishJapanese, 160);
    return;
  }
  jpIndex += 1;
  window.setTimeout(() => {
    showJapanesePrompt();
    acceptingInput = true;
  }, 160);
}

function finishJapanese() {
  const elapsed = jpActiveTime / 1000;
  const accuracy = Math.round((jpCorrectInputs / (jpCorrectInputs + jpMisses)) * 100);
  const wpm = Math.round((jpCorrectInputs / 5) / (elapsed / 60));
  japanesePractice.hidden = true;
  japaneseResult.hidden = false;
  document.querySelector("#jp-wpm").textContent = String(wpm);
  document.querySelector("#jp-accuracy").textContent = `${accuracy}%`;
  document.querySelector("#jp-time").textContent = `${elapsed.toFixed(1)}秒`;
  document.querySelector("#jp-result-misses").textContent = String(jpMisses);
}
