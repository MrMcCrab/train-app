function getData() {

  var url = "https://rata.digitraffic.fi/api/v1/trains/2017-12-08";

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var data = JSON.parse(xmlhttp.responseText);
      var parsedData;

      for (var i = 0; i < data.length; i++) {
        if (data[i].trainType == "HL" && data[i].runningCurrently == true) {
          console.log(data[i])
        }
      }

      // console.log(parsedData);
      // console.log(data)
    }
  }



}
