// An array stores all possible outfits.
const looks = [
  {
    name: "Quiet Layers",
    moods: ["soft"],
    occasions: ["campus", "cafe"],
    pieces: ["Light scarf", "Soft cardigan", "Pearl clip"],
    description: "A comfortable look with one delicate detail."
  },
  {
    name: "Gallery Afterglow",
    moods: ["soft", "bold"],
    occasions: ["gallery"],
    pieces: ["Silk scarf", "Long coat", "Silver chain"],
    description: "A simple base lets your accessories stand out."
  },
  {
    name: "Color in Motion",
    moods: ["bold", "playful"],
    occasions: ["campus", "gallery"],
    pieces: ["Printed scarf", "Bright top", "Chunky necklace"],
    description: "Color turns an ordinary day into your runway."
  },
  {
    name: "The Café Spark",
    moods: ["playful"],
    occasions: ["cafe"],
    pieces: ["Hair ribbon", "Layered jewelry", "Patterned bag"],
    description: "Small surprises make this look feel spontaneous."
  },
  {
    name: "Modern Muse",
    moods: ["bold"],
    occasions: ["campus", "cafe"],
    pieces: ["Statement scarf", "Black blazer", "Silver rings"],
    description: "A strong silhouette with a personal touch."
  },
  {
    name: "Curious Collector",
    moods: ["soft", "playful"],
    occasions: ["gallery", "cafe"],
    pieces: ["Vintage scarf", "Beaded necklace", "Colorful clip"],
    description: "Different textures come together in your own way."
  }
];

// State remembers the current look and previous results.
const state = {
  currentLook: null,
  history: JSON.parse(localStorage.getItem("styleHistory")) || []
};

const form = document.querySelector("#style-form");
const historyList = document.querySelector("#history");

function showHistory() {
  historyList.replaceChildren();

  if (state.history.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No looks yet.";
    historyList.append(item);
    return;
  }

  for (const name of state.history) {
    const item = document.createElement("li");
    item.textContent = name;
    historyList.append(item);
  }
}

function findLook() {
  const occasion = document.querySelector("#occasion").value;
  const mood = document.querySelector("#mood").value;
  // Give each look points for matching the user's choices.
// Score each look against both user choices.
const rankedLooks = looks.map(function (look) {
  const matchesOccasion = look.occasions.includes(occasion);
  const matchesMood = look.moods.includes(mood);

  let score = 0;

  if (matchesOccasion && matchesMood) {
    score = 4;
  } else if (matchesOccasion || matchesMood) {
    score = 2;
  } else {
    score = 0;
  }

  return { ...look, score: score };
});

rankedLooks.sort(function (a, b) {
  return b.score - a.score;
});

// Keep only the strongest matches.
const highestScore = rankedLooks[0].score;

const candidates = rankedLooks.filter(function (look) {
  return look.score === highestScore;
});

// Use previous actions to avoid repeating the current look.
const alternatives = candidates.filter(function (look) {
  return look.name !== state.currentLook;
});

const unseen = alternatives.filter(function (look) {
  return !state.history.includes(look.name);
});

let choices;

if (unseen.length > 0) {
  choices = unseen;
} else if (alternatives.length > 0) {
  choices = alternatives;
} else {
  choices = candidates;
}

const selected = choices[
  Math.floor(Math.random() * choices.length)
];

  state.currentLook = selected.name;
  state.history.unshift(selected.name);
  state.history = state.history.slice(0, 3);

  localStorage.setItem("styleHistory", JSON.stringify(state.history));

  document.querySelector("#look-name").textContent = selected.name;
  document.querySelector("#look-description").textContent =
    selected.description;
  const occasionNames = {
  campus: "a day on campus",
  gallery: "an art gallery visit",
  cafe: "a café date"
};

const moodNames = {
  soft: "soft and relaxed",
  bold: "bold and expressive",
  playful: "playful and curious"
};

const lookReason = document.querySelector("#look-reason");

if (selected.score === 4) {
  lookReason.textContent =
    "Why this look: It matches both your plans for " +
    occasionNames[occasion] +
    " and your wish to feel " +
    moodNames[mood] +
    ".";
} else if (selected.occasions.includes(occasion)) {
  lookReason.textContent =
    "Why this look: It suits your plans for " +
    occasionNames[occasion] +
    ". Try a different mood to explore a closer match.";
} else {
  lookReason.textContent =
    "Why this look: It reflects your wish to feel " +
    moodNames[mood] +
    ". Try a different occasion to explore a closer match.";
}

lookReason.hidden = false;
  document.querySelector("#another").hidden = candidates.length < 2;

  const piecesContainer = document.querySelector("#pieces");
  piecesContainer.replaceChildren();

  for (const piece of selected.pieces) {
    const tag = document.createElement("span");
    tag.textContent = piece;
    piecesContainer.append(tag);
  }

  showHistory();
document.querySelector("#result-panel").scrollIntoView({
  behavior: "smooth",
  block: "start"
});
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  findLook();
});

document.querySelector("#another").addEventListener("click", findLook);

document.querySelector("#clear").addEventListener("click", function () {
  state.history = [];
  localStorage.removeItem("styleHistory");
  showHistory();
});