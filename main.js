
// Function requests data for all trains for current day
function getTrainData(){

  var url = "https://rata.digitraffic.fi/api/v1/trains/" + getToday();

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // Data is placd in a global variable to make it easily accessible by other functions
      trainData = JSON.parse(xmlhttp.responseText);
      console.log("got train data");
      // Once the data is received the value of the first option is changed
      // and the dropdown is enabled
      $("#firstOption").html("Select station");
      $("#dropdown").prop("disabled", false);

    }
  }
}


// function is used to select data matching the selected station
function getCommuterTrains(stationCode) {

  // Get the station name from the dropdown
  var table = "<h3>" + "Trains from " + $("#dropdown").val() + "</h3>";
  table += "<table class='table'>";

  table += "<thead>";
  table += "<tr>";
  table += "<th>" + "Destination" + "</th>";
  table += "<th>" + "Train" + "</th>";
  table += "<th>" + "Track" + "</th>";
  table += "<th>" + "Departure" + "</th>";
  table += "</tr>";
  table += "</thead>";

  // Iterate through the data and find time table entries for stations where the train stops and time table type is departure
  for (var i = 0; i < trainData.length; i++) {
    for (var j = 0; j < trainData[i].timeTableRows.length; j++) {
      if (trainData[i].timeTableRows[j].stationShortCode == stationCode && trainData[i].timeTableRows[j].trainStopping == true &&  trainData[i].timeTableRows[j].type == "DEPARTURE") {
        console.log(trainData[i]);

          table += "<tr>";
          // Finds the station name using the station short code
          table += "<td>" + getDestination(trainData[i].timeTableRows[trainData[i].timeTableRows.length-1].stationShortCode) + "</td>";
          // Check if commuter line ID is empty, if it is use train type and train number
          if (trainData[i].commuterLineID == "") {
            table += "<td>" + trainData[i].trainType + trainData[i].trainNumber + "</td>";
          }else {
            table += "<td>" + trainData[i].commuterLineID + "</td>";
          }
          // Checks if the train is cancelled
          if (trainData[i].cancelled == true) {
            table += "<td>" + "cancelled" + "</td>";
          }else {
            table += "<td>" + trainData[i].timeTableRows[j].commercialTrack + "</td>";
          }
          // Function return the departure time
          table += "<td>" + getTime(trainData[i].timeTableRows[j].scheduledTime) + "</td>";


          table += "</tr>";

      }
    }
  }
  table += "</table>";
  $("#table").html(table);
}


// Function returns the station name matching the received short code
function getDestination(id){
  for (var i = 0; i < stationList.length; i++) {
    if (stationList[i].stationShortCode == id){
      return stationList[i].stationName;
    }
  }
}



// Function returns the departure time of the train from the received date
function getTime(time) {
  var newTime = new Date(time);
  var hours = newTime.toString();
  var departureTime = hours.substring(16, 21);
  return departureTime;
}


// Function is used to get the current year, month and day and return it in
// correct format when requesting train data
function getToday(){
  var year = new Date();
  year = year.getFullYear();

  var month = new Date();
  month = month.getUTCMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }

  var day = new Date();
  day = day.getUTCDate();
  if (day < 10) {
    day = "0" + day;
  }

  var date = year + "-" + month + "-" + day;
  console.log(date);
  return date;
}


// Function requests the list of stations
function getStationList(){
  // Disable the dropdown to prevent the app from crashing if the station is selected before trein data is received
  $("#dropdown").prop("disabled", true);

  var url = "https://rata.digitraffic.fi/api/v1/metadata/stations";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      stationList = JSON.parse(xmlhttp.responseText);
      // Crete a new option for each station
      // Uncommenting the if statement lists only passenger stations
      for (var i = 0; i < stationList.length; i++) {
        // if (stationList[i].passengerTraffic == true) {
          var option = document.createElement("option");
          option.setAttribute("value", stationList[i].stationName);
          option.appendChild(document.createTextNode(stationList[i].stationName));
          dropdown.appendChild(option);
        // }
      }
    }
  }
}


// Function gets the station short code from the station list and then
// Calls the getCommuterTrains function with the code
function getStationCode(){

  var input = $("#dropdown").val();
  console.log(input);

  for(var i = 0; i < stationList.length; i++){
    if (stationList[i].stationName == input) {
      console.log(stationList[i].stationShortCode);
      var stationCode = stationList[i].stationShortCode;
      getCommuterTrains(stationCode);
    }
  }
}
