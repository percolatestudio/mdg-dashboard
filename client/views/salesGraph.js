// var WIDTH = 540;
// var HEIGHT = 235;
var PADDING = {
  top: 20,
  right: 15,
  bottom: 30,
  left: 0
}
var Y_TICK_COUNT = 4;

// var timeRange = new ReactiveDict();



var salesOverTime = function() {
  return Sales.find(
    {when: {$gte: d3.time.minute.offset(new Date(), -1)}},
    {sort: {when: 1}}).map(function(sale) {
      return {
        x: sale.when,
        y: sale.amount
      }
    });
}

// var salesOverTime = function() {
//   return Sales.find({}, {sort: {when: 1}, limit: 60}).map(function(sale) {
//     return {
//       x: sale.when,
//       y: sale.amount
//     }
//   });
// }

var calculateScales = function(points, width, height) {
  var xValues = [], yValues = [];
  
  points.forEach(function(point) {
    xValues.push(point.x);
    yValues.push(point.y);
  });
  
  var now = new Date();
  var before = d3.time.minute.offset(now, -1)
  
  return {
    x: d3.time.scale().range([0, width]).domain([before, now]),
    //x: d3.time.scale().range([0, width]).domain(d3.extent(xValues)),
    y: d3.scale.linear().range([height, 0]).domain(d3.extent(yValues))
  }
}

var pathForArea = function(points, scales, height) {
  var pathFn = d3.svg.area()
    .x(function(d) {return scales.x(d.x);})
    .y0(function(d) {return height;})
    .y1(function(d) {return scales.y(d.y);})
    .interpolate('cardinal').tension(0.8);

  return pathFn(points);
}

var pathForLine = function(points, scales) {
  var pathFn = d3.svg.line()
    .x(function(d) {return scales.x(d.x);})
    .y(function(d) {return scales.y(d.y);})
    .interpolate('cardinal').tension(0.8);
    
  return pathFn(points);
}

var xTicks = function(points, scales) {
  var ticks = [];
  var format = d3.time.format("%M:%S");
  
  _.each(points, function(point) {
    var seconds = new Date(point.x).getSeconds();
     
    if (seconds % 5 === 0)
      ticks.push({
        x: scales.x(point.x),
        label: format(point.x)
      });
  });
  
  return ticks;
}

var yTicks = function(scales) {
  return _.map(scales.y.ticks(Y_TICK_COUNT), function(label) {
    return {
      y: scales.y(label),
      label: label
    }
  });
}

Template.salesGraph.helpers({
  svgData: function() {
    var chartWidth = this.width - PADDING.left - PADDING.right;
    var chartHeight = this.height - PADDING.top - PADDING.bottom;
    
    var points = salesOverTime();
    
    if (! points.length)
      return;
    
    var scales = calculateScales(points, chartWidth, chartHeight);
    var dotPoint = _.last(points);
    
    return {
      area: pathForArea(points, scales, chartHeight),
      line: pathForLine(points, scales),
      dot: {
        x: scales.x(dotPoint.x),
        y: scales.y(dotPoint.y)
      },
      yTicks: yTicks(scales),
      xTicks: xTicks(points, scales),
      width: this.width,
      height: this.height,
      chartHeight: chartHeight,
      padding: PADDING
    }
  }
});

