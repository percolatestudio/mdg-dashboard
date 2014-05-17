randomBetween =  function(x, y) {
  return x + Math.random() * (y - x);
}

randomDistribution = function(mean) {
  return randomBetween(0.5 * mean, 1.5 * mean);
}