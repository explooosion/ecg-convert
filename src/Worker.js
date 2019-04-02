import fs from 'fs';
import path from 'path';
import moment from 'moment';

class Worker {

  constructor(pathName, parentPathName, fileName) {
    // 來源母目錄 - ./src/data
    this.pathName = pathName;
    // 來源目錄名稱
    this.parentPathName = parentPathName;
    // 來源與輸出檔名(使用同一個名稱)
    this.fileName = fileName;
    // 來源檔案(讀取用)
    this.file = path.resolve(pathName, parentPathName, fileName);
    // 輸出資料夾
    this.exportPath = path.resolve('./out', this.parentPathName);
    // 內容
    this.content = '';
  }

  run() {
    // 開始讀檔
    this.read();
  }

  read() {
    // 讀取檔案
    const readStream = fs.createReadStream(this.file);

    readStream.setEncoding('utf8');

    readStream.on('data', chunk => {
      this.content += chunk;
    });

    readStream.on('end', () => {
      this.parseDAT();
      this.parseJSON();
      console.log(`Files - ${this.fileName}`);
    });
  }

  /**
   * 
   * @param {string} extension 
   */
  write(files = '', extension = '.js') {
    // 如果沒有輸出資料夾就建立
    if (!fs.existsSync(this.exportPath)) fs.mkdirSync(this.exportPath);

    const exportFile = `${this.fileName.replace('.js', '')}${extension}`;
    // console.log('Writing file: ' + OUTPUT_FILE);
    const FILE = path.resolve(this.exportPath, exportFile);
    const writeStram = fs.createWriteStream(FILE);
    writeStram.write(files);
    writeStram.end();
  }

  parseJSON() {
    // console.log('Processing file.');
    let files = this.content
      .replace('const csv = ', '')
      .replace('; export default csv;', '');

    // Parse to JSON
    try {
      files = JSON.stringify(JSON.parse(files));
      this.write(files, '.json');
    } catch (e) {
      console.log('error', e);
    }
  }

  parseDAT() {
    // console.log('Processing file.');
    let files = this.content
      .replace('const csv = ', '')
      .replace('; export default csv;', '');

    // Parse to JSON
    try {
      files = JSON.parse(files).map(({ data }) => (data === null ? 0 : data) + '\r\n').join('');
      this.write(files, '.dat');
    } catch (e) {
      console.log('error', e);
    }
  }
}

export default Worker;