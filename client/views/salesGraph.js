var PADDING = {
  top: 80,
  right: 15,
  bottom: 30,
  left: 0
}
var Y_TICK_COUNT = 4;
var X_TICK_INCREMENT = 5; //seconds
var DURATION = 30; //seconds

window.timeRange = new ReactiveDict();

var updateTimeRange = function() {
  var now = new Date();
  timeRange.set('start', d3.time.second.offset(new Date(), -DURATION));
  timeRange.set('end', now);
}

var loop = function() {
  updateTimeRange();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// updateTimeRange();
// Meteor.setInterval(function() {
//   updateTimeRange();
// }, 200);



var salesOverTime = function() {
  return Sales.find(
    {when: {$gte: timeRange.get('start')}},
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
  
  
  return {
    x: d3.time.scale().range([-60, width + 60])
         .domain([timeRange.get('start'), timeRange.get('end')]),
    y: d3.scale.linear().range([height, 0]).domain([0, d3.max(yValues)])
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
  
  _.each(scales.x.ticks(DURATION), function(tickTime) {
    var seconds = new Date(tickTime).getSeconds();
     
    if (seconds % X_TICK_INCREMENT === 0)
      ticks.push({
        x: scales.x(tickTime),
        label: format(tickTime)
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
    // points = [];
    
    var scales = calculateScales(points, chartWidth, chartHeight);
    var dotPoint = _.last(points);
    // var dotPoint = {x: 0, y: 0};
    
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
      chartWidth: chartWidth,
      padding: PADDING
    }
  }
});

