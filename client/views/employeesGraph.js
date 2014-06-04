var COLORS = ['red', 'green', 'blue', 'yellow', 'orange'];

var layout = d3.layout.pie().sort(null);
var arc = d3.svg.arc().innerRadius(80).outerRadius(150);

var totalSales = function(employee) {
  var prices = Sales.find({employeeId: employee._id}).map(function(s) {
    return Products.findOne(s.productId).price;
  })
  
  return _.reduce(prices, function(sum, p) { return p + sum }, 0);
}

var getSales = function() {
  return Employees.find({}, {sort: {name: 1}}).map(totalSales);
}

Template.employeesGraph.helpers({
  sales: animate(getSales, {time: 400}),
  
  segments: function() {
    // XXX: deal with data not being loaded yet
    if (! _.any(this, function(s) { return s !== 0 })) return [];
    
    return _.map(layout(this), function(o, index) {
      return _.extend(o, {index: index});
    });
  },
  
  path: function() {
    return arc(this);
  },
  
  color: function() {
    return COLORS[this.index];
  }
});