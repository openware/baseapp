export const millisecondToMinutes = (millis) => {
  return millis ?  Math.floor(millis / 60000) : 0;
}

export const millisecondToMinutesAndSeconds = (millis) => {
  if (!millis) {
    return 0;
  }

  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? '0' : '') + seconds;
}
