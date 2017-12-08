function getCommuterTrains() {

  var url = "https://rata.digitraffic.fi/api/v1/trains/2017-12-08";

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var data = JSON.parse(xmlhttp.responseText);

      for (var i = 0; i < data.length; i++) {
        if (data[i].trainType == "HL") {
          for (var j = 0; j < data[i].timeTableRows.length; j++) {
            if (data[i].timeTableRows[j].stationShortCode == "JP") {
              console.log(data[i]);
            }
          }
          // console.log(data[i]);
        }
      }
      // console.log(data)
    }
  }
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
        var option = document.createElement("option");
        option.setAttribute("value", stationList[i].stationName);
        option.appendChild(document.createTextNode(stationList[i].stationName));
        dropdown.appendChild(option);
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
    }
  }
}
