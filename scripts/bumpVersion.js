const fs = require('fs');
const path = require('path');


function isFolder(p) {
  return fs.statSync(p).isDirectory();
}

function adjustFolderPackageJson(dir, version) {
  const fileName = path.join(dir, 'package.json');
  if (!fs.existsSync(fileName)) {
    return;
  }
  const fileContent = fs.readFileSync(fileName).toString();
  const newContent = fileContent.replace(/("version":\s+").*(")/g, `$1${version}$2`);
  fs.writeFileSync(fileName, newContent);
}

function bumpVersion(dir, version) {
  const sanitizedVersion = version.trim();
  if (sanitizedVersion.length < 1) {
    return;
  }

  adjustFolderPackageJson(dir, sanitizedVersion);
}

bumpVersion(process.cwd(), process.argv[2]);
