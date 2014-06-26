Template.body.rendered = function() {
  Measurement.recalc();
}

Template.body.helpers({
  salesGraphWidth: function() {
    return Measurement.getElementSize($('.wrapper-sales')).width || 300;
  }
})