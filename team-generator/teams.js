// Core logic for the random team generator. Works in the browser
// (exposes window.TeamGenerator) and in Node (module.exports) for testing.
(function (root) {
  "use strict";

  function parseNames(text) {
    return String(text || "")
      .split(/[\n,;]+/)
      .map(function (n) { return n.trim(); })
      .filter(function (n) { return n.length > 0; });
  }

  function randomInt(max) {
    var c = root.crypto || (typeof require === "function" ? require("crypto").webcrypto : null);
    if (c && c.getRandomValues) {
      var buf = new Uint32Array(1);
      c.getRandomValues(buf);
      return buf[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function toPositiveInt(value) {
    if (value === null || value === undefined || value === "") return null;
    var n = Number(value);
    if (!Number.isInteger(n) || n < 1) return NaN;
    return n;
  }

  // Splits `names` into random teams.
  // - teamCount and teamSize may each be omitted; the missing one is derived.
  // - Members are dealt round-robin so team sizes differ by at most one.
  // - If teamCount * teamSize is smaller than the number of names, the
  //   extra people are returned in `unassigned`.
  function generateTeams(names, teamSize, teamCount) {
    var size = toPositiveInt(teamSize);
    var count = toPositiveInt(teamCount);

    if (!names || names.length === 0) throw new Error("Enter at least one name.");
    if (Number.isNaN(size)) throw new Error("Persons per team must be a whole number of at least 1.");
    if (Number.isNaN(count)) throw new Error("Number of teams must be a whole number of at least 1.");
    if (size === null && count === null) throw new Error("Enter persons per team, number of teams, or both.");

    if (count === null) count = Math.ceil(names.length / size);
    if (size === null) size = Math.ceil(names.length / count);

    var shuffled = shuffle(names);
    var capacity = size * count;
    var placed = shuffled.slice(0, capacity);
    var unassigned = shuffled.slice(capacity);

    var teams = [];
    for (var t = 0; t < count; t++) teams.push([]);
    placed.forEach(function (name, i) { teams[i % count].push(name); });

    return { teams: teams, unassigned: unassigned, teamSize: size, teamCount: count };
  }

  var api = { parseNames: parseNames, shuffle: shuffle, generateTeams: generateTeams };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TeamGenerator = api;
})(typeof window !== "undefined" ? window : globalThis);
