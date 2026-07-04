/* 成语接龙：同尾字接首字，随机 5 条链；行内“接龙”以该成语续接；换一换重掷 */
(function () {
  var GROUPS = window.CHENGYU_DATA || {};
  var LETTERS = Object.keys(GROUPS).sort();
  var FLAT = [];
  LETTERS.forEach(function (k) { FLAT = FLAT.concat(GROUPS[k]); });
  var BY_FIRST = {};
  FLAT.forEach(function (c) {
    var f = c[0];
    (BY_FIRST[f] = BY_FIRST[f] || []).push(c);
  });

  function lastHan(s) {
    var m = s.match(/[一-龥](?=[^一-龥]*$)/);
    return m ? m[0] : '';
  }
  function pick(arr, used) {
    var cands = arr.filter(function (c) { return !used[c]; });
    if (!cands.length) return null;
    return cands[Math.floor(Math.random() * cands.length)];
  }
  function candidatesFor(ch) {
    if (BY_FIRST[ch] && BY_FIRST[ch].length) return BY_FIRST[ch];
    // 回退：同音（带调→不带调）
    try {
      var spellT = window.cnchar.spell(ch, 'tone', 'low');
      var spellN = window.cnchar.spell(ch, 'low');
      var same = [], sameN = [];
      Object.keys(BY_FIRST).forEach(function (f) {
        try {
          if (window.cnchar.spell(f, 'tone', 'low') === spellT) same = same.concat(BY_FIRST[f]);
          else if (window.cnchar.spell(f, 'low') === spellN) sameN = sameN.concat(BY_FIRST[f]);
        } catch (e) {}
      });
      return same.length ? same : sameN;
    } catch (e) { return []; }
  }
  function makeChain(start) {
    var used = {};
    var chain = [];
    var cur = start;
    used[start] = 1;
    for (var i = 0; i < 5; i++) {
      var tail = lastHan(cur);
      if (!tail) break;
      var cands = candidatesFor(tail).filter(function (c) { return !used[c]; });
      if (!cands.length) break;
      // 随机顺序中优先选“还接得下去”的候选，避免链条提前进入死角
      var next = null;
      for (var tries = 0; tries < 12 && cands.length; tries++) {
        var idx = Math.floor(Math.random() * cands.length);
        var cand = cands.splice(idx, 1)[0];
        if (next === null) next = cand;
        var t2 = lastHan(cand);
        if (i === 4 || (t2 && candidatesFor(t2).some(function (c) { return !used[c] && c !== cand; }))) {
          next = cand;
          break;
        }
      }
      chain.push(next);
      used[next] = 1;
      cur = next;
    }
    return chain;
  }

  var input = document.querySelector('.pc-content input.MuiInputBase-input');
  var startBtn = null, changeBtn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('开始接龙') >= 0) startBtn = b;
    if (b.textContent.indexOf('换一换') >= 0) changeBtn = b;
  });
  var emptyEl = null;
  document.querySelectorAll('.pc-content div').forEach(function (d) {
    if (d.children.length === 0 && d.textContent.trim() === '暂无结果') emptyEl = d;
  });
  var host = emptyEl ? emptyEl.parentElement : document.querySelector('.pc-content');

  var TD = 'MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg';
  function render(chain) {
    if (emptyEl) emptyEl.remove();
    var old = host.querySelector('.bxm-jielong-table');
    if (old) old.remove();
    if (!chain.length) {
      var d = document.createElement('div');
      d.textContent = '暂无结果';
      d.className = 'bxm-jielong-table';
      host.appendChild(d);
      return;
    }
    var wrap = document.createElement('div');
    wrap.className = 'bxm-jielong-table MuiTableContainer-root css-kge0eu';
    wrap.innerHTML = '<table class="MuiTable-root css-rqglhn"><tbody class="MuiTableBody-root css-1xnox0e">' +
      chain.map(function (c) {
        return '<tr class="MuiTableRow-root css-1gqug66"><td class="' + TD + '">' + c +
          '</td><td class="' + TD + '"><a class="jielong">接龙</a></td></tr>';
      }).join('') + '</tbody></table>';
    host.appendChild(wrap);
    wrap.querySelectorAll('a.jielong').forEach(function (a, i) {
      a.addEventListener('click', function () {
        var idiom = chain[i];
        input.value = idiom;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        render(makeChain(idiom));
      });
    });
  }

  function start() {
    var v = (input.value || '').trim();
    if (!v) {
      v = FLAT[Math.floor(Math.random() * FLAT.length)];
    }
    render(makeChain(v));
  }
  if (startBtn) startBtn.addEventListener('click', start);
  if (changeBtn) changeBtn.addEventListener('click', start);
})();
