import fs from 'fs';
import path from 'path';
import Worker from './Worker';
import moment from 'moment';
// import 'moment-timezone';

// 毫秒轉換與差異用於 NN HRV 計算
// const date1 = moment('2019-03-24T10:08:29.415').format('YYYYMMDDTHHmmss.SSS');
// const date2 = moment('2019-03-24T10:08:30.341').format('YYYYMMDDTHHmmss.SSS');
// const ndate = moment(date2).diff(date1);


const Path = Worker.SourcePath();

// 取得來源資料夾所有結構與檔案
// 資料夾結構範例：
// 3 - ecg - a.json
//         - b.json
//   - emg - c.json
//         - d.json
// 4 - ecg - e.json
// ...
const Jobs = fs.readdirSync(Path)
  .filter(p => p !== '.DS_Store')
  .map(p => (
    {
      stage: p,
      files: fs
        .readdirSync(path.resolve(Path, p, 'ecg'))
        .filter(file => file !== '.DS_Store' && String(file).includes('.json'))
    }
  ));

// console.log(Jobs);

// 批次處理每個資料夾內的所有檔案
Jobs.forEach(job => job.files.map(file => new Worker(job.stage, file, 5).run()));
