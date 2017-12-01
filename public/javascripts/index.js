$(document).ready(function () {

  /* Esto es para la grafica*/
  var timeData = [],
    contadorData = [];
  var data = {
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
      text: 'Consumo de agua medido en el sensor',
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

  /* Promedio por mes */
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
    $("#mes"+(i+1)).html(sumaMes);
    sumaMes = 0;
    j = 0;
    i++;
  }

  prom = (sumaTotal/12).toFixed(2);

  $("#prom_mes").html(prom);
  /* -------------- */


  /* Promedio por semana */
  const container = document.getElementById("semana");
  let div;
  let div2;
  let table;
  let sumaSemana = 0;
  prom = 0;
  sumaTotal = 0;
  i = 0;
  j = 0;
  k = 0;

  while(i < datos.length){
    div =  document.createElement("div");
    div.innerHTML = datos[i].mes;
    div.className  = "titleMes";
    container.appendChild(div);
    while(j < datos[i].semanas.length){
      table = `
        <table border='1' class='tablaSemana'> 
          <tr>
            <td><b>Domingo</b></td>
            <td><b>Lunes</b></td>
            <td><b>Martes</b></td>
            <td><b>Miercoles</b></td>
            <td><b>Jueves</b></td>
            <td><b>Viernes</b></td>
            <td><b>Sabado</b></td>
            <td><b>Promedio</b></td>
          </tr>
          <tr>
      `;
      while(k < datos[i].semanas[j].dias.length){
        //console.log(datos[i].semanas[j].dias.length, "k------>"+k)
        sumaSemana += datos[i].semanas[j].dias[k].litros;
        table += `
            <td>${datos[i].semanas[j].dias[k].litros}</td>
        `;
       k++;
      }

      console.log(datos[i].mes+"------------->",k);

      if(k <= 6){
        while(k < 7){
          table += `
            <td></td>
          `;
          k++;
        }
      }
      table += `
            <td>${(sumaSemana/7).toFixed(2)}</td>
          </tr>
        </table>
      `;
      console.log("table-------------->",table);
      div2 = document.createElement("div");
      div2.innerHTML = table;
      container.appendChild(div2);
      sumaSemana = 0;
      k = 0;
      j++;
    }
    j = 0;
    i++;
  }


  /* ------------------- */

});
