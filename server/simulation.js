var simulateSale = function() {
  // XXX: just going to be dumb for now
  // -- should work out a way to sample a random element from mongo
  var product = Random.choice(Products.find().fetch());
  var employee = Random.choice(Employees.find().fetch());
  
  var sale = Factory.create('sale', {
    productId: product._id,
    employeeId: employee._id
  });
  console.log(employee.name, 'sold', sale.amount, product.name);
}

var SALES_INTERVAL = 1 * 1000;
var timeout;
var simulateSales = function() {
  simulateSale();
  
  timeout = Meteor.setTimeout(function() {
    simulateSales();
  }, SALES_INTERVAL);
  // }, randomDistribution(SALES_INTERVAL))
}

var stopSimulation = function() {
  if (timeout) {
    Meteor.clearTimeout(timeout);
    timeout = null;
  }
}

Meteor.methods({
  startSimulation: function() {
    simulateSales();
  }, 
  
  stopSimulation: function() {
    stopSimulation();
  },
  
  resetSimulation: function() {
    console.log('resetting sales');
    Sales.remove({});
  },
  
  makeSale: function() {
    simulateSale();
  }
});

// just start straight away for now
Meteor.call('startSimulation');

Meteor.setInterval(function() {
  Meteor.call('resetSimulation');
}, 60 * 1000);