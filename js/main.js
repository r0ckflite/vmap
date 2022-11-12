var main = new Object();

(function () {
  var module = main;

  module.Main = function () {
    this.config = new config.Config();
    this.map = null;
    this.xfmrs = null;
    this.start_date = $("#gm-start-date");
    this.end_date = $("#gm-end-date");

    return this;
  };

  p = main.Main.prototype = new Object();

  p.getStartDate = function () {
    return this.start_date.val();
  };

  p.getEndDate = function () {
    return this.end_date.val();
  };

  p.start = function () {
    var that = this;
    var mapProp = {
      center: configData.mapCenter,
      zoom: configData.defaultZoom,
    };
    this.map = new google.maps.Map(
      document.getElementById("googleMap"),
      mapProp
    );
    this.config = new config.Config(this.map);

    this.start_date.val(configData.defaultStartDate);
    this.end_date.val(configData.defaultEndDate);

    $("#loadData").click(function () {
      console.debug("load data button pressed");
      that.xfmrs = new xfmr.XfmrList({
        config: this.config,
        map: that.map,
        url: configData.xfmrLoadURL,
        startDate: that.getStartDate(),
        config: new config.Config(that.map),
        endDate: that.getEndDate(),
      });
    });

    $("#goto").click(function () {
      let dateString = $("#showDateText").val();
      console.debug("goto button pressed with date string : " + dateString);
      that.xfmrs.draw(dateString);
      rs.setDate(dateString);
    });

    $("#radio1").change(function () {
      console.debug("value : " + this.value);
      that.xfmrs.setType(this.value);
    });
    $("#radio2").change(function () {
      console.debug("value : " + this.value);
      that.xfmrs.setType(this.value);
    });

    $("#graph1Modal .gm-close").on("click", function () {
      $("#graph1Modal").modal("hide");
    });

    $("#graph2Modal .gm-close").on("click", function () {
      $("#graph2Modal").modal("hide");
    });
  };

  window["main"] = main;
})();
