const fs = require('fs');
const path = require('path');

// 递归遍历目录的函数
function traverseDir(dirPath, callback) {
  fs.readdirSync(dirPath).forEach(item => {
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath, callback); // 如果是目录，则递归遍历
    } else {
      callback(fullPath); // 如果是文件，则执行回调函数
    }
  });
}

// 处理单个文件的函数
function processFile(filePath) {
  if (path.extname(filePath) === '.html') {
    const dirPath = path.dirname(filePath);
    const fileNameWithoutExt = path.basename(filePath, '.html');
    const newFilePath = path.join(dirPath, `${fileNameWithoutExt}-html.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Reading file: ${filePath} had an error: ${err}`);
      } else {
        fs.writeFile(newFilePath, data, err => {
          if (err) {
            console.error(`Writing file: ${newFilePath} had an error: ${err}`);
          } else {
            console.log(`File: ${fileNameWithoutExt}.html converted to ${fileNameWithoutExt}-html.json`);
          }
        });
      }
    });
  }
}

// 定义起始目录
const sourceDir = path.join(__dirname, '../../public');

console.log('开始处理...');
traverseDir(sourceDir, processFile);