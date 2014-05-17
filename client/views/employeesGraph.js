var totalSales = function(employee) {
  var prices = Sales.find({employeeId: employee._id}).map(function(s) {
    return Products.findOne(s.productId).price;
  })
  
  return _.reduce(prices, function(sum, p) { return p + sum }, 0);
}

// first version, single interpolation over *all* data
var rawData = function() {
  return Employees.find().map(function(employee, i) {
    return {
      index: i,
      employee: employee,
      sales: totalSales(employee)
    }
  });
}

window.data = new InterpolatedFunction(rawData, _.identity,
  interpolateArrayByField('sales'));

Meteor.setInterval(function() {
  Session.set('tick', new Date);
}, 1000);

Template.employeesGraph.helpers({
  // Ugghhh.. ugly hack for now
  subsReady: function() {
    Session.get('tick');
    return DDP._allSubscriptionsReady();
  },
  salesData: function() { 
    return data.call();
  },
  width: function() {
    return this.sales / 10;
  },
  y: function() {
    return this.index * 50;
  }
})