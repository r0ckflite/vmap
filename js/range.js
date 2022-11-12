var range = new Object();

(function () {
  var module = range;

  module.RangeSlider = function () {
    //this.dateCount = Object.keys(assocArray).length;
    this.id = $("#dateRange");
    this.text = $("#showDateText");

    $(document).on("input change", "#dateRange", function () {
      rs.setValue($(this).val());
    });

    /*   $(document).on("input change", "#dateRange", function () {
      rs.showValue($(this).val());
    });*/
  };

  p = range.RangeSlider.prototype = new Object();

  p.setRange = function (options) {
    this.assocArray = options.dateAssoc;
    this.dateArray = options.dateArray;

    this.id.attr("min", 0);
    this.id.attr("max", this.dateArray.length);
    this.id.val(0);
    this.text.html(this.dateArray[0]);
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
