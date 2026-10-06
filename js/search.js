const CONCEPTS = {
  cafe: ["cafe", "coffee", "coffeehouse", "perch", "artisan", "espresso", "bakery", "bistro", "latte", "brunch", "lunch"],
  meetup: ["meetup", "meet", "meeting", "gathering", "hangout", "catchup", "catch-up", "sunday", "friends"],
  portland: ["portland", "oregon", "alberta", "powell", "forest park", "washington park"],
  seattle: ["seattle", "pike", "elliott", "fremont", "cherry street"],
  goa: ["goa", "calangute", "anjuna", "baga", "panaji", "beach"],
  chicago: ["chicago", "bean", "millennium", "riverwalk"],
  sf: ["san francisco", "francisco", "golden gate", "dolores", "mission", "ferry"],
  tokyo: ["tokyo", "shibuya", "senso", "tsukiji", "ueno", "shinjuku"],
  london: ["london", "borough", "thames", "regent"],
  jaipur: ["jaipur", "diwali", "hawa", "amber", "palace", "festival", "lights"],
  dog: ["dog", "luna", "pet", "walk"],
  family: ["dad", "family", "home"],
  food: ["pizza", "dinner", "breakfast", "sweets", "market"],
  travel: ["airport", "boarding", "transit"],
  document: ["document", "lease", "receipt", "boarding", "paper"],
  screenshot: ["screenshot", "maps", "tickets", "transit"]
};

const STOP = new Set(["the", "a", "an", "in", "at", "on", "of", "to", "and", "or", "for", "with", "from", "my", "our"]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && t.length > 1);
}

function conceptHits(tokens) {
  const hits = new Set();
  const blob = tokens.join(" ");
  for (const [name, words] of Object.entries(CONCEPTS)) {
    if (words.some((w) => blob.includes(w) || tokens.includes(w))) hits.add(name);
  }
  return hits;
}

function photoText(photo, note) {
  return [
    note || "",
    photo.place,
    photo.city,
    photo.people.join(" "),
    photo.kind,
    photo.album || "",
    (photo.tags || []).join(" "),
    photo.pet ? "pet dog luna" : ""
  ].join(" ");
}

function parseWhen(tokens, now) {
  const blob = tokens.join(" ");
  const year = tokens.find((t) => /^20\d{2}$/.test(t));
  let start = null;
  let end = null;
  if (blob.includes("today")) {
    start = new Date(now); start.setHours(0, 0, 0, 0);
    end = new Date(now); end.setHours(23, 59, 59, 999);
  } else if (blob.includes("yesterday")) {
    start = new Date(now); start.setDate(start.getDate() - 1); start.setHours(0, 0, 0, 0);
    end = new Date(start); end.setHours(23, 59, 59, 999);
  } else if (blob.includes("last month") || tokens.includes("month") && tokens.includes("last")) {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (blob.includes("this month")) {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (blob.includes("last summer") || (tokens.includes("summer") && tokens.includes("last"))) {
    start = new Date(now.getFullYear(), 5, 1);
    end = new Date(now.getFullYear(), 7, 31, 23, 59, 59, 999);
  } else if (blob.includes("diwali")) {
    start = new Date("2025-10-18");
    end = new Date("2025-10-22T23:59:59");
  } else if (year) {
    start = new Date(Number(year), 0, 1);
    end = new Date(Number(year), 11, 31, 23, 59, 59, 999);
  } else {
    const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    const mi = months.findIndex((m) => blob.includes(m) || blob.includes(m.slice(0, 3)));
    if (mi >= 0) {
      const y = blob.includes("2024") ? 2024 : blob.includes("2025") ? 2025 : now.getFullYear();
      start = new Date(y, mi, 1);
      end = new Date(y, mi + 1, 0, 23, 59, 59, 999);
    }
  }
  return { start, end };
}

function scorePhoto(photo, note, query, chips, now) {
  const q = tokenize([query, ...(chips || []).map((c) => c.value)].join(" "));
  if (!q.length) return 0;
  const text = photoText(photo, note).toLowerCase();
  const pTokens = tokenize(text);
  const qConcepts = conceptHits(q);
  const pConcepts = conceptHits(pTokens);
  let overlap = 0;
  qConcepts.forEach((c) => { if (pConcepts.has(c)) overlap += 1; });
  let keyword = 0;
  for (const t of q) {
    if (text.includes(t)) keyword += 1.2;
    else if (pTokens.some((p) => p.startsWith(t) || t.startsWith(p))) keyword += 0.5;
  }
  const noteText = (note || "").toLowerCase();
  let noteScore = 0;
  if (noteText) {
    const nTok = tokenize(noteText);
    const nCon = conceptHits(nTok);
    qConcepts.forEach((c) => { if (nCon.has(c)) noteScore += 2.4; });
    for (const t of q) {
      if (noteText.includes(t)) noteScore += 2;
    }
    if (qConcepts.has("cafe") && /perch|artisan|coffee|cafe|lunch/.test(noteText)) noteScore += 3;
    if (qConcepts.has("meetup") && /meet|sunday|hang|gather/.test(noteText)) noteScore += 3;
  }
  const when = parseWhen(q, now);
  let timeScore = 0;
  if (when.start) {
    const d = photo.date;
    timeScore = d >= when.start && d <= when.end ? 2.5 : -4;
  }
  const kindChip = (chips || []).find((c) => c.group === "Kind");
  let kindScore = 0;
  if (kindChip) {
    const v = kindChip.value.toLowerCase();
    if (v.includes("screenshot")) kindScore = photo.kind === "screenshot" ? 4 : -5;
    else if (v.includes("receipt")) kindScore = photo.kind === "receipt" ? 4 : -5;
    else if (v.includes("document")) kindScore = photo.kind === "document" || photo.kind === "receipt" ? 4 : -5;
  }
  const semantic = overlap * 1.6 + keyword + noteScore;
  const total = semantic + timeScore + kindScore;
  const noteMatch = noteScore >= 2.4 || (noteText && q.some((t) => noteText.includes(t)));
  return { total, noteMatch, noteScore };
}

function searchLibrary(photos, notes, query, chips, now) {
  const q = (query || "").trim();
  if (!q && (!chips || !chips.length)) return [];
  const ranked = photos.map((p) => {
    const s = scorePhoto(p, notes[p.id] || "", q, chips, now);
    return { photo: p, ...s };
  }).filter((r) => r.total > 1.2);
  ranked.sort((a, b) => {
    if (a.noteMatch !== b.noteMatch) return Number(b.noteMatch) - Number(a.noteMatch);
    if (a.noteScore !== b.noteScore) return b.noteScore - a.noteScore;
    return b.total - a.total;
  });
  return ranked;
}

function autocomplete(photos, notes, typed) {
  const t = typed.trim().toLowerCase();
  if (!t) return [];
  const set = [];
  const add = (label, group) => {
    if (!label.toLowerCase().includes(t)) return;
    if (set.some((x) => x.label === label)) return;
    set.push({ label, group });
  };
  photos.forEach((p) => {
    (p.tags || []).forEach((tag) => add(tag, "Subject"));
    const n = notes[p.id];
    if (n) add(n, "Subject");
  });
  return set.slice(0, 8);
}

function monthLabel(d) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function filterByChips(photos, chips, notes = {}) {
  if (!chips.length) return photos;
  return photos.filter((p) => chips.every((c) => {
    const v = c.value.toLowerCase();
    if (c.group === "Who") return p.people.some((n) => n.toLowerCase() === v);
    if (c.group === "Where") return p.city.toLowerCase() === v || p.place.toLowerCase() === v;
    if (c.group === "Kind") {
      if (v === "screenshots") return p.kind === "screenshot";
      if (v === "documents") return p.kind === "document";
      if (v === "receipts") return p.kind === "receipt";
    }
    if (c.group === "When") {
      const s = scorePhoto(p, "", c.value, [c], NOW);
      return s.total > 0;
    }
    if (c.group === "Subject") {
      const note = (notes[p.id] || "").toLowerCase();
      return note.includes(v) || (p.tags || []).some((tag) => tag.toLowerCase() === v);
    }
    if (c.group === "From your notes") {
      const n = (notes[p.id] || "").toLowerCase();
      return n && (n === v || n.includes(v) || v.includes(n));
    }
    return (p.place + p.city + p.people.join(" ")).toLowerCase().includes(v);
  }));
}
