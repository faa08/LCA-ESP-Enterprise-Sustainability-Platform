const fs = require('fs');
const path = require('path');

const replacements = {
  '\u00e2\u20ac\u201d': '—',
  '\u00e2\u20ac\u201c': '–',
  '\u00e2\u2020\u2019': '→',
  '\u00e2\u201a\u201a': '₂',
  '\u00e2\u2030\u00a5': '≥',
  '\u00e2\u2030\u00a4': '≤',
  '\u00c2\u00b7': '·',
  '\u00c3\u2014': '×',
  '\u00c2\u00b3': '³'
};

const regexes = [
  { search: /\u00e2\u0161\u00a0\u00ef\u00b8\u008f?/g, replace: '⚠️' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          changed = true;
        }
      }
      
      for (const {search, replace} of regexes) {
        if (search.test(content)) {
          content = content.replace(search, replace);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
