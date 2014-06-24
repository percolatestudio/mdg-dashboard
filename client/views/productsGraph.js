var WIDTH = 300;
var HEIGHT = 40;

// XXX: do we want to calculate this ONCE on the outside?
var maxSales = function() {
  return _.max(Products.find().map(productSales)) || 1;
}

var productSales = function(product) {
  return product.price * Sales.find({productId: product._id}).count();
}

Template.productsGraph.helpers({
  width: WIDTH,
  height: function() {
    return Products.find().count() * HEIGHT
  },
  
  products: function() {
    return Products.find({}, {sort: {name: 1}});
  },
  
  productWidth: animate(function() { 
    return productSales(this) / maxSales() * WIDTH;
  }),
  
  y: function() {
    var index = Products.find({name: {$lt: this.name}}).count();
    return index * HEIGHT;
  }
})