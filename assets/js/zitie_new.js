/* 字帖生成：年级字表 + 三模板，米字格 SVG 描红，笔画数据取自线上 CDN（CORS *） */
(function () {
  var GRADES = window.ZITIE_GRADES || {};
  var CDN = 'https://static.res.qq.com/qbtool/char/';
  var cache = {};
  var pc = document.querySelector('.pc-content');
  if (!pc) return;
  var ta = pc.querySelector('textarea:not([aria-hidden])');
  var print_ = pc.querySelector('.print-content');
  var combos = pc.querySelectorAll('[role="combobox"]');
  var resetBtn = null, printBtn = null;
  pc.querySelectorAll('button').forEach(function (b) {
    if (b.textContent.indexOf('重置') >= 0) resetBtn = b;
    if (b.textContent.indexOf('打印') >= 0) printBtn = b;
  });
  var state = { grade: '1', template: 'A' };

  function fetchChar(ch) {
    if (cache[ch]) return cache[ch];
    cache[ch] = fetch(CDN + encodeURIComponent(ch) + '.json')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .catch(function () { return null; });
    return cache[ch];
  }

  function cellSVG(strokes, color) {
    var svg = '<span><svg version="1.1" baseProfile="full" width="60" height="60" style="border: 1px solid #11a45e;background-color: rgb(255, 255, 255);box-sizing: border-box" xmlns="http://www.w3.org/2000/svg">\n' +
      '    <line x1="30" y1="0" x2="30" y2="60" stroke-dasharray="3" stroke="#11a45e"></line>\n' +
      '    <line x1="0" y1="30" x2="60" y2="30" stroke-dasharray="3" stroke="#11a45e"></line>\n';
    if (strokes && strokes.length) {
      svg += '  <g transform="translate(5, 48.9453125) scale(0.048828125, -0.048828125)">\n' +
        strokes.map(function (d) { return '        <path d="' + d + '" style="fill: ' + color + '"></path>'; }).join('\n') +
      '\n      </g>';
    }
    svg += '</svg></span>';
    return svg;
  }

  var renderSeq = 0;
  function render() {
    if (!print_) return;
    var seq = ++renderSeq;
    var chars = (ta.value || '').replace(/[^一-龥]/g, '').split('');
    print_.innerHTML = '';
    var jobs = chars.map(function (ch) { return fetchChar(ch); });
    Promise.all(jobs).then(function (datas) {
      if (seq !== renderSeq) return;
      var html = '';
      if (state.template === 'C') {
        var row = '<div>';
        datas.forEach(function (d) {
          var strokes = d && d.strokes;
          row += cellSVG(strokes, '#ddd') + cellSVG(null, '');
        });
        row += '</div>';
        html = row;
      } else {
        datas.forEach(function (d) {
          var strokes = d && d.strokes;
          var row = '<div>';
          if (state.template === 'B') {
            row += cellSVG(strokes, '#000') + cellSVG(strokes, '#f00');
          } else {
            row += cellSVG(strokes, '#000');
            for (var i = 0; i < 10; i++) row += cellSVG(strokes, '#ddd');
          }
          row += '</div>';
          html += row;
        });
      }
      print_.innerHTML = html;
    });
  }

  // 年级下拉
  if (combos[0] && window.muiSelect) {
    var gradeOpts = Object.keys(GRADES).map(function (k) { return { value: k, label: GRADES[k].name }; });
    window.muiSelect(combos[0], gradeOpts, function (v) {
      state.grade = v;
      ta.value = GRADES[v].text;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      render();
    });
  }
  // 模板下拉
  if (combos[1] && window.muiSelect) {
    window.muiSelect(combos[1], [
      { value: 'A', label: '模板A' }, { value: 'B', label: '模板B' }, { value: 'C', label: '模板C' }
    ], function (v) { state.template = v; render(); });
  }
  if (resetBtn) resetBtn.addEventListener('click', function () {
    ta.value = GRADES[state.grade] ? GRADES[state.grade].text : '';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    render();
  });
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  var t = null;
  if (ta) ta.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(render, 400);
  });
  render();
})();
