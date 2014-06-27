var WIDTH = 300;
var HEIGHT = 40;
var LABEL_COLOR = d3.interpolateRgb('#666', '#fff');

// XXX: do we want to calculate this ONCE on the outside?
var maxSales = function() {
  return _.max(Products.find().map(productSales));
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
  
  // XXX: inefficient to calculate this lots of times -- should we wrap in #with?
  sales: function() {
    return productSales(this);
  },
  
  productWidth: animate(function() { 
    return (productSales(this) / maxSales() * WIDTH) || 0;
  }),
  
  color: function(width) {
    return LABEL_COLOR(width / 100);
  },
  
  y: function() {
    var index = Products.find({name: {$lt: this.name}}).count();
    return index * HEIGHT;
  }
})