var COLORS = ['red', 'green', 'blue', 'yellow', 'orange'];

var layout = d3.layout.pie().sort(null);
var arc = d3.svg.arc().innerRadius(70).outerRadius(100);

var totalSales = function() {
  var prices = Sales.find().map(function(s) {
    return Products.findOne(s.productId).price;
  })

  return _.reduce(prices, function(sum, p) { return p + sum }, 0);
}

var salesForEmployee = function(employee) {
  var prices = Sales.find({employeeId: employee._id}).map(function(s) {
    return Products.findOne(s.productId).price;
  })
  
  return _.reduce(prices, function(sum, p) { return p + sum }, 0);
}

var getSales = function() {
  var total = totalSales()
  
  return Employees.find({}, {sort: {name: 1}})
    .map(function(employee, index) {
      var stat = {
        employee: employee,
        sales: salesForEmployee(employee),
        index: index
      };
      stat.fraction = stat.sales / total;
      return stat;
    });
}

Template.employeesGraph.helpers({
  salesByEmployee: getSales,
  
  // XXX: better name
  animated: animate(function() { 
    return _.pluck(this, 'sales');
  }, {time: 400}),
  
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