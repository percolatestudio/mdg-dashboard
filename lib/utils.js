randomBetween =  function(x, y) {
  return x + Math.random() * (y - x);
}

randomDistribution = function(mean) {
  return randomBetween(0.5 * mean, 1.5 * mean);
}


interpolate = function(f, x, y) {
  return x + f * (y - x);
}

interpolateField = function(name) {
  return function(f, x, y) {
    var result = {}
    result[name] = interpolate(f, x[name], y[name]);
    return _.extend({}, x, result);
  }
}

interpolateArray = function(itemInterpolator) {
  return function(f, x, y) {
    if (x.length !== y.length)
      throw new Meteor.Error("Can't interpolate arrays of different length!")
    
    return _.times(x.length, function(i) {
      return itemInterpolator(f, x[i], y[i]);
    })
  }
}

interpolateArrayByField = function(name) {
  return interpolateArray(interpolateField(name));
}