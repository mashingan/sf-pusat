var Gallery = require('../gallery/gallery.model');

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
      $lt: getTomorrow(when)
    };
  }

  var times = when.split(':');

  var date;
  if (when === '-') {
    date = {
      $gte: getToday(),
      $lt: getTomorrow()
    };
  } else if (when !== 'all' && times.length === 1) {
    var time = new Date(times[0]);
    date = {
      $gte: time,
      $lt: getTomorrow(time)
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

function getToday () {
  var today = new Date();
  today.setMilliseconds(0);
  today.setSeconds(0);
  today.setMinutes(0);
  today.setHours(0);
  return today;
}

function getTomorrow (from) {
  if (from) return new Date(from.getTime() + ONEDAY);
  var tomorrow = getToday().getTime() + ONEDAY;
  return new Date(tomorrow);
}

function opDurations(durations, operations, initial) {
  initial = typeof initial === 'number' ? initial :
    typeof initial === 'string' ? strDurToSecond(initial) : 0;
  return secondToTimeString(durations
      .map(strDurToSecond)
      .reduce(operations, initial));
}

function getMiniMax (limit, page) {
  limit = limit < 1 || limit === '-' ? 20 : limit;
  page = page < 1 || page === '-' ? 1 : page;
  
  var mindata = (page - 1) * limit;
  var maxdata = mindata + limit;

  return [mindata, maxdata];
}

function testCounter (obj) {
  if (obj.counter >= obj.min && obj.counter < obj.max)
    if ((!obj.who || obj.who === '-') || !obj.user ||
        obj.user.gallery === obj.tag.gallery)
      return true;
  return false;
}

function getFromTo (when) {
  var date = (when && typeof when.split && when !== '-') ?
    when.split(':').map(function (dt) { return new Date(dt); }) :
    [getToday(), getTomorrow()];
  return date.map(function (e) { return e.getTime(); });
}

function getGalleries (where) {
  return new Promise (function (resolve, reject) {
    var [placeInfo, placeName] = 
    (where && typeof where.split === 'function' &&
     ( where.includes('gallery') || where.includes('region'))) ?
    where.split(':') : [];
    var galleries = [];
    
    if (placeInfo === 'region') {
      Gallery.find({ region: placeName }, function (err, galls) {
        galls = Array.isArray(galls)? galls : [galls];
        galls.forEach(function (gall) {
          galleries.push(gall.name);
        });
        resolve(galleries);
      });
    } else if (placeInfo === 'gallery') {
      galleries = [placeName];
      resolve(galleries);
    } else {
      reject(galleries);
    }
  });
}

function galleryFilteredQuery (db, galleries) {
  return new Promise (function (resolve, reject) {
    if (galleries.length > 0) {
      var filters = {};
      filters.$or = [];
      galleries.forEach(function (el) {
        filters.$or.push({ gallery: el });
      });
      resolve(db.find(filters));
    } else {
      reject(db.find());
    }
  });
}

module.exports = {
  getTotalDuration: getTotalDuration,
  getTimeString: getTimeString,
  opDurations: opDurations,
  splitTime: splitTime,
  secondToTimeString: secondToTimeString,
  strDurToSecond: strDurToSecond,
  getDate: getDate,
  getToday: getToday,
  getTomorrow: getTomorrow,
  getMiniMax: getMiniMax,
  testCounter: testCounter,
  getFromTo: getFromTo,
  getGalleries: getGalleries,
  galleryFilteredQuery: galleryFilteredQuery,
  ONEDAY: ONEDAY
}
