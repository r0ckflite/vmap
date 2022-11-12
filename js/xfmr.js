var xfmr = new Object();

(function () {
  var module = xfmr;

  /**
   * represents a single transformer
   *
   * @param {*} options {xfmrType : "kva,voltage"}
   */
  module.Xfmr = function (options, map, config, data) {
    this.map = map;
    this.id = data.id;
    this.lat = Number(data.lat);
    this.lng = Number(data.long);
    this.kva = data.KVA;
    this.maxVolt = data.MaxVolt;
    this.minVolt = data.MinVolt;
    this.config = config;
    this.readings = [];
    this.currentIndex = 0;
    this.typeString =
      options != null && options.typeString != null ? options.typeString : "k";
    this.startDate = options.startDate;
    this.endDate = options.endDate;

    this.graph = new grph.Graph1();

    for (let i = 0; i < data.profiles.length; i++) {
      let p = data.profiles[i];
      for (let j = 0; j < p.KW.length; j++) {
        kw = p.KW[j];
        v = p.Voltage[j];
        var r = {
          id: this.id,
          kwMarker: this.config.getKWMarkerImage(kw / data.KVA),
          vMarker: this.config.getVoltageMarkerImage(v),
          date: p.date,
          hour: j,
        };
        this.readings.push(r);
      }
    }

    this._draw(0);
  };

  p = xfmr.Xfmr.prototype = new Object();

  p.setType = function (typeString) {
    if (typeString != "k" && typeString != "v") {
      console.log("bad value set for setType : " + typeString);
      return;
    }

    if (this.typeString != typeString) {
      this.typeString = typeString;
      this.draw(this.currentIndex, true);
    }
  };

  p._draw = function (i) {
    var reading = this.readings[i];
    var that = this;
    let map = this.map;
    if (configData.showXfmrLabel == true) {
      this.marker = new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: map,
        icon: {
          url:
            this.typeString == "k"
              ? reading.kwMarker.imageFile
              : reading.vMarker.imageFile,
          labelOrigin: new google.maps.Point(15, 25),
          size: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
        label: {
          text: this.id,
          color: "black",
          fontWeight: "normal",
        },
      });
    } else {
      this.marker = new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map,
        icon:
          this.typeString == "k"
            ? reading.kwMarker.imageFile
            : reading.vMarker.imageFile,
      });
    }
    google.maps.event.addListener(this.marker, "click", function () {
      that.graph.show({
        id: that.id,
        kva: that.kva,
        minVolt: that.minVolt,
        maxVolt: that.maxVolt,
        startDate: that.startDate,
        endDate: that.endDate,
        typeString: that.typeString,
      });
      console.log(reading);
    });
  };

  p._hide = function (i) {
    this.marker.setMap(null);
    this.marker = null;
  };

  p.draw = function (index, force = null) {
    var redraw = false;
    if (
      this.typeString == "k" &&
      this.readings[index].kwMarker.imageFile !=
        this.readings[this.currentIndex].kwMarker.imageFile
    )
      redraw = true;
    else if (
      this.typeString == "v" &&
      this.readings[index].vMarker.imageFile !=
        this.readings[this.currentIndex].vMarker.imageFile
    )
      redraw = true;

    if (redraw == true || force == true) {
      this._hide(this.currentIndex);
      this._draw(index);
    }

    this.currentIndex = index;
  };

  /**
   * Transformer array object
   *
   * @param {*} options
   */
  module.XfmrList = function (options) {
    this.xfmrs = [];
    this.map = options.map;
    this.url = options.url;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.config = options.config;
    this.currentIndex = 0;
    this.dateAssoc = [];
    this.typeString =
      options != null && options.typeString != null ? options.typeString : "k";

    this._loadData(this.url, this.startDate, this.endDate);
  };

  p = xfmr.XfmrList.prototype = new Object();

  p.setType = function (typeString) {
    if (this.typeString != typeString) {
      for (let i = 0; i < this.xfmrs.length; i++) {
        this.xfmrs[i].setType(typeString);
      }
      this.typeString = typeString;
    }
  };

  p._loadData = function (url, startDate, endDate) {
    var that = this;
    console.debug("start date : " + startDate);
    console.debug("end date   : " + endDate);
    url = url + "?startdate=" + startDate + "&enddate=" + endDate;
    url2 =
      "http://35.173.127.248/xfmrs/?startdate=%2701/01/2022%27&enddate=%2701/10/2022%27";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          this.xfmrs.push(
            new xfmr.Xfmr(
              {
                typeString: that.typeString,
                startDate: that.startDate,
                endDate: that.endDate,
              },
              that.map,
              that.config,
              data[i]
            )
          );
          that._indexData(data);
          rs.setRange({
            dateAssoc: that.dateAssoc,
            dateArray: that.dateIndexArray,
          });
        }
      });
  };

  /**
   * creates an assoc array of dates MMDDYYYYHH24, based on the
   * xfmr data, look up date and get index into readings for
   * the kw/v values
   */
  p._indexData = function (data) {
    this.dateAssoc = [];
    this.dateIndexArray = [];
    var index = 0;
    if (data.length > 0) {
      p = data[0].profiles;
      for (let i = 0; i < p.length; i++) {
        kw = p[i].KW;
        for (let j = 0; j < kw.length; j++) {
          this.dateAssoc[p[i].date + ":" + j.toString().padStart(2, "0")] =
            index++;
          this.dateIndexArray.push(
            p[i].date + ":" + j.toString().padStart(2, "0")
          );
        }
      }
    }
  };

  p.draw = function (dateString = null) {
    var index = this.currentIndex;

    if (dateString != null) {
      index = this.dateAssoc[dateString];
      if (index == null) {
        alert("bad date entered");
        return;
      }
    }

    for (let i = 0; i < this.xfmrs.length; i++) {
      this.xfmrs[i].draw(index);
    }
    this.currentIndex = index;
  };

  window["xfmr"] = xfmr;
})();
