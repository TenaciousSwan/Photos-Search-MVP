const STORAGE_KEY = "gp-notes-proto-v1";

const defaultState = () => ({
  notes: {},
  photoNotesEnabled: true,
  clueChipsEnabled: true,
  promptedPhotoIds: [],
  promptsDate: "",
  promptsToday: 0,
  ignoredStreak: 0,
  pauseUntil: null,
  events: []
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let tab = "photos";
let overlay = null;
let viewerIndex = -1;
let viewerList = [];
let promptTimer = null;
let fadeTimer = null;
let promptVisible = false;
let promptExpanded = false;
let promptNote = "";
let toast = "";
let menuOpen = false;
let searchQuery = "";
let searchChips = [];
let searchMode = "search";
let searchOpenedAt = 0;
let hadResults = false;
let lastQuerySig = "";
let chipImpressLogged = false;
let foundInSearch = false;
let infoOpen = false;
let editingNote = false;
let notesEditingPhotoId = "";
let notesEditingDraft = "";
let returnTo = null;
let promptShownAt = 0;
let noteSourceHint = "";
let semanticResults = [];
let semanticResultsSig = "";
let semanticRequestedSig = "";
let semanticTimer = null;
let capturePhoto = null;
let capturePromptTimer = null;
let captureFadeTimer = null;
let captureDismissTimer = null;
let captureToastTimer = null;
let floatingChipTimer = null;
let floatingReturnTimer = null;
let capturePillVisible = false;
let capturePillExpanded = false;
let capturePillFading = false;
let captureNoteText = "";
let captureNoteSource = "typed";
let captureToast = "";
let capturePromptStartedAt = 0;
let floatingClues = [];
let floatingCluesVisible = false;
let floatingCluesFading = false;
let floatingCluesConsumed = false;
let floatingCluesShownAt = 0;
let floatingResults = [];
let floatingSearchStartedAt = 0;

const app = document.getElementById("app");

function todayKey() {
  return NOW.toISOString().slice(0, 10);
}

function logEvent(type, extra = {}) {
  state.events.unshift({ t: new Date().toISOString(), type, ...extra });
  if (state.events.length > 400) state.events.length = 400;
  saveState();
  renderLog();
}

function renderLog() {
  const el = document.getElementById("eventLog");
  if (!el) return;
  if (!state.events.length) {
    el.innerHTML = "<div class='e'>No events yet</div>";
    return;
  }
  el.innerHTML = state.events
    .map((e) => {
      const { t, type, ...rest } = e;
      const restStr = Object.keys(rest).length ? " " + JSON.stringify(rest) : "";
      return `<div class="e"><b>${type}</b> ${t.slice(11, 19)}${escapeHtml(restStr)}</div>`;
    })
    .join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function photosSorted() {
  return [...LIBRARY].sort((a, b) => b.date - a.date);
}

function photoById(id) {
  return LIBRARY.find((p) => p.id === id);
}

function withNotes(p) {
  return { ...p, note: state.notes[p.id] || "" };
}

function dateHeader(d) {
  const start = (x) => { const n = new Date(x); n.setHours(0, 0, 0, 0); return n; };
  const today = start(NOW);
  const yest = new Date(today); yest.setDate(yest.getDate() - 1);
  const day = start(d);
  if (day.getTime() === today.getTime()) return "Today";
  if (day.getTime() === yest.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function groupByDate(list) {
  const map = new Map();
  list.forEach((p) => {
    const h = dateHeader(p.date);
    if (!map.has(h)) map.set(h, []);
    map.get(h).push(p);
  });
  return map;
}

function icon(name, filled = false) {
  return `<span class="material-symbols-outlined ${filled ? "fill" : ""} ni">${name}</span>`;
}

function navHTML() {
  const items = [
    { id: "photos", label: "Photos", ico: "photo" },
    { id: "collections", label: "Collections", ico: "grid_view" },
    { id: "create", label: "Create", ico: "auto_awesome" }
  ];
  return `
    <div class="nav-layer">
      <div class="nav-pill">
        ${items.map((it) => `
          <button type="button" class="nav-item ${tab === it.id ? "on" : ""}" data-tab="${it.id}">
            ${icon(it.ico, true)}${it.label}
          </button>`).join("")}
      </div>
      <div class="search-control">
        ${renderFloatingClues()}
        <button type="button" class="search-fab" id="searchFab" aria-label="Search">
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>`;
}

function topbar(title, extra = "") {
  return `
    <div class="topbar">
      <button type="button" class="avatar" id="avatarBtn" aria-label="Account">R</button>
      <div class="top-title">${title}</div>
      <button type="button" class="icon-btn" id="moreBtn" aria-label="More">
        <span class="material-symbols-outlined">more_vert</span>
      </button>
    </div>
    ${menuOpen ? `<div class="menu">
      <button type="button" id="openSettings">Settings</button>
    </div>` : ""}
    ${extra}`;
}

function renderPhotos() {
  const list = photosSorted();
  const groups = groupByDate(list);
  let grids = "";
  groups.forEach((items, h) => {
    grids += `<div class="date-h">${h}</div><div class="grid3">`;
    grids += items.map((p) => tileHTML(p)).join("");
    grids += `</div>`;
  });
  return `
    <div class="screen">
      ${topbar("")}
      <div class="scroll" id="mainScroll">
        <div class="memories">
          ${MEMORIES.map((m) => {
            const p = photoById(m.photoId);
            return `<div class="memory" data-open="${m.photoId}">
              <img src="${p.thumb}" alt="" />
              <span>${m.label}</span>
            </div>`;
          }).join("")}
        </div>
        ${grids}
      </div>
      ${navHTML()}
    </div>`;
}

function renderFloatingClues() {
  if (tab !== "photos" || !floatingCluesVisible || !state.clueChipsEnabled) return "";
  return `<div class="floating-clues ${floatingCluesFading ? "fading" : ""}" aria-label="Photo clues">
    ${floatingClues.map((clue, index) => `<button type="button" class="floating-clue" data-floating-clue="${index}" title="${escapeHtml(clue.value)}">${escapeHtml(clue.label)}</button>`).join("")}
  </div>`;
}

function tileHTML(p, { noteChip = false, noteMatch = false, resultId = "" } = {}) {
  const note = state.notes[p.id];
  return `<button type="button" class="tile" data-open="${p.id}" ${resultId ? `data-floating-result="${resultId}"` : ""}>
    <img src="${p.thumb}" alt="" />
    ${p.favorite ? `<span class="material-symbols-outlined fill fav">favorite</span>` : ""}
    ${noteChip && note && noteMatch ? `<div class="your-note"><b>Your note</b>${escapeHtml(note)}</div>` : ""}
  </button>`;
}

function collectionCounts() {
  const people = new Set();
  LIBRARY.forEach((p) => p.people.forEach((n) => people.add(n)));
  const places = new Set(LIBRARY.map((p) => p.city));
  const docs = LIBRARY.filter((p) => p.kind === "document" || p.kind === "receipt");
  const albums = new Set(LIBRARY.map((p) => p.album).filter(Boolean));
  const momentKeys = new Map();
  LIBRARY.forEach((p) => {
    if (p.kind !== "photo") return;
    const key = `${p.date.toISOString().slice(0, 10)}|${p.city}`;
    momentKeys.set(key, (momentKeys.get(key) || 0) + 1);
  });
  const moments = [...momentKeys.values()].filter((n) => n >= 2).length;
  const shots = LIBRARY.filter((p) => p.kind === "screenshot");
  const notes = LIBRARY.filter((p) => state.notes[p.id]);
  const favs = LIBRARY.filter((p) => p.favorite);
  return {
    people: people.size,
    places: places.size,
    documents: docs.length,
    albums: albums.size,
    moments: moments,
    screenshots: shots.length,
    notes: notes.length,
    favorites: favs.length,
    trash: 0
  };
}

function previewFor(filterFn) {
  const p = photosSorted().find(filterFn) || photosSorted()[0];
  return p.thumb;
}

function renderCollections() {
  const c = collectionCounts();
  const tiles = [
    { key: "people", title: "People & pets", count: c.people, img: src(PEOPLE_META.Maya.img, 400) },
    { key: "places", title: "Places", count: c.places, img: previewFor((p) => p.city === "Portland" && p.kind === "photo") },
    { key: "documents", title: "Documents", count: c.documents, img: previewFor((p) => p.kind === "document" || p.kind === "receipt") },
    { key: "albums", title: "Albums", count: c.albums, img: previewFor((p) => p.album === "Goa") },
    { key: "moments", title: "Moments", count: c.moments, img: previewFor((p) => p.id === "p36") },
    { key: "screenshots", title: "Screenshots", count: c.screenshots, img: previewFor((p) => p.kind === "screenshot") },
    { key: "notes", title: "Notes", count: c.notes, img: c.notes ? previewFor((p) => state.notes[p.id]) : previewFor((p) => p.id === "p01") }
  ];
  return `
    <div class="screen">
      ${topbar("Collections")}
      <div class="scroll">
        <div class="pills-row">
          <button type="button" class="shortcut-pill" data-coll="favorites">
            <span class="material-symbols-outlined fill">star</span>Favorites
          </button>
          <button type="button" class="shortcut-pill" data-coll="trash">
            <span class="material-symbols-outlined">delete</span>Trash
          </button>
        </div>
        <div class="coll-grid">
          ${tiles.map((t) => `
            <button type="button" class="coll-tile" data-coll="${t.key}">
              <img src="${t.img}" alt="" />
              <div class="label"><b>${t.title}</b><span>${t.count}</span></div>
            </button>`).join("")}
        </div>
      </div>
      ${navHTML()}
    </div>`;
}

function renderCreate() {
  const cards = [
    { ico: "grid_on", title: "Collage", sub: "Combine photos in a layout" },
    { ico: "animation", title: "Animation", sub: "Turn bursts into a loop" },
    { ico: "movie", title: "Cinematic photo", sub: "Add motion to a still" },
    { ico: "palette", title: "Highlight reel", sub: "A short film from a trip" }
  ];
  return `
    <div class="screen">
      ${topbar("Create")}
      <div class="scroll">
        <div class="create-list">
          ${cards.map((c) => `<div class="create-card">
            <div class="ci"><span class="material-symbols-outlined">${c.ico}</span></div>
            <div><b>${c.title}</b><span>${c.sub}</span></div>
          </div>`).join("")}
        </div>
      </div>
      ${navHTML()}
    </div>`;
}

function subPage(title, body) {
  return `
    <div class="screen">
      <div class="subhead">
        <button type="button" class="icon-btn" id="backBtn"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1>${title}</h1>
      </div>
      <div class="scroll">${body}</div>
    </div>`;
}

function renderNotesPage() {
  const items = photosSorted().filter((p) => state.notes[p.id]);
  if (!items.length) {
    overlay = { type: "notes" };
    return subPage("Notes", `<div class="empty">Notes you add to photos will show up here.</div>`);
  }
  const months = new Map();
  items.forEach((p) => {
    const m = monthLabel(p.date);
    if (!months.has(m)) months.set(m, []);
    months.get(m).push(p);
  });
  let html = `<div class="notes-list">`;
  months.forEach((arr, m) => {
    html += `<div class="month-h">${m}</div>`;
    arr.forEach((p) => {
      const note = state.notes[p.id];
      const d = p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      html += `<div class="note-row">
        <img src="${p.thumb}" alt="" />
        <div>
          ${notesEditingPhotoId === p.id ? `
            <input class="note-row-input" data-note-draft="${p.id}" maxlength="60" value="${escapeHtml(notesEditingDraft)}" aria-label="Edit note for ${escapeHtml(p.place)}" />
            <div class="note-row-actions">
              <button type="button" data-save-note-row="${p.id}">Save</button>
              <button type="button" data-cancel-note-row>Cancel</button>
            </div>` : `
            <button type="button" class="note-row-open" data-open="${p.id}">
              <span class="nt">${escapeHtml(note)}</span>
              <span class="meta">${d} · ${escapeHtml(p.place)}</span>
            </button>
            <button type="button" class="note-row-edit" data-edit-note-row="${p.id}" aria-label="Edit note">Edit</button>`}
        </div>
      </div>`;
    });
  });
  html += `</div>`;
  overlay = { type: "notes" };
  return subPage("Notes", html);
}

function renderPeople() {
  const names = [...new Set(LIBRARY.flatMap((p) => p.people))];
  overlay = { type: "people" };
  return subPage("People & pets", `<div class="people-grid">${names.map((n) => {
    const img = src(PEOPLE_META[n]?.img || 64, 400);
    return `<button type="button" class="person" data-person="${n}">
      <img src="${img}" alt="" /><span>${n}</span>
    </button>`;
  }).join("")}</div>`);
}

function renderPlaces() {
  const cities = [...new Set(LIBRARY.map((p) => p.city))];
  overlay = { type: "places" };
  return subPage("Places", `<div class="coll-grid" style="padding-top:8px">${cities.map((c) => {
    const n = LIBRARY.filter((p) => p.city === c).length;
    const img = previewFor((p) => p.city === c);
    return `<button type="button" class="coll-tile" data-place="${c}">
      <img src="${img}" alt="" /><div class="label"><b>${c}</b><span>${n}</span></div>
    </button>`;
  }).join("")}</div>`);
}

function renderSimpleGrid(title, list) {
  overlay = { type: "grid", title, list, from: overlay?.from || null };
  const groups = groupByDate(list);
  let grids = "";
  groups.forEach((items, h) => {
    grids += `<div class="date-h">${h}</div><div class="grid3">${items.map((p) => tileHTML(p)).join("")}</div>`;
  });
  if (!list.length) {
    const empty = title === "Trash" ? "Items you delete will show up here." : "No photos in this collection.";
    grids = `<div class="empty">${empty}</div>`;
  }
  return subPage(title, grids);
}

function renderAlbums() {
  const albums = [...new Set(LIBRARY.map((p) => p.album).filter(Boolean))];
  overlay = { type: "albums" };
  return subPage("Albums", `<div class="coll-grid" style="padding-top:8px">${albums.map((a) => {
    const n = LIBRARY.filter((p) => p.album === a).length;
    const img = previewFor((p) => p.album === a);
    return `<button type="button" class="coll-tile" data-album="${a}">
      <img src="${img}" alt="" /><div class="label"><b>${a}</b><span>${n}</span></div>
    </button>`;
  }).join("")}</div>`);
}

function renderMoments() {
  const map = new Map();
  photosSorted().forEach((p) => {
    if (p.kind !== "photo") return;
    const key = `${p.date.toISOString().slice(0, 10)}|${p.city}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  });
  const moments = [...map.entries()].filter(([, arr]) => arr.length >= 2);
  overlay = { type: "moments" };
  return subPage("Moments", `<div class="coll-grid" style="padding-top:8px">${moments.map(([key, arr]) => {
    const [day, city] = key.split("|");
    const d = new Date(day + "T12:00:00");
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `<button type="button" class="coll-tile" data-moment="${key}">
      <img src="${arr[0].thumb}" alt="" />
      <div class="label"><b>${city}</b><span>${label} · ${arr.length}</span></div>
    </button>`;
  }).join("")}</div>`);
}

function canPrompt(photo) {
  if (!state.photoNotesEnabled) return false;
  if (state.promptedPhotoIds.includes(photo.id)) return false;
  if (state.notes[photo.id]) return false;
  return true;
}

function suggestionChips(photo) {
  const h = photo.date.getHours();
  const meal = h < 11 ? "Morning" : h < 15 ? "Lunch" : h < 17 ? "Afternoon" : "Evening";
  const dow = photo.date.toLocaleDateString("en-US", { weekday: "long" });
  const chips = [];
  chips.push(`${meal} at ${photo.place}`);
  if (photo.people[0]) chips.push(`${photo.people[0]} at ${photo.place}`);
  chips.push(`${dow} in ${photo.city}`);
  return [...new Set(chips)].slice(0, 3);
}

function clearPromptTimers() {
  clearTimeout(promptTimer);
  clearTimeout(fadeTimer);
  promptTimer = fadeTimer = null;
}

function ignorePrompt(photo, reason) {
  if (!promptVisible) return;
  promptVisible = false;
  promptExpanded = false;
  logEvent("prompt_ignored", { photoId: photo.id, reason });
  state.ignoredStreak += 1;
  if (state.ignoredStreak >= 3) {
    state.pauseUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
  saveState();
}

function schedulePrompt(photo) {
  clearPromptTimers();
  promptVisible = false;
  promptExpanded = false;
  promptNote = "";
  if (!canPrompt(photo)) return;
  promptTimer = setTimeout(() => {
    const key = todayKey();
    if (state.promptsDate !== key) {
      state.promptsDate = key;
      state.promptsToday = 0;
    }
    state.promptsToday += 1;
    state.promptedPhotoIds.push(photo.id);
    saveState();
    promptVisible = true;
    promptShownAt = Date.now();
    logEvent("prompt_shown", { photoId: photo.id });
    render();
    fadeTimer = setTimeout(() => {
      if (promptVisible && !promptExpanded) {
        ignorePrompt(photo, "timeout");
        render();
      }
    }, 5000);
  }, 1000);
}

function openViewer(id, list) {
  if (overlay?.type && overlay.type !== "viewer") returnTo = overlay;
  viewerList = list && list.length ? list : photosSorted();
  viewerIndex = viewerList.findIndex((p) => p.id === id);
  if (viewerIndex < 0) {
    viewerList = photosSorted();
    viewerIndex = viewerList.findIndex((p) => p.id === id);
  }
  overlay = { type: "viewer" };
  infoOpen = false;
  editingNote = false;
  toast = "";
  schedulePrompt(viewerList[viewerIndex]);
  render();
}

function closeViewer() {
  clearPromptTimers();
  const p = viewerList[viewerIndex];
  if (p && promptVisible && !promptExpanded) ignorePrompt(p, "close");
  overlay = returnTo;
  returnTo = null;
  viewerIndex = -1;
  promptVisible = false;
  render();
}

function swipeTo(delta) {
  const p = viewerList[viewerIndex];
  if (promptVisible) ignorePrompt(p, "swipe");
  const next = viewerIndex + delta;
  if (next < 0 || next >= viewerList.length) return;
  viewerIndex = next;
  infoOpen = false;
  editingNote = false;
  schedulePrompt(viewerList[viewerIndex]);
  render();
}

function renderCapture() {
  const photo = capturePhoto || photoById("p15");
  const suggestions = [
    `${photo.date.toLocaleDateString("en-US", { month: "long" })} at ${photo.place}`,
    `${photo.date.toLocaleDateString("en-US", { weekday: "long" })} in ${photo.city}`
  ];
  return `<div class="screen capture-screen" id="captureScreen">
    <img class="capture-image" src="${photo.src}" alt="Captured photo" draggable="false" />
    <button type="button" class="capture-back" id="captureBack" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></button>
    ${capturePillVisible ? (capturePillExpanded ? `
      <div class="capture-note expanded ${capturePillFading ? "fading" : ""}" id="captureNote">
        <div class="capture-suggestions">${suggestions.map((text) => `<button type="button" data-capture-suggestion="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("")}</div>
        <div class="capture-note-row">
          <input id="captureNoteInput" maxlength="60" value="${escapeHtml(captureNoteText)}" placeholder="Add a note" />
          <span class="counter" id="captureCounter">${captureNoteText.length}/60</span>
          <button type="button" class="capture-save" id="captureSave">Save</button>
        </div>
      </div>` : `
      <button type="button" class="capture-note ${capturePillFading ? "fading" : ""}" id="captureExpand"><span class="material-symbols-outlined">edit</span>Add a note</button>`)
    : ""}
    ${captureToast ? `<div class="capture-toast">${escapeHtml(captureToast)}</div>` : ""}
    <div class="capture-actions">
      <button type="button"><span class="material-symbols-outlined">share</span><small>Share</small></button>
      <button type="button"><span class="material-symbols-outlined">edit</span><small>Edit</small></button>
      <button type="button" id="captureDelete"><span class="material-symbols-outlined">delete</span><small>Delete</small></button>
    </div>
  </div>`;
}

function renderFloatingResults() {
  const clue = overlay.clue;
  const label = clue.label;
  const matches = floatingResults;
  return `<div class="screen floating-results">
    <div class="floating-results-top">
      <button type="button" class="icon-btn" id="floatingResultsBack" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></button>
      <div class="search-bar"><span class="token">${escapeHtml(label)}</span></div>
    </div>
    <div class="scroll">
      ${matches.length ? `<div class="grid3">${matches.map((match) => tileHTML(match.photo, { noteChip: true, noteMatch: match.noteMatch, resultId: match.photo.id })).join("")}</div>` : `<div class="empty">No matching photos.</div>`}
    </div>
  </div>`;
}

function renderViewer() {
  const p = viewerList[viewerIndex];
  const note = state.notes[p.id] || "";
  const chips = suggestionChips(p);
  return `
    <div class="screen viewer" id="viewer">
      <div class="vtop">
        <button type="button" class="icon-btn" id="closeViewer"><span class="material-symbols-outlined">close</span></button>
        <button type="button" class="icon-btn" id="openInfo"><span class="material-symbols-outlined">info</span></button>
      </div>
      <div class="vphoto" id="vphoto"><img src="${p.src}" alt="" draggable="false" /></div>
      ${promptVisible && !promptExpanded ? `<button type="button" class="note-prompt" id="expandPrompt">
        <span class="material-symbols-outlined">edit</span>Add a note
      </button>` : ""}
      ${promptVisible && promptExpanded ? `<div class="note-prompt exp">
        <div class="np-row">
          <span class="material-symbols-outlined">edit</span>
          <input id="noteInput" maxlength="60" placeholder="Add a note" value="${escapeHtml(promptNote)}" />
          <span class="counter">${promptNote.length}/60</span>
        </div>
        <div class="sug">${chips.map((c) => `<button type="button" data-sug="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("")}</div>
        <button type="button" class="np-save" id="saveNote">Save</button>
      </div>` : ""}
      ${toast ? `<div class="toast">${toast}</div>` : ""}
      <div class="vactions">
        <button type="button"><span class="material-symbols-outlined">share</span><small>Share</small></button>
        <button type="button"><span class="material-symbols-outlined">edit</span><small>Edit</small></button>
        <button type="button"><span class="material-symbols-outlined">document_scanner</span><small>Lens</small></button>
        <button type="button" id="openInfo2"><span class="material-symbols-outlined">more_horiz</span><small>More</small></button>
      </div>
      ${infoOpen ? renderInfo(p, note) : ""}
    </div>`;
}

function renderInfo(p, note) {
  const d = p.date.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  return `<div class="info-sheet" id="infoSheet">
    <div class="info-card">
      <div class="grab"></div>
      <h2>Info</h2>
      <div class="info-kv">${d}</div>
      <div class="info-kv">${escapeHtml(p.place)} · ${escapeHtml(p.city)}</div>
      ${p.people.length ? `<div class="info-kv">${p.people.join(", ")}</div>` : ""}
      <div class="note-box">
        ${editingNote ? `
          <div class="np-row">
            <input id="infoNoteInput" maxlength="60" value="${escapeHtml(note)}" />
            <span class="counter" id="infoCount">${note.length}/60</span>
          </div>
          <div class="note-actions">
            <button type="button" id="infoSave">Save</button>
            <button type="button" id="infoCancel">Cancel</button>
          </div>` : note ? `
          <p>${escapeHtml(note)}</p>
          <div class="note-actions">
            <button type="button" id="infoEdit">Edit</button>
            <button type="button" id="infoDelete">Delete</button>
          </div>` : `
          <p>No note</p>
          <div class="note-actions">
            <button type="button" id="infoEdit">Add note</button>
          </div>`}
      </div>
    </div>
  </div>`;
}

function renderSettings() {
  overlay = { type: "settings" };
  return `
    <div class="screen settings">
      <div class="subhead">
        <button type="button" class="icon-btn" id="backBtn"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1>Settings</h1>
      </div>
      <div class="set-row">
        <div>
          <div class="t">Photo notes</div>
          <div class="s">Suggest a short note on new photos</div>
        </div>
        <button type="button" class="toggle ${state.photoNotesEnabled ? "on" : ""}" id="notesToggle"><i></i></button>
      </div>
    </div>`;
}

function uniqueKeep(list, keyFn) {
  const seen = new Set();
  return list.filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildClueChips() {
  const pool = filterByChips(LIBRARY, searchChips, state.notes);
  const selected = new Set(searchChips.map((c) => c.group + ":" + c.value));
  const subjects = [];
  pool.forEach((photo) => {
    const note = state.notes[photo.id];
    if (note) subjects.push({ group: "Subject", value: note });
    (photo.tags || []).forEach((tag) => subjects.push({ group: "Subject", value: tag }));
  });
  return uniqueKeep(subjects, (clue) => clue.value.trim().toLowerCase())
    .filter((clue) => !selected.has(clue.group + ":" + clue.value))
    .slice(0, 4);
}

function buildAskStarters(clues) {
  const subjects = uniqueKeep(clues.map((clue) => clue.value.trim()).filter(Boolean), (value) => value.toLowerCase());
  const firstSubject = subjects[0] || "photos";
  const firstWord = firstSubject.split(/\s+/)[0];
  const phraseSubjects = subjects.length > 1 ? subjects.slice(0, 2).join(" ") : `${firstSubject} photos`;
  const starters = [
    `${firstWord[0].toUpperCase()}${firstWord.slice(1)}`,
    `${phraseSubjects[0].toUpperCase()}${phraseSubjects.slice(1)}`,
    `Find photos of ${phraseSubjects}`
  ];
  return uniqueKeep(starters.map((value) => ({ group: "Subject", value: value.slice(0, 52) })), (item) => item.value.toLowerCase()).slice(0, 3);
}

function resultsForSearch() {
  const typed = searchQuery.trim();
  const chipQ = searchChips.map((c) => c.value).join(" ");
  if (!typed && !searchChips.length) return [];
  const signature = `${typed}|${searchChips.map((c) => c.group + ":" + c.value).join(",")}`;
  if (semanticResultsSig === signature && semanticResults.length) {
    const byId = new Map(LIBRARY.map((photo) => [photo.id, photo]));
    const ranked = semanticResults.flatMap((match) => {
      const photo = byId.get(match.id);
      return photo ? [{ photo, total: 0, noteMatch: match.noteMatch }] : [];
    });
    if (ranked.length) return ranked;
  }
  return searchLibrary(LIBRARY, state.notes, [typed, chipQ].filter(Boolean).join(" "), searchChips, NOW);
}

function scheduleSemanticSearch() {
  const typed = searchQuery.trim();
  const chipQ = searchChips.map((c) => c.value).join(" ");
  const query = [typed, chipQ].filter(Boolean).join(" ");
  const signature = `${typed}|${searchChips.map((c) => c.group + ":" + c.value).join(",")}`;
  if (query.length < 3) {
    clearTimeout(semanticTimer);
    return;
  }
  if (signature === semanticRequestedSig) return;
  clearTimeout(semanticTimer);
  semanticRequestedSig = signature;
  semanticTimer = setTimeout(async () => {
    try {
      const response = await fetch("/api/photo-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          photos: LIBRARY.map((photo) => ({
            id: photo.id,
            date: photo.taken,
            place: photo.place,
            city: photo.city,
            people: photo.people,
            kind: photo.kind,
            tags: photo.tags,
            note: state.notes[photo.id] || ""
          }))
        })
      });
      if (!response.ok) return;
      const payload = await response.json();
      if (signature !== `${searchQuery.trim()}|${searchChips.map((c) => c.group + ":" + c.value).join(",")}`) return;
      semanticResults = Array.isArray(payload.matches) ? payload.matches : [];
      semanticResultsSig = signature;
      render();
    } catch {
      semanticResults = [];
      semanticResultsSig = "";
    }
  }, 350);
}

function renderSearch() {
  const typing = searchQuery.length > 0;
  const clues = typing ? [] : buildClueChips();
  const ac = typing ? autocomplete(LIBRARY, state.notes, searchQuery) : [];
  const results = resultsForSearch();
  scheduleSemanticSearch();
  if (results.length) hadResults = true;
  const qsig = searchQuery + "|" + searchChips.map((c) => c.value).join(",");
  if (lastQuerySig && qsig !== lastQuerySig && (searchQuery || searchChips.length)) {
    logEvent("query_reformulated", { from: lastQuerySig, to: qsig });
  }
  lastQuerySig = qsig;

  return `
    <div class="screen search-screen">
      <div class="search-top">
        <div class="search-bar">
          <button type="button" class="icon-btn" id="closeSearch"><span class="material-symbols-outlined">arrow_back</span></button>
          <div class="tokens">
            ${searchChips.map((c, i) => `<span class="token">${escapeHtml(c.value)}<button type="button" data-rm="${i}"><span class="material-symbols-outlined" style="font-size:16px">close</span></button></span>`).join("")}
          </div>
          <input id="searchInput" type="search" placeholder="${searchMode === "ask" ? "Ask about your photos" : "Search your photos"}" value="${escapeHtml(searchQuery)}" autocomplete="off" />
        </div>
        <div class="mode-toggle">
          <button type="button" class="${searchMode === "search" ? "on" : ""}" data-mode="search">Search</button>
          <button type="button" class="${searchMode === "ask" ? "on" : ""}" data-mode="ask">Ask</button>
        </div>
      </div>
      <div class="scroll">
        ${searchMode === "ask" && !typing && !searchChips.length ? `
          <div class="ask-hint">Start from a clue</div>
          <div class="ask-starters">
            ${buildAskStarters(clues).map((c) => `<button type="button" data-chip="${escapeHtml(c.value)}" data-group="${c.group}" title="${escapeHtml(c.value)}">${escapeHtml(c.value)}</button>`).join("")}
          </div>` : ""}
        ${searchMode === "search" && !typing ? `<div class="chip-row" id="clueRow">
          ${clues.map((c) => `<button type="button" class="clue" data-chip="${escapeHtml(c.value)}" data-group="${c.group}">${escapeHtml(c.value)}</button>`).join("")}
        </div>` : ""}
        ${typing ? `<div class="ac-list">${ac.map((a) => `<button type="button" class="ac-item" data-ac="${escapeHtml(a.label)}" data-group="${a.group}">
          <span class="material-symbols-outlined">search</span>${escapeHtml(a.label)}
        </button>`).join("")}</div>` : ""}
        ${results.length ? `<div class="grid3" style="padding:8px 2px 24px">
          ${results.map((r) => tileHTML(r.photo, { noteChip: true, noteMatch: r.noteMatch })).join("")}
        </div>` : ""}
      </div>
    </div>`;
}

function render() {
  if (overlay?.type === "viewer") app.innerHTML = renderViewer();
  else if (overlay?.type === "capture") app.innerHTML = renderCapture();
  else if (overlay?.type === "floating-results") app.innerHTML = renderFloatingResults();
  else if (overlay?.type === "search") app.innerHTML = renderSearch();
  else if (overlay?.type === "settings") app.innerHTML = renderSettings();
  else if (overlay?.type === "notes") app.innerHTML = renderNotesPage();
  else if (overlay?.type === "people") app.innerHTML = renderPeople();
  else if (overlay?.type === "places") app.innerHTML = renderPlaces();
  else if (overlay?.type === "albums") app.innerHTML = renderAlbums();
  else if (overlay?.type === "moments") app.innerHTML = renderMoments();
  else if (overlay?.type === "grid") app.innerHTML = renderSimpleGrid(overlay.title, overlay.list);
  else if (tab === "photos") app.innerHTML = renderPhotos();
  else if (tab === "collections") app.innerHTML = renderCollections();
  else app.innerHTML = renderCreate();

  bind();
}

function openSearch() {
  hideFloatingClues("search");
  overlay = { type: "search" };
  searchQuery = "";
  searchChips = [];
  searchMode = "search";
  searchOpenedAt = Date.now();
  hadResults = false;
  lastQuerySig = "";
  chipImpressLogged = false;
  foundInSearch = false;
  semanticResults = [];
  semanticResultsSig = "";
  semanticRequestedSig = "";
  clearTimeout(semanticTimer);
  logEvent("search_opened");
  render();
  const clues = buildClueChips();
  if (clues.length && !chipImpressLogged) {
    logEvent("chip_impression", { count: clues.length, groups: [...new Set(clues.map((c) => c.group))] });
    chipImpressLogged = true;
  }
  const input = document.getElementById("searchInput");
  if (input) {
    input.focus();
  }
}

function clearCaptureTimers() {
  clearTimeout(capturePromptTimer);
  clearTimeout(captureFadeTimer);
  clearTimeout(captureDismissTimer);
  capturePromptTimer = null;
  captureFadeTimer = null;
  captureDismissTimer = null;
}

function hideFloatingClues(reason) {
  clearTimeout(floatingChipTimer);
  floatingChipTimer = null;
  if (!floatingCluesVisible) return;
  if (reason === "timeout") {
    floatingCluesFading = true;
    render();
    floatingChipTimer = setTimeout(() => {
      floatingCluesVisible = false;
      floatingCluesFading = false;
      floatingCluesConsumed = true;
      floatingChipTimer = null;
      render();
    }, 350);
    return;
  }
  floatingCluesVisible = false;
  floatingCluesFading = false;
  floatingCluesConsumed = true;
  if (reason === "scroll") render();
}

function clueLabel(value) {
  const chars = [...String(value || "")];
  return chars.length > 22 ? `${chars.slice(0, 21).join("")}…` : chars.join("");
}

function buildFloatingClues() {
  const list = [];
  const notedPhoto = photosSorted().find((photo) => state.notes[photo.id]);
  const contextPhoto = notedPhoto || capturePhoto || photosSorted()[0];
  const latestNote = notedPhoto ? state.notes[notedPhoto.id] : "";
  if (latestNote) list.push({ group: "Subject", value: latestNote, label: clueLabel(latestNote), photoId: notedPhoto.id });
  (contextPhoto.tags || []).forEach((tag) => {
    list.push({ group: "Subject", value: tag, label: clueLabel(tag), photoId: contextPhoto.id });
  });
  return uniqueKeep(list, (clue) => clue.value.toLowerCase()).slice(0, 4);
}

function showFloatingClues() {
  clearTimeout(floatingChipTimer);
  if (overlay || tab !== "photos" || !state.clueChipsEnabled || floatingCluesConsumed) return;
  floatingClues = buildFloatingClues();
  floatingCluesFading = false;
  floatingCluesVisible = floatingClues.length > 0;
  if (!floatingCluesVisible) return;
  floatingCluesShownAt = Date.now();
  logEvent("floating_chip_shown", { count: floatingClues.length });
  render();
  floatingChipTimer = setTimeout(() => hideFloatingClues("timeout"), 8000);
}

function openCapture() {
  clearTimeout(floatingChipTimer);
  clearTimeout(floatingReturnTimer);
  clearTimeout(captureToastTimer);
  floatingCluesVisible = false;
  floatingCluesConsumed = false;
  capturePhoto = LIBRARY[0];
  captureNoteText = "";
  captureNoteSource = "typed";
  capturePillVisible = false;
  capturePillExpanded = false;
  capturePillFading = false;
  captureToast = "";
  clearCaptureTimers();
  overlay = { type: "capture" };
  render();
  capturePromptTimer = setTimeout(() => {
    if (overlay?.type !== "capture") return;
    capturePillVisible = true;
    capturePillFading = false;
    capturePromptStartedAt = Date.now();
    logEvent("pill_shown", { photoId: capturePhoto.id });
    render();
    captureFadeTimer = setTimeout(() => {
      if (overlay?.type === "capture" && capturePillVisible && !capturePillExpanded) {
        capturePillFading = true;
        render();
        captureDismissTimer = setTimeout(() => {
          if (overlay?.type !== "capture" || !capturePillVisible || capturePillExpanded) return;
          capturePillVisible = false;
          capturePillFading = false;
          captureDismissTimer = null;
          logEvent("pill_ignored", { photoId: capturePhoto.id, reason: "timeout" });
          render();
        }, 350);
      }
    }, 5000);
  }, 1000);
}

function returnToLibrary(reason = "back") {
  clearCaptureTimers();
  clearTimeout(captureToastTimer);
  if (capturePillVisible) {
    logEvent("pill_ignored", { photoId: capturePhoto?.id, reason });
  }
  capturePillVisible = false;
  capturePillExpanded = false;
  capturePillFading = false;
  captureNoteText = "";
  captureToast = "";
  overlay = null;
  tab = "photos";
  render();
  clearTimeout(floatingReturnTimer);
  floatingReturnTimer = setTimeout(showFloatingClues, 1000);
}

function openFloatingClue(index) {
  const clue = floatingClues[index];
  if (!clue) return;
  hideFloatingClues();
  logEvent("floating_chip_tap", { group: clue.group, value: clue.value });
  floatingSearchStartedAt = Date.now();
  floatingResults = searchLibrary(LIBRARY, state.notes, clue.value, [{ group: clue.group, value: clue.value }], NOW);
  overlay = { type: "floating-results", clue };
  render();
}

function saveCaptureNote() {
  const text = captureNoteText.trim().slice(0, 60);
  if (!text || !capturePhoto) return;
  state.notes[capturePhoto.id] = text;
  saveState();
  logEvent("note_saved", {
    photoId: capturePhoto.id,
    source: captureNoteSource,
    length: text.length,
    seconds_to_save: Math.round((Date.now() - capturePromptStartedAt) / 100) / 10
  });
  clearTimeout(captureFadeTimer);
  clearTimeout(captureDismissTimer);
  capturePillVisible = false;
  capturePillExpanded = false;
  capturePillFading = false;
  captureToast = "Note saved";
  render();
  clearTimeout(captureToastTimer);
  captureToastTimer = setTimeout(() => {
    captureToast = "";
    render();
  }, 2000);
}

function closeSearch(abandoned = true) {
  if (abandoned && !foundInSearch) logEvent("search_abandoned", { ms: Date.now() - searchOpenedAt });
  overlay = null;
  render();
}

function addChip(group, value) {
  if (searchChips.some((c) => c.value === value && c.group === group)) return;
  searchChips.push({ group, value });
  searchQuery = "";
  logEvent("chip_tap", { group, value });
  logEvent("query_typed_or_chip_built", { chips: searchChips.map((c) => c.value), typed: "" });
  render();
  document.getElementById("searchInput")?.focus();
}

function bind() {
  document.querySelectorAll("[data-tab]").forEach((b) => {
    b.onclick = () => { tab = b.dataset.tab; overlay = null; menuOpen = false; render(); };
  });
  document.getElementById("searchFab")?.addEventListener("click", openSearch);
  document.querySelectorAll("[data-floating-clue]").forEach((button) => {
    button.addEventListener("click", () => openFloatingClue(Number(button.dataset.floatingClue)));
  });
  document.getElementById("mainScroll")?.addEventListener("scroll", () => hideFloatingClues("scroll"), { once: true, passive: true });
  document.getElementById("captureBack")?.addEventListener("click", () => returnToLibrary("back"));
  document.getElementById("captureDelete")?.addEventListener("click", () => returnToLibrary("delete"));
  document.getElementById("captureExpand")?.addEventListener("click", () => {
    capturePillExpanded = true;
    capturePillFading = false;
    clearTimeout(captureFadeTimer);
    clearTimeout(captureDismissTimer);
    captureDismissTimer = null;
    logEvent("pill_expanded", { photoId: capturePhoto.id });
    render();
    document.getElementById("captureNoteInput")?.focus();
  });
  document.getElementById("captureNoteInput")?.addEventListener("input", (event) => {
    captureNoteText = event.target.value.slice(0, 60);
    captureNoteSource = "typed";
    const counter = document.getElementById("captureCounter");
    if (counter) counter.textContent = `${captureNoteText.length}/60`;
  });
  document.querySelectorAll("[data-capture-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      captureNoteText = button.dataset.captureSuggestion.slice(0, 60);
      captureNoteSource = "chip";
      const input = document.getElementById("captureNoteInput");
      if (input) input.value = captureNoteText;
      const counter = document.getElementById("captureCounter");
      if (counter) counter.textContent = `${captureNoteText.length}/60`;
    });
  });
  document.getElementById("captureSave")?.addEventListener("click", saveCaptureNote);
  document.getElementById("floatingResultsBack")?.addEventListener("click", () => { overlay = null; render(); });
  document.querySelectorAll("[data-edit-note-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const photoId = button.dataset.editNoteRow;
      notesEditingPhotoId = photoId;
      notesEditingDraft = state.notes[photoId] || "";
      render();
      const input = document.querySelector(`[data-note-draft="${photoId}"]`);
      input?.focus();
      input?.select();
    });
  });
  document.querySelectorAll("[data-note-draft]").forEach((input) => {
    input.addEventListener("input", () => { notesEditingDraft = input.value.slice(0, 60); });
  });
  document.querySelectorAll("[data-save-note-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const photoId = button.dataset.saveNoteRow;
      const note = notesEditingDraft.trim().slice(0, 60);
      if (note) state.notes[photoId] = note;
      else delete state.notes[photoId];
      saveState();
      notesEditingPhotoId = "";
      notesEditingDraft = "";
      render();
    });
  });
  document.querySelectorAll("[data-cancel-note-row]").forEach((button) => {
    button.addEventListener("click", () => {
      notesEditingPhotoId = "";
      notesEditingDraft = "";
      render();
    });
  });
  const captureImage = document.querySelector(".capture-image");
  if (captureImage) bindCaptureSwipe(captureImage);
  document.getElementById("moreBtn")?.addEventListener("click", () => { menuOpen = !menuOpen; render(); });
  document.getElementById("avatarBtn")?.addEventListener("click", () => {
    overlay = { type: "settings" }; menuOpen = false; render();
  });
  document.getElementById("openSettings")?.addEventListener("click", () => {
    overlay = { type: "settings" }; menuOpen = false; render();
  });
  document.getElementById("backBtn")?.addEventListener("click", () => {
    if (overlay?.type === "grid" && overlay.from) {
      overlay = { type: overlay.from };
      render();
      return;
    }
    overlay = null;
    render();
  });
  document.getElementById("notesToggle")?.addEventListener("click", () => {
    state.photoNotesEnabled = !state.photoNotesEnabled;
    saveState();
    render();
  });
  document.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-open");
      let list = photosSorted();
      if (overlay?.type === "floating-results") {
        const match = floatingResults.find((result) => result.photo.id === id);
        logEvent("result_tap", { photoId: id, note_match: !!match?.noteMatch });
        logEvent("time_to_find", { ms: Date.now() - floatingSearchStartedAt, photoId: id });
        list = floatingResults.map((result) => result.photo);
      } else if (overlay?.type === "search") {
        const results = resultsForSearch();
        const hit = results.find((r) => r.photo.id === id);
        logEvent("result_tap", { photoId: id, note_match: !!(hit && hit.noteMatch) });
        logEvent("time_to_find", { ms: Date.now() - searchOpenedAt, photoId: id });
        foundInSearch = true;
        list = results.map((r) => r.photo);
      } else if (overlay?.type === "notes") {
        list = photosSorted().filter((p) => state.notes[p.id]);
      } else if (overlay?.type === "grid" && overlay.list) {
        list = overlay.list;
      }
      openViewer(id, list);
    });
  });
  document.querySelectorAll("[data-coll]").forEach((el) => {
    el.addEventListener("click", () => openCollection(el.getAttribute("data-coll")));
  });
  document.querySelectorAll("[data-person]").forEach((el) => {
    el.addEventListener("click", () => {
      const n = el.getAttribute("data-person");
      const list = photosSorted().filter((p) => p.people.includes(n));
      overlay = { type: "grid", title: n, list, from: "people" };
      renderOverlay();
    });
  });
  document.querySelectorAll("[data-place]").forEach((el) => {
    el.addEventListener("click", () => {
      const n = el.getAttribute("data-place");
      overlay = { type: "grid", title: n, list: photosSorted().filter((p) => p.city === n), from: "places" };
      renderOverlay();
    });
  });
  document.querySelectorAll("[data-album]").forEach((el) => {
    el.addEventListener("click", () => {
      const n = el.getAttribute("data-album");
      overlay = { type: "grid", title: n, list: photosSorted().filter((p) => p.album === n), from: "albums" };
      renderOverlay();
    });
  });
  document.querySelectorAll("[data-moment]").forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.getAttribute("data-moment");
      const [day, city] = key.split("|");
      const list = photosSorted().filter((p) => p.date.toISOString().slice(0, 10) === day && p.city === city && p.kind === "photo");
      overlay = { type: "grid", title: city, list, from: "moments" };
      renderOverlay();
    });
  });

  document.getElementById("closeViewer")?.addEventListener("click", closeViewer);
  document.getElementById("openInfo")?.addEventListener("click", () => { infoOpen = true; render(); });
  document.getElementById("openInfo2")?.addEventListener("click", () => { infoOpen = true; render(); });
  document.getElementById("infoSheet")?.addEventListener("click", (e) => {
    if (e.target.id === "infoSheet") { infoOpen = false; editingNote = false; render(); }
  });
  document.getElementById("expandPrompt")?.addEventListener("click", () => {
    promptExpanded = true;
    clearTimeout(fadeTimer);
    logEvent("prompt_expanded", { photoId: viewerList[viewerIndex].id });
    render();
    document.getElementById("noteInput")?.focus();
  });
  document.getElementById("noteInput")?.addEventListener("input", (e) => {
    promptNote = e.target.value.slice(0, 60);
    const c = document.querySelector(".counter");
    if (c) c.textContent = `${promptNote.length}/60`;
  });
  document.querySelectorAll("[data-sug]").forEach((b) => {
    b.addEventListener("click", () => {
      promptNote = b.getAttribute("data-sug").slice(0, 60);
      noteSourceHint = "chip";
      const input = document.getElementById("noteInput");
      if (input) input.value = promptNote;
      const c = document.querySelector(".counter");
      if (c) c.textContent = `${promptNote.length}/60`;
    });
  });
  document.getElementById("saveNote")?.addEventListener("click", savePromptNote);
  document.getElementById("infoEdit")?.addEventListener("click", () => {
    editingNote = true;
    render();
    document.getElementById("infoNoteInput")?.focus();
  });
  document.getElementById("infoCancel")?.addEventListener("click", () => { editingNote = false; render(); });
  document.getElementById("infoSave")?.addEventListener("click", () => {
    const p = viewerList[viewerIndex];
    const v = (document.getElementById("infoNoteInput")?.value || "").slice(0, 60);
    if (v) state.notes[p.id] = v;
    else delete state.notes[p.id];
    saveState();
    editingNote = false;
    render();
  });
  document.getElementById("infoDelete")?.addEventListener("click", () => {
    const p = viewerList[viewerIndex];
    delete state.notes[p.id];
    saveState();
    render();
  });
  document.getElementById("infoNoteInput")?.addEventListener("input", (e) => {
    const c = document.getElementById("infoCount");
    if (c) c.textContent = `${e.target.value.length}/60`;
  });

  const vp = document.getElementById("vphoto");
  if (vp) bindSwipe(vp);

  document.getElementById("closeSearch")?.addEventListener("click", () => closeSearch(true));
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.addEventListener("click", () => { searchMode = b.dataset.mode; render(); document.getElementById("searchInput")?.focus(); });
  });
  const si = document.getElementById("searchInput");
  if (si && overlay?.type === "search") {
    si.addEventListener("input", () => {
      searchQuery = si.value;
      logEvent("query_typed_or_chip_built", { typed: searchQuery, chips: searchChips.map((c) => c.value) });
      render();
      const n = document.getElementById("searchInput");
      if (n) {
        n.focus();
        n.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  }
  document.querySelectorAll("[data-chip]").forEach((b) => {
    b.addEventListener("click", () => addChip(b.getAttribute("data-group"), b.getAttribute("data-chip")));
  });
  document.querySelectorAll("[data-rm]").forEach((b) => {
    b.addEventListener("click", () => {
      searchChips.splice(Number(b.getAttribute("data-rm")), 1);
      render();
    });
  });
  document.querySelectorAll("[data-ac]").forEach((b) => {
    b.addEventListener("click", () => {
      addChip(b.getAttribute("data-group"), b.getAttribute("data-ac"));
    });
  });
}

function renderOverlay() {
  if (overlay?.type === "grid") app.innerHTML = renderSimpleGrid(overlay.title, overlay.list);
  else if (overlay?.type === "notes") app.innerHTML = renderNotesPage();
  else if (overlay?.type === "people") app.innerHTML = renderPeople();
  else if (overlay?.type === "places") app.innerHTML = renderPlaces();
  else if (overlay?.type === "albums") app.innerHTML = renderAlbums();
  else if (overlay?.type === "moments") app.innerHTML = renderMoments();
  bind();
}

function openCollection(key) {
  if (key === "notes") { overlay = { type: "notes" }; render(); return; }
  if (key === "people") { overlay = { type: "people" }; render(); return; }
  if (key === "places") { overlay = { type: "places" }; render(); return; }
  if (key === "albums") { overlay = { type: "albums" }; render(); return; }
  if (key === "moments") { overlay = { type: "moments" }; render(); return; }
  if (key === "documents") {
    overlay = { type: "grid", title: "Documents", list: photosSorted().filter((p) => p.kind === "document" || p.kind === "receipt"), from: null };
    renderOverlay(); return;
  }
  if (key === "screenshots") {
    overlay = { type: "grid", title: "Screenshots", list: photosSorted().filter((p) => p.kind === "screenshot"), from: null };
    renderOverlay(); return;
  }
  if (key === "favorites") {
    overlay = { type: "grid", title: "Favorites", list: photosSorted().filter((p) => p.favorite), from: null };
    renderOverlay(); return;
  }
  if (key === "trash") {
    overlay = { type: "grid", title: "Trash", list: [], from: null };
    renderOverlay(); return;
  }
}

function savePromptNote() {
  const p = viewerList[viewerIndex];
  const text = promptNote.trim().slice(0, 60);
  if (!text) return;
  const chips = suggestionChips(p);
  const source = chips.includes(text) ? "chip" : "typed";
  state.notes[p.id] = text;
  state.ignoredStreak = 0;
  saveState();
  logEvent("note_saved", {
      photoId: p.id,
      source: noteSourceHint || source,
      length: text.length,
      seconds_to_save: promptShownAt ? Math.round((Date.now() - promptShownAt) / 100) / 10 : 0
    });
    noteSourceHint = "";
  promptVisible = false;
  promptExpanded = false;
  toast = "Note saved";
  render();
  setTimeout(() => { toast = ""; render(); }, 1400);
}

function bindSwipe(el) {
  let x0 = 0;
  el.addEventListener("pointerdown", (e) => { x0 = e.clientX; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointerup", (e) => {
    const dx = e.clientX - x0;
    if (dx < -48) swipeTo(1);
    else if (dx > 48) swipeTo(-1);
  });
}

function bindCaptureSwipe(el) {
  let x0 = 0;
  let y0 = 0;
  el.addEventListener("pointerdown", (event) => {
    x0 = event.clientX;
    y0 = event.clientY;
    el.setPointerCapture(event.pointerId);
  });
  el.addEventListener("pointerup", (event) => {
    const dx = event.clientX - x0;
    const dy = event.clientY - y0;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) returnToLibrary("swipe");
  });
}

document.getElementById("resetBtn").onclick = () => {
  clearCaptureTimers();
  clearTimeout(floatingChipTimer);
  clearTimeout(floatingReturnTimer);
  clearTimeout(captureToastTimer);
  state = defaultState();
  saveState();
  overlay = null;
  tab = "photos";
  capturePillVisible = false;
  capturePillExpanded = false;
  captureToast = "";
  floatingCluesVisible = false;
  floatingCluesConsumed = false;
  floatingClues = [];
  const clueToggle = document.getElementById("clueToggle");
  clueToggle.setAttribute("aria-pressed", "true");
  clueToggle.textContent = "Clue chips: on";
  render();
  renderLog();
};

document.getElementById("seedBtn").onclick = () => {
  const p = LIBRARY.find((x) => x.id === "p15") || LIBRARY[0];
  state.notes[p.id] = "Perch Sunday meet";
  saveState();
  render();
  renderLog();
};

document.getElementById("simulateBtn").onclick = openCapture;
document.getElementById("clueToggle").onclick = (event) => {
  state.clueChipsEnabled = !state.clueChipsEnabled;
  event.currentTarget.setAttribute("aria-pressed", String(state.clueChipsEnabled));
  event.currentTarget.textContent = `Clue chips: ${state.clueChipsEnabled ? "on" : "off"}`;
  if (!state.clueChipsEnabled) hideFloatingClues();
  saveState();
  render();
};

document.getElementById("clueToggle").setAttribute("aria-pressed", String(state.clueChipsEnabled));
document.getElementById("clueToggle").textContent = `Clue chips: ${state.clueChipsEnabled ? "on" : "off"}`;
render();
renderLog();
