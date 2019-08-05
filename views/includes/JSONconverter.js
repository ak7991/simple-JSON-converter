//Selecting the input field that accepts a file
const in2 = document.getElementById('excel-file');
//Intialize an event handler on change
in2.addEventListener('change', getFile);
var fileExtension = "";

//Getting the file
function getFile(event) {

    const input = event.target; //The 'drop-box'

  if ('files' in input) {

    fileExtension = in2.value.split('.')[in2.value.split('.').length - 1];

    if( fileExtension === 'csv' || fileExtension === 'txt' || fileExtension === 'xlsx'){
      //Sending the file to a fucntion that places it on the HTML page if valid and non-empty
      if(input.files.length > 0){
        placeFileContent(document.getElementById('content-target'), input.files[0], true);
      }
      //Empty File
      else{
        placeFileContent(document.getElementById('content-target'), 'Empty File', false);
      }
    }
    //Non-supported format
    else{
      placeFileContent(document.getElementById('content-target'), 'Invalid format', false);
    }
  }
}

//Placing the content of the input file to a desired target on the HTML page
function placeFileContent(target, file, conversionPossible) {

if(fileExtension == 'xlsx'){
  console.log('getting converted...');
  file = handleExcelSelect(file);
  console.log(file);
  console.log('converted');
}

  if(conversionPossible){
    console.log(fileExtension)
    //Sending the file to a function that will return the text inside the file
    readFileContent(file)
    .then(content => {
      if(fileExtension === 'xlsx'){
        console.log('xls');
        content = handleExcelSelect(file);
      }
      target.value = JSONparse2(content);
      target.style.border = "3px solid lightgreen";
    })
    .catch(error => console.log(error));
  }
  //Print invalid file format
  else{
    //Print error sent
    target.style.border = "3px solid firebrick";
    target.value = `<${file}>`;
  
}
}


/*
JSON object type#2: Single object with array values
{
key: [value, value, value],
key: [value, value, value],
key: [value, value, value]}
}
*/
function JSONparse2(str){
  const entries = str.split('\n'); //Split by rows

  let returnJSON = "{"; //Start array (of objects)

  const entriesNum = entries.length; //Number of entries

  //Populate JSON by iterating values
  for(let i = 0; i < entriesNum; i++){
    let entry = entries[i];
    let prop = entry.split(',')[0]; //First value as property
    let vals = entry.split(',').slice(1);

    let temp = `"${prop.trim()}": [`;
    vals.forEach( elem => {temp += `"${elem.trim()}", `});
    temp = temp.slice(0, temp.length-2); //Truncate last comma
    temp += "],\n";

    returnJSON += temp; //add to JSON
  }
    returnJSON = returnJSON.slice(0, returnJSON.length-2); //Truncate last comma

  returnJSON += "\n}"; //Start object
  return returnJSON
}



var ExcelToCSV = function() {

  //Defining a method to parse the excel file
    this.parseExcel = function(file) {
      var reader = new FileReader();

      console.log(file);
      reader.onload = function(e) {

        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
            console.log(data);
        workbook.SheetNames.forEach(function(sheetName) {
          //CSV conversion
          var XL_CSV_converted = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          console.log(XL_CSV_converted);
        })
      };

      reader.onerror = function(error) {
        console.log(error);
      };

      // reader.readAsBinaryString(file);
    };
  };

  function handleExcelSelect(file) {
    var xl2csv = new ExcelToCSV();
    return xl2csv.parseExcel(file);
  }


function readFileContent(file) {
    const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}