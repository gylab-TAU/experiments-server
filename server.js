const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const Excel = require('exceljs');

app.get('/', (req, res) => {

  //console.log(path.dirname());
  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet('My Sheet');
  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 32 },
    { header: 'D.O.B.', key: 'DOB', width: 10 }
  ];
    worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

    var dir = 'C:/Users/Ron/Desktop/work/newfolder';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    workbook.csv.writeFile('C:/Users/Ron/Desktop/work/newfolder/temp.csv').then(function () {
      // done
      console.log('file is written');
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});