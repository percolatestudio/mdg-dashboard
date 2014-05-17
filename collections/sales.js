Sales = new Meteor.Collection('sales');

Factory.define('sale', Sales, {
  product: Factory.get('product'),
  employee: Factory.get('employee'),
  when: function() { return new Date; }
});