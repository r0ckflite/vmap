var range = new Object();

(function () {
  var module = range;

  module.RangeSlider = function () {
    //this.dateCount = Object.keys(assocArray).length;
    this.id = $("#dateRange");
    this.text = $("#showDateText");
    this.timer = null;
    this.direction = null;

    $(document).on("input change", "#dateRange", function () {
      rs.setValue($(this).val());
    });
  };

  p = range.RangeSlider.prototype = new Object();

  p.pause = function () {
    clearTimeout(this.timer);
    this.timer = null;
    $("#range-buttons .btn").removeClass("active");
    this.direction = null;
  };

  p.rewind = function () {
    if (this.direction == "forward") {
      this.pause();
    }
    if (this.timer != null) return;

    $("#range-buttons .rewind").addClass("active");
    this._rewind();
  };

  p._rewind = function () {
    this.direction = "rewind";
    that = this;
    var v = Number(this.id.val());
    if (v == 0) {
      this.pause();
    } else {
      this.timer = setTimeout(function () {
        that.setValue(v - 1);
        that.id.val(v - 1);
        that._rewind();
      }, configData.playTimer);
    }
  };

  p.play = function () {
    if (this.direction == "rewind") {
      this.pause();
    }
    if (this.timer != null) return;
    $("#range-buttons .play").addClass("active");
    this._play();
  };

  p._play = function () {
    this.direction = "forward";
    that = this;
    var v = Number(this.id.val());
    max = this.id.attr("max");
    if (v >= max) {
      this.pause();
    } else {
      this.timer = setTimeout(function () {
        that.setValue(v + 1);
        that.id.val(v + 1);
        that._play();
      }, configData.playTimer);
    }
  };

  p.setRange = function (options) {
    this.assocArray = options.dateAssoc;
    this.dateArray = options.dateArray;

    this.id.attr("min", 0);
    this.id.attr("max", this.dateArray.length);
    this.id.val(0);
    this.text.val(this.dateArray[0]);
  };

  p.showValue = function (val) {
    this.text.html(this.dateArray[val]);
  };

  p.setValue = function (val) {
    let dateString = this.dateArray[val];
    this.text.val(dateString);
    mainWidget.xfmrs.draw(dateString);
  };

  p.setDate = function (dateString) {
    let index = this.assocArray[dateString];
    this.id.val(index);
    this.setValue(index);
  };

  window["range"] = range;
})();
