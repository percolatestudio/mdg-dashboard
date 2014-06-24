if (! Products.find().count()) {
  _.each(['Wiley', 'Buggs', 'Elmer', 'Donald'], function(name) {
    Factory.create('employee', {name: name});
  });
  
  _.each(['Hammer', 'Anvil', 'Dynamite', 'Magnet', 'Cement', 'Grease'], function(name) {
    Factory.create('product', {name: name});
  });
}
