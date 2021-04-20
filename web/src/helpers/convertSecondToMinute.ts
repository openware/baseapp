export const secondToMinutes = sec => {
  return sec ? Math.floor(sec / 60) : 0;
}

export const secondToMinutesAndSeconds = sec => {
  if (!sec) {
    return 0;
  }

  var minutes = Math.floor(sec / 60);
  var seconds = (sec % 60).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? '0' : '') + seconds;
}
