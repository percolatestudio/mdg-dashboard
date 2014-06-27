var PADDING = {
  top: 80,
  right: 15,
  bottom: 30,
  left: 0
}

var Y_TICK_COUNT = 4;
var X_TICK_INCREMENT = 5; //seconds
var DURATION = 30; //seconds

var timeRange = new ReactiveDict();

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

var calculateScales = function(points, width, height) {
  return {
    // render the start/end of the graph 180px off screen so 
    x: d3.time.scale().range([-180, width + 180])
         .domain([timeRange.get('start'), timeRange.get('end')]),
    y: d3.scale.linear().range([height, 0]).domain([0, 22])
    // y: d3.scale.linear().range([height, 0])
    //      .domain([0, d3.max(points, function(p) {return p.y;})])
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

    var scales = calculateScales(points, chartWidth, chartHeight);
    
    return {
      area: pathForArea(points, scales, chartHeight),
      line: pathForLine(points, scales),
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

