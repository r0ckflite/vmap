var configData = {
  // xfmrLoadURL: "xfmrs.json",
  xfmrLoadURL: "http://35.173.127.248/xfmrs/",
  meterLoadURL: "http://35.173.127.248/meters/",
  mapCenter: new google.maps.LatLng(-39.06, 174.038),
  zoom: 2,
  defaultZoom: 14,
  markers: {
    kw: [
      [0.8, "normal", "images/kw_green.png", 50, 50, 20, 20],
      [0.97, "high", "images/kw_yellow.png", 50, 50, 20, 20],
      [1000, "alert", "images/kw_red.png", 50, 50, 20, 20],
    ],
    voltage: [
      [230, "low", "images/v_yellow.png", 50, 50, 20, 20],
      [250, "normal", "images/v_green.png", 50, 50, 20, 20],
      [1000, "alert", "images/v_red.png", 50, 50, 20, 20],
    ],
  },

  showXfmrLabel: true,
  defaultStartDate: "2021-01-01",
  defaultEndDate: "2021-06-31",
  playTimer: 500,
};

var config = new Object();

(function () {
  var module = config;

  module.Config = function (map) {
    this.map = map;
    this.kw = [];
    this.voltage = [];
    this.kwmarkers = [];

    for (let i = 0; i < configData.markers.kw.length; i++) {
      let kw = configData.markers.kw[i];

      this.kw.push({
        name: kw[1],
        maxValue: kw[0],
        imageFile: kw[2],
      });
    }

    for (let i = 0; i < configData.markers.voltage.length; i++) {
      let voltage = configData.markers.voltage[i];
      this.voltage.push({
        name: voltage[1],
        maxValue: voltage[0],
        imageFile: voltage[2],
      });
    }
  };

  p = config.Config.prototype = new Object();

  p.getKWMarkerImage = function (value) {
    for (let i = 0; i < this.kw.length; i++) {
      if (this.kw[i].maxValue > value)
        return {
          imageFile: this.kw[i].imageFile,
        };
    }
    return null; // error!!!!
  };

  p.getVoltageMarkerImage = function (value) {
    for (let i = 0; i < this.voltage.length; i++) {
      if (this.voltage[i].maxValue > value)
        return {
          imageFile: this.voltage[i].imageFile,
        };
    }
    return null; // error!!!!
  };

  window["config"] = config;
})();
