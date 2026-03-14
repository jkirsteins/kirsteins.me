const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteDir = path.join(root, "_site");

// Build first
try {
  execSync("npx @11ty/eleventy", { cwd: root, stdio: "pipe" });
} catch (err) {
  console.error("BUILD FAILED:", err.stderr?.toString() || err.message);
  process.exit(1);
}

// Collect all HTML files
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

// Extract internal href values from HTML
function extractLinks(html) {
  const links = [];
  const re = /href="([^"]*?)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const href = match[1];
    // Skip external links, anchors, mailto, tel
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      continue;
    }
    links.push(href);
  }
  return links;
}

// Resolve a link to a file path in _site
function resolveLink(href) {
  let target = href.split("?")[0].split("#")[0];
  if (target.endsWith("/")) {
    target += "index.html";
  }
  return path.join(siteDir, target);
}

console.log("Checking internal links...\n");

const htmlFiles = findHtmlFiles(siteDir);
let passed = 0;
let failed = 0;

for (const file of htmlFiles) {
  const rel = path.relative(siteDir, file);
  const html = fs.readFileSync(file, "utf-8");
  const links = extractLinks(html);

  for (const href of links) {
    const resolved = resolveLink(href);
    if (fs.existsSync(resolved)) {
      passed++;
    } else {
      console.error(
        `  ✗ ${rel}: broken link "${href}" (expected ${path.relative(siteDir, resolved)})`,
      );
      failed++;
    }
  }
}

console.log(`${passed} links OK, ${failed} broken`);

if (failed > 0) {
  process.exit(1);
}

console.log("All internal links valid.");
