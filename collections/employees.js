Employees = new Meteor.Collection('employees');

Factory.define('employee', Employees, {
  name: function() { return Fake.user().name; }
});