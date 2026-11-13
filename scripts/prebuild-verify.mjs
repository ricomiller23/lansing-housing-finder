import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib'];

const BANNED_WORD_RE = /\b(verified|certified|exhaustive|audited|parity|accurate)\b|100%|\bzero\b|\bcomplete\b/i;
const PLACEHOLDER_URL_RE = /https?:\/\/(?:www\.)?(?:example\.com|finvault\.io)|href\s*=\s*["']#["']/i;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const errors = [];

for (const sub of SCAN_DIRS) {
  const fullDir = path.join(ROOT, sub);
  if (!fs.existsSync(fullDir)) continue;
  for (const file of walk(fullDir)) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const strippedIdentifiers = line
        .replace(/lincolnParity/g, '')
        .replace(/computeLincolnParity/g, '')
        .replace(/minLincolnParity/g, '')
        .replace(/hideBelowParity/g, '');

      const m = strippedIdentifiers.match(BANNED_WORD_RE);
      if (m) {
        errors.push(`[Banned word "${m[0]}"] ${rel}:${idx + 1}: ${line.trim()}`);
      }
      if (PLACEHOLDER_URL_RE.test(line)) {
        errors.push(`[Placeholder URL] ${rel}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
}

// Check single-source dataset receipts in lib/providers/rentcast.ts
const rentcastSrc = fs.readFileSync(path.join(ROOT, 'lib/providers/rentcast.ts'), 'utf8');
if (!rentcastSrc.includes('url:') || !rentcastSrc.includes('sourceType:')) {
  errors.push('lib/providers/rentcast.ts must attach url and sourceType to every listing');
}

// Ensure every property surface exposes external property website & photo links
const requiredExternalLinkViews = [
  'components/ListingCard.tsx',
  'components/TableView.tsx',
  'components/MapView.tsx',
  'components/CompareDrawer.tsx',
  'app/listing/[id]/page.tsx',
];
for (const viewRel of requiredExternalLinkViews) {
  const src = fs.readFileSync(path.join(ROOT, viewRel), 'utf8');
  if (!src.includes('target="_blank"') || !src.includes('gallery_url')) {
    errors.push(`${viewRel} must render an external property website/photo link using gallery_url`);
  }
}

if (errors.length > 0) {
  console.error('Pre-build check failed:\n' + errors.join('\n'));
  process.exit(1);
}

console.log('Pre-build source receipt & claim check passed.');
