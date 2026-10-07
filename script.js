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
const rankedLooks = looks
  .map(function (look) {
    let score = 0;

    if (look.occasions.includes(occasion)) {
      score += 2;
    }

    if (look.moods.includes(mood)) {
      score += 2;
    }

    return { ...look, score: score };
  })
  .sort(function (a, b) {
    return b.score - a.score;
  });

// Offer the four closest looks instead of only exact matches.
const candidates = rankedLooks
  .filter(look => look.score > 0)
  .slice(0, 4);

// Prefer looks the user has not seen recently.
const unseen = candidates.filter(
  look => !state.history.includes(look.name)
);
const alternatives = candidates.filter(
  look => look.name !== state.currentLook
);

const choices = unseen.length > 0
  ? unseen
  : alternatives.length > 0
    ? alternatives
    : candidates;

const selected = choices[Math.floor(Math.random() * choices.length)];

  state.currentLook = selected.name;
  state.history.unshift(selected.name);
  state.history = state.history.slice(0, 3);

  localStorage.setItem("styleHistory", JSON.stringify(state.history));

  document.querySelector("#look-name").textContent = selected.name;
  document.querySelector("#look-description").textContent =
    selected.description;
  document.querySelector("#another").hidden = false;

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
  state.currentLook = null;
  localStorage.removeItem("styleHistory");
  showHistory();
});

showHistory();