var totalSales = function(product) {
  return product.price * Sales.find({productId: product._id}).count();
}

Meteor.setInterval(function() {
  Session.set('tick', new Date);
}, 1000);

Template.productsGraph.helpers({
  // Ugghhh.. ugly hack for now
  subsReady: function() {
    Session.get('tick');
    return DDP._allSubscriptionsReady();
  },

  products: function() {
    return Products.find({}, {sort: {name: 1}});
  },
  
  width: animate(function() { return totalSales(this) / 10 }),
  
  y: function() {
    var index = Products.find({name: {$lt: this.name}}).count();
    return index * 50;
  }
})