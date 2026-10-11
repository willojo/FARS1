// Run with: node test.js
const assert = require("assert");
const fs = require("fs");

// Load the logic straight from the <script id="team-logic"> block in index.html.
const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const code = html.match(/<script id="team-logic">([\s\S]*?)<\/script>/)[1];
const { parseNames, generateTeams } = new Function(code + "\nreturn TeamGenerator;")();

const names = parseNames("A\nB, C;D\n\n  E  \nF\nG\nH\nI\nJ");
assert.deepStrictEqual(names, ["A","B","C","D","E","F","G","H","I","J"]);

// Exact fit: 10 names, 5 per team, 2 teams
let r = generateTeams(names, 5, 2);
assert.strictEqual(r.teams.length, 2);
r.teams.forEach(t => assert.strictEqual(t.length, 5));
assert.deepStrictEqual(r.teams.flat().sort(), [...names].sort());

// Too few slots: 3 teams of 2 -> 4 unassigned
r = generateTeams(names, 2, 3);
assert.strictEqual(r.teams.length, 3);
r.teams.forEach(t => assert.strictEqual(t.length, 2));
assert.strictEqual(r.unassigned.length, 4);
assert.deepStrictEqual([...r.teams.flat(), ...r.unassigned].sort(), [...names].sort());

// Spare slots: balanced sizes (4 teams of up to 5 -> 3,3,2,2)
r = generateTeams(names, 5, 4);
assert.deepStrictEqual(r.teams.map(t => t.length).sort(), [2,2,3,3]);
assert.strictEqual(r.unassigned.length, 0);

// Derive count from size, and size from count
r = generateTeams(names, 3, "");
assert.strictEqual(r.teamCount, 4);
r = generateTeams(names, "", 3);
assert.strictEqual(r.teamSize, 4);
assert.deepStrictEqual(r.teams.map(t => t.length).sort(), [3,3,4]);

// Validation
assert.throws(() => generateTeams([], 2, 2), /at least one name/);
assert.throws(() => generateTeams(names, "", ""), /or both/);
assert.throws(() => generateTeams(names, 0, 2), /Persons per team/);
assert.throws(() => generateTeams(names, 2, 1.5), /Number of teams/);

// Randomness: order should vary across runs
const seen = new Set();
for (let i = 0; i < 50; i++) seen.add(generateTeams(names, 5, 2).teams.flat().join());
assert.ok(seen.size > 1);

console.log("All tests passed");
