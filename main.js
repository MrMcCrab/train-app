function getCommuterTrains(stationCode) {

  var url = "https://rata.digitraffic.fi/api/v1/trains/" + getToday();
  console.log("get " + stationCode);

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      $("select").html=("Select station");
      var data = JSON.parse(xmlhttp.responseText);

      table = "<h3>" + "Commuter trains from " + $("#dropdown").val() + "</h3>";
      table += "<table class='table'>";

      table += "<thead>";
      table += "<tr>";
      table += "<th>" + "Destination" + "</th>";
      table += "<th>" + "Train" + "</th>";
      table += "<th>" + "Track" + "</th>";
      table += "<th>" + "Departure" + "</th>";
      table += "</tr>";
      table += "</thead>";

      for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].timeTableRows.length; j++) {
            if (data[i].timeTableRows[j].stationShortCode == stationCode && data[i].timeTableRows[j].trainStopping == true && data[i].trainType == "HL" && data[i].timeTableRows[j].type == "DEPARTURE") {
              console.log(data[i]);

                table += "<tr>";

                table += "<td>" + getDestination(data[i].timeTableRows[data[i].timeTableRows.length-1].stationShortCode) + "</td>";
                table += "<td>" + data[i].commuterLineID + "</td>";
                table += "<td>" + data[i].timeTableRows[j].commercialTrack + "</td>";
                table += "<td>" + getTime(data[i].timeTableRows[j].scheduledTime) + "</td>";

                table += "</tr>";

            }
          }
          // console.log(data[i]);
        // }
      }
      // console.log(data)
      table += "</table>";
      $("#table").html(table);
    }
  }
}



function getDestination(id){
  for (var i = 0; i < stationList.length; i++) {
    if (stationList[i].stationShortCode == id){
        return stationList[i].stationName;
    }
  }
}



function getCurrentHour(){
  var time = new Date();
  var currentHour = time.toISOString();
  currentHour = currentHour.substr(11, 5);
  console.log(currentHour);
}



function getTime(time) {
  // 2017-12-09T22:05:00.000Z
  let hours = time.substring(11, 16);
  return hours;
}



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



function getStationList(){

  var url = "https://rata.digitraffic.fi/api/v1/metadata/stations";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      stationList = JSON.parse(xmlhttp.responseText);

      for (var i = 0; i < stationList.length; i++) {
        if (stationList[i].passengerTraffic == true) {
          var option = document.createElement("option");
          option.setAttribute("value", stationList[i].stationName);
          option.appendChild(document.createTextNode(stationList[i].stationName));
          dropdown.appendChild(option);
        }
      }
    }
  }
}



function getStationCode(){

  var input = $("#dropdown").val();
  console.log(input);

  // console.log(stationList);
  for(var i = 0; i < stationList.length; i++){
    if (stationList[i].stationName == input) {
      console.log(stationList[i].stationShortCode);
      var stationCode = stationList[i].stationShortCode;
      getCommuterTrains(stationCode);
    }
  }
}
