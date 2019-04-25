import fs from 'fs';
import path from 'path';
import moment from 'moment';

// 來源資料夾
const SourcePath = './src/data';

class Worker {
  constructor(stage, fileName, min = 5) {
    // stage 資料夾名稱
    this.stage = stage;
    // 檔案名稱
    this.fileName = fileName;
    // 切割單位時間
    this.min = min;
    // 來源檔案(讀取用)
    this.sourceFile = path.resolve(SourcePath, stage, 'ecg', fileName);
    // 輸出資料夾
    this.exportPath = path.resolve('./out', this.stage, 'ecg');
    // 內容
    this.content = '';
  }

  static SourcePath() {
    return SourcePath;
  }

  // 開始工作
  run() {
    this.read();
  }

  // 開始讀檔
  read() {
    // 讀取檔案
    const readStream = fs.createReadStream(this.sourceFile);

    readStream.setEncoding('utf8');

    readStream.on('data', chunk => {
      this.content += chunk;
    });

    readStream.on('end', () => {
      this.process();
      console.log(`${this.stage} - ${this.fileName}`);
    });
  }

  // 開始轉換成 DAT
  process() {
    let files = [];
    try { files = JSON.parse(this.content); }
    catch (e) { console.log(e); }

    files = files.map(({ data, time }) => {
      // 需要轉格式，讓 Matlab 吃進去
      time = moment(time).format('YYYYMMDDTHHmmss.SSS');
      return (data === null ? 0 : data + ' ' + time) + '\r\n';
    }).join('');
    this.write(files);
  }

  /**
   * 寫檔案
   * @param {string} files 檔案內容
   */
  write(files = '') {
    // 如果沒有輸出資料夾就建立
    if (!fs.existsSync(path.resolve('./out', this.stage))) fs.mkdirSync(path.resolve('./out', this.stage));
    if (!fs.existsSync(this.exportPath)) fs.mkdirSync(this.exportPath);

    const exportFile = `${this.fileName.replace('.json', '')}.dat`;
    // console.log('Writing file: ' + OUTPUT_FILE);
    const FILE = path.resolve(this.exportPath, exportFile);
    const writeStram = fs.createWriteStream(FILE);

    writeStram.write(files);
    writeStram.end();
  }

}

export default Worker;