Products = new Meteor.Collection('products');

Factory.define('product', Products, {
  name: function() { return Fake.sentence(2); },
  price: function() { return Math.floor(randomBetween(10, 50) * 10); }
});