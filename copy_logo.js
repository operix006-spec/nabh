const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\6f2a5c68-bf62-49e7-b69e-c7750abda1ef\\.user_uploaded\\media_1788942153271.png';
const dest = path.join(__dirname, 'public', 'logo.png');

if (fs.existsSync(src)) {
  if (!fs.existsSync(path.dirname(dest))) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log('✓ Logo copied successfully to:', dest);
} else {
  console.error('✗ Source logo not found:', src);
}
