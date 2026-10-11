# Random Team Generator

A small browser app that splits a list of names into random teams.

## Usage

Open `index.html` in any browser (no install or server needed).

1. Enter names, one per line or separated by commas/semicolons.
2. Set **Persons per team** and **Number of teams**. You can leave one blank
   and it is worked out from the other.
3. Click **Generate teams**. Click again to reshuffle, or **Copy results** to
   copy the teams as text.

How teams are filled:

- Names are shuffled (Fisher–Yates using the browser's secure random generator)
  and dealt round-robin, so team sizes differ by at most one.
- If there are more names than `teams × persons per team`, the extras are
  listed under **Not assigned**.
- If there are fewer names, teams are left smaller (or empty) and a notice is shown.

## Tests

```
node test.js
```
