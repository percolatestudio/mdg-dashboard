UI.registerHelper('pluralize', function(n, thing) {
  var plural = thing;
  if (n !== 1)
    plural = thing + 's';
  
  return n + ' ' + plural;
});

UI.registerHelper('formatPercentage', function(f) {
  return Math.round(f * 100);
});