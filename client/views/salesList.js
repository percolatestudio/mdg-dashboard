Template.salesList.helpers({
  sales: function() {
    return Sales.find({}, {sort: {when: -1}});
  },
  
  employee: function() {
    return Employees.findOne(this.employeeId);
  },
  
  product: function() {
    return Products.findOne(this.productId);
  }
});