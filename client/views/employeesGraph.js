var totalSales = function(employee) {
  var prices = Sales.find({employeeId: employee._id}).map(function(s) {
    return Products.findOne(s.productId).price;
  })
  
  return _.reduce(prices, function(sum, p) { return p + sum }, 0);
}

var salesInterpolators = {};
var salesInterpolator = function(employee) {
  if (! salesInterpolators[employee._id]) {
    salesInterpolators[employee._id] = new InterpolatedFunction(function() {
      return totalSales(employee);
    });
  }
  
  return salesInterpolators[employee._id].call()
}

Meteor.setInterval(function() {
  Session.set('tick', new Date);
}, 1000);

Template.employeesGraph.helpers({
  // Ugghhh.. ugly hack for now
  subsReady: function() {
    Session.get('tick');
    return DDP._allSubscriptionsReady();
  },

  employees: function() {
    return Employees.find({}, {sort: {name: 1}});
  },
  
  width: function() {
    return salesInterpolator(this) / 10;
  },
  
  y: function() {
    var index = Employees.find({name: {$lt: this.name}}).count();
    return index * 50;
  }
})