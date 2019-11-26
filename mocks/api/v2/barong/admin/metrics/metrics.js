module.exports = (() => {
  let metrics = {
    "signups": {},
    "sucessful_logins": {},
    "failed_logins": {},
    "pending_applications": 0,
  };

  let lastWeek = [...Array(7).keys()].map((i) => {
    let date = new Date();
    let dayOfWeek = date.setDate(date.getDate() - i);
    return new Date(dayOfWeek).toISOString().split('T')[0];
  });

  lastWeek.forEach((day, index) => {
    let x = 8 - index;
    metrics.signups[day] = Math.abs(Math.floor(Math.cos(2 * x + 1))) + 1;
    metrics.sucessful_logins[day] = Math.abs(Math.floor(Math.sin(x) * x));
    metrics.failed_logins[day] = Math.abs(Math.floor(Math.sin(x) + Math.cos(x))) + 1;
  });

  return metrics;
})();
