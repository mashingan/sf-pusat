const ONEDAY = 1000 * 60 * 60 * 24; // one day in milliseconds

function splitTime(date, what, which) {
  if (!date[what] || typeof date[what] !== 'function') {
    return undefined;
  }

  var data = date[what]().split(' ');
  if (which >= data.length) {
    return undefined;
  }
  return data[which];
}

function getTimeString(date) {
  return splitTime(date, 'toTimeString', 0);
}

function getTotalDuration(durations) {
  return secondToTimeString(
      durations.reduce(function (acc, obj) {
        return acc + strDurToSecond(obj.duration);
      }, 0));
}

function strDurToSecond (strTime) {
  var durations = strTime.split(':').reverse();
  var seconds = 0;
  for (var i = 0; i < durations.length; i++) {
    var tm = parseInt(durations[i]);
    seconds += tm * Math.pow(60, i);
  }
  return seconds;
}

function secondToTimeString (seconds) {
  var strTime = '';
  var sec = seconds;
  for (var i = 0; i < 3; i++) {
    var denum = Math.pow(60, 2-i);
    var intstr = parseInt(sec / denum);
    if (intstr < 10) intstr = '0' + intstr;
    else intstr = intstr.toString();
    strTime += intstr;
    if (i !== 2) {
      strTime += ':';
    }
    sec = sec % denum;
  }
  return strTime;
}

function getDate (when) {
  if (!when) {
    return undefined;
  }

  if (typeof when === 'number') {
    return {
      $gte: new Date(when),
      $lt: new Date(when + ONEDAY)
    };
  }

  if (typeof when === 'object' && when.getTime &&
      typeof when.getTime === 'function') {
    return {
      $gte: when,
      $lt: new Date(when.getTime() + ONEDAY)
    };
  }

  var times = when.split(':');

  var today = new Date();
  today.setSeconds(0);
  today.setMinutes(0);
  today.setHours(0);

  var date;
  if (when === '-') {
    date = {
      $gte: today,
      $lt: new Date(today.getTime() + ONEDAY)
    };
  } else if (when !== 'all' && times.length === 1) {
    date = {
      $gte: new Date(times[0]),
      $lt: new Date(Date.parse(times[0]) + ONEDAY)
    };
  } else if (times.length === 2) {
    date = {
      $gte: new Date(times[0]),
      $lt: new Date(times[1])
    };
  } else if (when === 'all') {
    date = undefined;
  }
  return date;
}

module.exports.getTotalDuration = getTotalDuration;
module.exports.getTimeString = getTimeString;
module.exports.splitTime = splitTime;
module.exports.secondToTimeString = secondToTimeString;
module.exports.strDurToSecond = strDurToSecond;
module.exports.getDate = getDate;
module.exports.ONEDAY = ONEDAY;
