#!/usr/bin/env node
// Lint rule: replace em-dashes (—) with " - " in staged .njk files.
// Runs via lint-staged in pre-commit hook.

const fs = require("fs");

const files = process.argv.slice(2);
let fixed = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("\u2014")) {
    // Replace " — " first, then any remaining bare em-dashes
    const replaced = content.replaceAll(" \u2014 ", " - ").replaceAll("\u2014", " - ");
    fs.writeFileSync(file, replaced, "utf8");
    fixed++;
    console.log(`Fixed em-dash in ${file}`);
  }
}

if (fixed > 0) {
  console.error(
    `\nReplaced em-dashes in ${fixed} file(s). Changes have been applied - please review and re-stage.`,
  );
  process.exit(1);
}
