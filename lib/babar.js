// Generated by CoffeeScript 1.7.1
var avgBkt, bucketize, createBkt, drawChart, drawRow, drawRowChart, drawRowLabel, minMax, minMaxBkt, normalizeBkt, pointsMinMaxUniqueX, tc,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

tc = function(x, c) {
  return Array(x + 1).join(c);
};

minMax = function(min, max, val) {
  return Math.max(min, Math.min(max, val));
};

pointsMinMaxUniqueX = function(points) {
  var maxX, maxY, minX, minY, valX, _ref;
  valX = [];
  _ref = points.reduce(function(prev, point) {
    var _ref;
    if (_ref = point[0], __indexOf.call(valX, _ref) < 0) {
      valX.push(point[0]);
    }
    return [Math.min(prev[0], point[0]), Math.max(prev[1], point[0]), Math.min(prev[2], point[1]), Math.max(prev[3], point[1])];
  }, [Infinity, -Infinity, Infinity, -Infinity]), minX = _ref[0], maxX = _ref[1], minY = _ref[2], maxY = _ref[3];
  return {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY,
    uniqueX: valX.length
  };
};

drawRowLabel = function(r, lblY, lblYW) {
  var lbl;
  lbl = r === 0 || lblY[r] !== lblY[r - 1] ? lblY[r] : '';
  return "" + (tc(lblYW - lbl.length - 1, ' ')) + lbl;
};

drawRowChart = function(r, bkt, bktW, c, h) {
  var v;
  return ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = bkt.length; _i < _len; _i++) {
      v = bkt[_i];
      switch (((r > v) && 1) || (((r > v - 1 || r === v) || r === h - 1) && 2) || 3) {
        case 1:
          if (c === 'ascii') {
            _results.push(tc(bktW, ' '));
          } else {
            _results.push(tc(bktW, '_'.black));
          }
          break;
        case 2:
          if (c === 'ascii') {
            _results.push(tc(bktW, ' '));
          } else {
            _results.push(tc(Math.max(1, bktW - 1), '_'[c]) + (bktW > 1 ? '_'.black : ''));
          }
          break;
        case 3:
          if (c === 'ascii') {
            _results.push(tc(bktW, 'X'));
          } else {
            _results.push(tc(Math.max(1, bktW - 1), ' '[c].inverse) + (bktW > 1 ? '_'.black : ''));
          }
          break;
        default:
          _results.push(void 0);
      }
    }
    return _results;
  })()).join('');
};

drawRow = function(r, lblY, lblYW, bkt, bktW, c, h) {
  return "" + (drawRowLabel(r, lblY, lblYW)) + " " + (drawRowChart(r, bkt, bktW, c, h));
};

drawChart = function(h, lblY, lblYW, bkt, bktW, c) {
  var r;
  return ((function() {
    var _i, _ref, _results;
    _results = [];
    for (r = _i = _ref = h - 1; _ref <= 0 ? _i <= 0 : _i >= 0; r = _ref <= 0 ? ++_i : --_i) {
      _results.push(drawRow(r, lblY, lblYW, bkt, bktW, c, h));
    }
    return _results;
  })()).join('\n');
};

createBkt = function(points, numBkts, minX, diffX) {
  var bkt, i, p, u, x, y, _i, _j, _len, _ref;
  bkt = [];
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    p = points[_i];
    x = p[0], y = p[1];
    u = Math.min(numBkts - 1, Math.floor((x - minX) / diffX * numBkts));
    if (bkt[u] == null) {
      bkt[u] = [];
    }
    bkt[u].push(p);
  }
  for (i = _j = 0, _ref = bkt.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
    if (!bkt[i]) {
      bkt[i] = [];
    }
  }
  return bkt;
};

avgBkt = function(bkt) {
  var prev, values, _i, _len, _results;
  prev = 0;
  _results = [];
  for (_i = 0, _len = bkt.length; _i < _len; _i++) {
    values = bkt[_i];
    if (values.length) {
      _results.push(prev = 1 / values.length * values.reduce(function(prev, curr) {
        return prev + curr[1];
      }, 0));
    } else {
      _results.push(prev);
    }
  }
  return _results;
};

minMaxBkt = function(bkt) {
  return {
    min: Math.min.apply(null, bkt),
    max: Math.max.apply(null, bkt)
  };
};

normalizeBkt = function(bkt, min, diff, h) {
  var v, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = bkt.length; _i < _len; _i++) {
    v = bkt[_i];
    _results.push((v - min) / diff * h);
  }
  return _results;
};

bucketize = function(points, numBkts, minX, diffX, h) {
  var bkt, diff, max, min, _ref;
  bkt = avgBkt(createBkt(points, numBkts, minX, diffX));
  _ref = minMaxBkt(bkt), min = _ref.min, max = _ref.max;
  diff = max - min;
  return {
    bkt: normalizeBkt(bkt, min, diff, h),
    min: min,
    max: max,
    diff: diff
  };
};

module.exports = function(points, options) {
  var bkt, bktW, caption, color, diff, diffX, diffY, height, lbl, lblXI, lblXN, lblXW, lblY, lblYW, max, maxX, maxY, min, minX, minY, numBkts, out, u, uniqueX, v, width, x, xFractions, yFractions, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
  if (options == null) {
    options = {};
  }
  _ref3 = [options.caption, (_ref = options.color) != null ? _ref : 'cyan', (_ref1 = options.width) != null ? _ref1 : 80, (_ref2 = options.height) != null ? _ref2 : 15, options.xFractions, options.yFractions], caption = _ref3[0], color = _ref3[1], width = _ref3[2], height = _ref3[3], xFractions = _ref3[4], yFractions = _ref3[5];
  if (color !== 'ascii') {
    require('colors');
  }
  _ref4 = pointsMinMaxUniqueX(points), minX = _ref4.minX, maxX = _ref4.maxX, minY = _ref4.minY, maxY = _ref4.maxY, uniqueX = _ref4.uniqueX;
  _ref5 = [maxX - minX, maxY - minY], diffX = _ref5[0], diffY = _ref5[1];
  height -= 1 + !!caption;
  if (yFractions == null) {
    yFractions = minMax(0, 8, Math.log(height / diffY * 5) / Math.LN10);
  }
  lblYW = 1 + Math.max(minY.toFixed(yFractions).length, maxY.toFixed(yFractions).length);
  width -= lblYW;
  numBkts = Math.min(uniqueX, width - lblYW);
  bktW = Math.floor((width - lblYW) / numBkts);
  if (xFractions == null) {
    xFractions = minMax(0, 8, Math.log(numBkts / diffX * 5) / Math.LN10);
  }
  _ref6 = bucketize(points, numBkts, minX, diffX, height), bkt = _ref6.bkt, min = _ref6.min, max = _ref6.max, diff = _ref6.diff;
  lblY = [];
  for (v = _i = _ref7 = height - 1; _ref7 <= 0 ? _i <= 0 : _i >= 0; v = _ref7 <= 0 ? ++_i : --_i) {
    lbl = (min + diff * v / (height - 1)).toFixed(yFractions);
    lblY.unshift(lbl);
  }
  lblXW = 0;
  for (u = _j = 0; 0 <= numBkts ? _j < numBkts : _j > numBkts; u = 0 <= numBkts ? ++_j : --_j) {
    lbl = (minX + u * diffX / (numBkts - 1)).toFixed(xFractions);
    lblXW = Math.max(lblXW, lbl.length);
  }
  lblXN = numBkts;
  lblXI = 1;
  while (lblXN * lblXW >= numBkts * bktW) {
    lblXN = Math.floor(lblXN / 2);
    lblXI *= 2;
  }
  out = '';
  if (caption != null) {
    out += tc(lblYW, ' ');
    out += color === 'ascii' ? caption : caption.bold;
    out += '\n';
  }
  out += drawChart(height, lblY, lblYW, bkt, bktW, color) + '\n';
  out += tc(lblYW, ' ');
  for (x = _k = 0; 0 <= lblXN ? _k < lblXN : _k > lblXN; x = 0 <= lblXN ? ++_k : --_k) {
    u = x * lblXI;
    lbl = (minX + u * diffX / (numBkts - 1)).toFixed(xFractions);
    out += lbl;
    out += tc(bktW * lblXI - lbl.length, ' ');
  }
  return out;
};
