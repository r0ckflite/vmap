var grph = new Object();

(function () {
  var module = grph;

  module.Graph1 = function () {};

  p = grph.Graph1.prototype = new Object();

  p.show = function (options) {
    this.id = options.id;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.url = configData.meterLoadURL;
    this.typeString = options.typeString;
    this.kva = options.kva;
    this.minVolt = options.minVolt;
    this.maxvolt = options.maxVolt;

    this._loadData();

    var myModal;
    if (this.typeString == "k") {
      myModal = new bootstrap.Modal(document.getElementById("graph1Modal"));
    } else {
      myModal = new bootstrap.Modal(document.getElementById("graph2Modal"));
    }
    myModal.show();
  };

  p._loadData = function () {
    var that = this;
    var url =
      that.url +
      "?xfmrid=" +
      that.id +
      "&start=" +
      that.startDate +
      "&end=" +
      that.endDate;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.debug(data);
        //that.buildGraph(data, that.id, that.startDate, that.endDate);
        if (that.typeString == "k") {
          that.buildGraphStackedBarKVA(
            data,
            that.id,
            that.startDate,
            that.endDate
          );
        } else {
          that.buildGraphStackedBarVoltage(
            data,
            that.id,
            that.startDate,
            that.endDate
          );
        }
      });
  };

  p.buildGraph = function (data, id, startDate, endDate, typeString) {
    var obj = new Object();

    console.log(data);

    obj.title = {
      text: id + " date : " + startDate + " to " + endDate,
    };

    obj.yAxis = {
      title: {
        text: this.typeString == "k" ? "kW" : "Voltage",
      },
    };

    obj.xAxis = {
      type: "datetime",
      accessibility: {
        formatter: function () {
          return Highcharts.dateFormat("%a %d %b %H");
        },
      },
    };

    obj.legend = {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    };

    obj.plotOptions = {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    };

    obj.responsive = {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    };

    obj.series = [];

    for (let i = 0; i < data.length; i++) {
      s = new Object();
      s.name = data[i].serial;
      s.data = [];
      let count = 0;

      p = data[i].profiles;

      for (let j = 0; j < p.length; j++) {
        dt = p[j].date.split("-");
        if (this.typeString == "k") {
          let kw = p[j].KW;
          for (let k = 0; k < kw.length; k++) {
            s.data.push([Date.UTC(dt[0], dt[1] - 1, dt[2], k), Number(kw[k])]);
            count++;
          }
        } else {
          let v = p[j].Voltage;
          for (let k = 0; k < v.length; k++) {
            s.data.push([Date.UTC(dt[0], dt[1] - 1, dt[2], k), v[k]]);
            count++;
          }
        }
      }
      obj.series.push(s);
    }

    Highcharts.chart("meterGraph", obj);
  };

  p.buildGraphStackedBarKVA = function (
    data,
    id,
    startDate,
    endDate,
    typeString
  ) {
    var obj = new Object();

    console.log(data);

    obj.title = {
      text: id + " date : " + startDate + " to " + endDate,
    };

    obj.legend = {
      layout: "vertical",
      style: {},
      enabled: false,
    };

    obj.xAxis = {
      startOnTick: true,
      endOnTick: true,
      type: "datetime",
      accessibility: {
        formatter: function () {
          return Highcharts.dateFormat("%a %d %b %H");
        },
      },
    };

    obj.yAxis = {
      // min: this.kva + 5,
      plotLines: [
        {
          color: "red",
          value: this.kva,
          width: 2,
          label: {
            text: "kva : " + this.kva,
            align: "left",
          },
        },
      ],
    };

    obj.tooltip = { enabled: true };
    obj.credits = { enabled: false };

    obj.plotOptions = {
      column: {
        stacking: "normal",
        pointWidth: 4,
      },
    };
    obj.chart = {
      defaultSeriesType: "column",
      height: 200,
      borderRadius: 0,
      rendorTo: "meterGraph",
      zoomType: "x",
    };

    obj.series = [];

    for (let i = 0; i < data.length; i++) {
      s = new Object();
      s.name = data[i].serial;
      s.data = [];
      let count = 0;

      p = data[i].profiles;

      for (let j = 0; j < p.length; j++) {
        dt = p[j].date.split("-");

        let kw = p[j].KW;
        for (let k = 0; k < kw.length; k++) {
          s.data.push([Date.UTC(dt[0], dt[1] - 1, dt[2], k), Number(kw[k])]);
          count++;
        }
      }
      obj.series.push(s);
    }

    Highcharts.chart("meterGraph", obj);
  };

  p.buildGraphStackedBarVoltage = function (
    data,
    id,
    startDate,
    endDate,
    typeString
  ) {
    for (let i = 0; i < data.length; i++) {
      var obj = new Object();

      console.log(data);

      obj.title = {
        text: data[i].serial,
      };

      obj.legend = {
        layout: "vertical",
        style: {},
        enabled: false,
      };

      obj.xAxis = {
        startOnTick: true,
        endOnTick: true,
        type: "datetime",
        accessibility: {
          formatter: function () {
            return Highcharts.dateFormat("%a %d %b %H");
          },
        },
      };

      obj.yAxis = {
        // min: this.kva + 5,
        plotBands: [
          {
            color: "green",
            from: 230,
            to: 250,
          },
        ],
      };

      obj.tooltip = { enabled: true };
      obj.credits = { enabled: false };

      obj.plotOptions = {
        column: {
          stacking: "normal",
          pointWidth: 4,
        },
      };
      obj.chart = {
        defaultSeriesType: "column",
        height: 200,
        borderRadius: 0,
        rendorTo: "meterGraph",
        zoomType: "x",
      };

      obj.series = [];

      s = new Object();
      s.name = data[i].serial;
      s.data = [];
      let count = 0;

      p = data[i].profiles;

      for (let j = 0; j < p.length; j++) {
        dt = p[j].date.split("-");

        let v = p[j].Voltage;
        for (let k = 0; k < v.length; k++) {
          utcDate = Date.UTC(dt[0], dt[1] - 1, dt[2], k);
          s.data.push([utcDate, Number(v[k])]);
          count++;
        }
      }
      obj.series.push(s);

      let el = "gm-graph2-graph" + (i + 1);
      Highcharts.chart(el, obj);
    }
  };

  window["grph"] = grph;
})();
