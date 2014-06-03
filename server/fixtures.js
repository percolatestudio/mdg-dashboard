var N_PRODUCTS = 6;
var N_EMPLOYEES = 5;

if (! Products.find().count()) {
  _.times(N_PRODUCTS, function() {
    Factory.create('product');
  });
  
  _.times(N_EMPLOYEES, function() {
    Factory.create('employee');
  });
}
