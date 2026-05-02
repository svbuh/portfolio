// THEMES — registry + helpers
// Each theme: { id, name, description, swatches: [c1,c2,c3,c4] }

window.THEMES = {
  ps1: {
    id: "ps1",
    name: "Paper Press",
    description: "Brutalist serifs, ink on paper",
    swatches: ["#CFCDC8", "#D63A3A", "#F4C61F", "#3FA34D"],
  },
  neo: {
    id: "neo",
    name: "Block Party",
    description: "Mario-loud primary blocks",
    swatches: ["#FFE74C", "#E5322D", "#2EBF4F", "#2D80E2"],
  },
  xp: {
    id: "xp",
    name: "Bliss",
    description: "Luna-blue chrome, Tahoma everywhere",
    swatches: ["#3A6EA5", "#245EDB", "#16A653", "#FFC72C"],
  },
  n64: {
    id: "n64",
    name: "Funtastic",
    description: "Cartridge-era polygon toys",
    swatches: ["#1B1D22", "#E5322D", "#F5C400", "#3A7BD5"],
  },
};

window.THEME_STORAGE_KEY = "portfolio:theme";

window.applyTheme = function (themeId) {
  if (!window.THEMES[themeId]) return;
  document.body.setAttribute("data-theme", themeId);
  try { localStorage.setItem(window.THEME_STORAGE_KEY, themeId); } catch (_) {}
};

window.getInitialTheme = function () {
  try {
    const stored = localStorage.getItem(window.THEME_STORAGE_KEY);
    if (stored && window.THEMES[stored]) return stored;
  } catch (_) {}
  const fallback = (window.TWEAK_DEFAULTS && window.TWEAK_DEFAULTS.theme) || "ps1";
  return window.THEMES[fallback] ? fallback : "ps1";
};

window.cycleTheme = function (currentId, dir = 1) {
  const ids = Object.keys(window.THEMES);
  const i = ids.indexOf(currentId);
  const next = ids[((i < 0 ? 0 : i) + dir + ids.length) % ids.length];
  return next;
};
