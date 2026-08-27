const fs = require('fs-extra');
const path = require('path');
const template = process.argv[2];



const source = path.join(__dirname, '..', template);
const target = path.join(__dirname, '..', 'active-template');

if (!template) {
  console.log('Template name missing');
  process.exit();
}

fs.removeSync('./src/active-template');


fs.copySync(source, target);

console.log(`${template} copied successfully`);