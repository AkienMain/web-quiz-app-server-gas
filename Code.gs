function doGet(e) {
  try{

    var func = e.parameter.func;

    switch(func){
      case "getData":
      return getData(e);
      break;

      case "sendResult":
      return sendResult(e);
      break;

      case "getSheetNames":
      return getSheetNames(e);
      break;

      default:
      return ContentService.createTextOutput("0\t0\tError\t0\t0");
      break;
    }
  } catch(err) {
    Logger.log(err);
    return ContentService.createTextOutput("0\t0\tError\t0\t0");
  }
}

function getSheet(e) {
  try{
    var sheetName = e.parameter.sheetName;
    var spreadsheetId = e.parameter.spreadsheetId;
    return SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  } catch {
    return null;
  }
}

function getData(e) {
  var isRunnning = true;
  var row = 1;
  var str = "";

  while (isRunnning) {
    try {
      var sheet = getSheet(e);
      var range = sheet.getRange(row,1,1,5);
      var values = range.getValues();
      if (range.isBlank()) {
        isRunnning = false;
      } else {
        if (row > 1) str += "\n";
        for (i = 0; i < values[0].length; i++) {
          str += values[0][i];
          if (i < values[0].length-1) str += "\t";
        }
      }
      row += 1;
    }
    catch(err) {
      Logger.log(err);
      isRunnning = false;
      return ContentService.createTextOutput("0\t0\tError\t0\t0");
    }
  }
  return ContentService.createTextOutput(str);
}

function sendResult(e) {
  try{
    var sheet = getSheet(e);
    sheet.getRange(parseInt(e.parameter.index)+1,1)
    .setValues([[parseInt(e.parameter.correct)]]);
    sheet.getRange(parseInt(e.parameter.index)+1,2)
    .setValues([[parseInt(e.parameter.total)]]);
  } catch(err) {
    Logger.log(err);
    return ContentService.createTextOutput("Error");
  }
  return ContentService.createTextOutput("Sended");
}

function getSheetNames(e) {
  var sheetNames = [];
  try{
    var spreadsheetId = e.parameter.spreadsheetId;
    var sheets = SpreadsheetApp.openById(spreadsheetId).getSheets();
    for (var i = 0; i < sheets.length; i++) {
      sheetNames.push(sheets[i].getName());
    }
  } catch(err) {
    Logger.log(err);
    return ContentService.createTextOutput("");
  }
  return ContentService.createTextOutput(sheetNames.toString());
}

function testGetData() {
  var eventObject = {
      "parameter": {
        "func": "getData",
        "spreadsheetId": "1x6S9YuGaWFpyFIwLl3EXBtH1P32GPfE4T4iKdAVGBTg",
        "sheetName": "math1"
      }
    }
  Logger.log(doGet(eventObject).getContent());
}

function testSendResult() {
  var eventObject = {
      "parameter": {
        "func": "sendResult",
        "spreadsheetId": "1x6S9YuGaWFpyFIwLl3EXBtH1P32GPfE4T4iKdAVGBTg",
        "sheetName": "math1",
        "index": "0",
        "correct": "0",
        "total": "1"
      }
    }
  Logger.log(doGet(eventObject).getContent());
}

function testGetSheetNames() {
  var eventObject = {
      "parameter": {
        "func": "getSheetNames",
        "spreadsheetId": "1x6S9YuGaWFpyFIwLl3EXBtH1P32GPfE4T4iKdAVGBTg"
      }
    }
  Logger.log(doGet(eventObject).getContent());
}
