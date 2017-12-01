$(document).ready(function () {

  /* Esto es para la grafica*/
  var timeData = [],
    contadorData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Contador',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: contadorData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Datos del contrador en litros cada 15 minutos',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        ticks: {
            beginAtZero:true
        }
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.dato_contador) {
        return;
      }
      timeData.push(obj.time);
      contadorData.push(obj.dato_contador);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        contadorData.shift();
      }

      console.log("Llegue hasta aca: ", obj.dato_contador);

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
  /* -----------------------------------  */

  let prom = 0;
  let sumaTotal = 0;
  let sumaMes = 0;
  let i = 0;
  let j = 0;
  let k = 0;
  while(i < datos.length){
    while(j < datos[i].semanas.length){
      while(k < datos[i].semanas[j].dias.length){
        sumaTotal += datos[i].semanas[j].dias[k].litros;
        sumaMes += datos[i].semanas[j].dias[k].litros;
        k++;
      }
      k = 0;
      j++;
    }
    $("#mes"+i).html(sumaMes);
    sumaMes = 0;
    j = 0;
    i++;
  }

  prom = (sumaTotal/12).toFixed(2);

  $("#prom_mes").html(prom);
});
