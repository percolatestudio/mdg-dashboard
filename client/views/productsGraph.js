var totalSales = function(product) {
  return product.price * Sales.find({productId: product._id}).count();
}

Template.productsGraph.helpers({
  products: function() {
    return Products.find({}, {sort: {name: 1}});
  },
  
  width: animate(function() { return totalSales(this) / 10 }),
  
  y: function() {
    var index = Products.find({name: {$lt: this.name}}).count();
    return index * 50;
  }
})