const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

console.log("Running build test...");

try {
  execSync("npx @11ty/eleventy", { cwd: root, stdio: "pipe" });
} catch (err) {
  console.error("BUILD FAILED:", err.stderr?.toString() || err.message);
  process.exit(1);
}

const siteDir = path.join(root, "_site");

const checks = ["en/index.html", "en/articles/hello-world/index.html", "css/style.css"];

let passed = 0;
let failed = 0;

for (const file of checks) {
  const filePath = path.join(siteDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
    passed++;
  } else {
    console.error(`  ✗ ${file} — NOT FOUND`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

console.log("Build test passed.");
