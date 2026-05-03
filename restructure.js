const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');
const localeDir = path.join(srcAppDir, '[locale]');

// Create [locale] directory and subdirectories
const dirsToCreate = [
  localeDir,
  path.join(localeDir, 'chat'),
  path.join(localeDir, 'asha'),
  path.join(localeDir, 'ivrs'),
  path.join(localeDir, 'phc-map'),
  path.join(localeDir, 'analytics'),
  path.join(localeDir, 'whatsapp'),
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Move files
const filesToMove = [
  { from: 'page.tsx', to: 'page.tsx' },
  { from: 'layout.tsx', to: 'layout.tsx' },
  { from: 'chat/page.tsx', to: 'chat/page.tsx' },
  { from: 'asha/page.tsx', to: 'asha/page.tsx' },
  { from: 'ivrs/page.tsx', to: 'ivrs/page.tsx' },
  { from: 'phc-map/page.tsx', to: 'phc-map/page.tsx' },
  { from: 'analytics/page.tsx', to: 'analytics/page.tsx' },
];

filesToMove.forEach(({ from, to }) => {
  const fromPath = path.join(srcAppDir, from);
  const toPath = path.join(localeDir, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
  }
});

console.log('Restructured successfully.');
