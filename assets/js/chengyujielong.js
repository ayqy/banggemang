/* 成语大全：汉字前缀 / 拼音（可带声调数字）/ 笔画数序列 三种查询 */
(function () {
  var GROUPS = window.CHENGYU_DATA || {};
  var TONE_IDX = window.CHENGYU_SPELL_TONE || {};
  var PLAIN_IDX = window.CHENGYU_SPELL || {};
  var LETTERS = Object.keys(GROUPS).sort();
  var FLAT = [];
  LETTERS.forEach(function (k) { FLAT = FLAT.concat(GROUPS[k]); });

  var HINTS = {
    '汉字': '例如:“美”、“五十”',
    '拼音': '例如:“guang”、“guang3”(3代表音调)',
    '笔画数': '例如:"4,6,2,6"、“6”'
  };
  var TONES = { a: 'āáǎà', o: 'ōóǒò', e: 'ēéěè', i: 'īíǐì', u: 'ūúǔù', v: 'ǖǘǚǜ' };

  function toneMark(spell) {
    var m = spell.match(/^([a-zv]+)([1-4])$/);
    if (!m) return spell;
    var body = m[1], tone = +m[2] - 1;
    var order = ['a', 'o', 'e', 'i', 'u', 'v'];
    for (var i = 0; i < order.length; i++) {
      var ch = order[i];
      var pos = body.indexOf(ch);
      if (pos >= 0) {
        if (ch === 'i' && body.indexOf('u') > pos) { ch = 'u'; pos = body.indexOf('u'); } // iu -> 标 u
        return body.slice(0, pos) + TONES[ch][tone] + body.slice(pos + 1);
      }
    }
    return spell;
  }

  function bySpell(q) {
    q = q.toLowerCase().replace(/ü/g, 'v');
    var hasTone = /[1-4]$/.test(q);
    var idx = hasTone ? TONE_IDX : PLAIN_IDX;
    var key = hasTone ? toneMark(q) : q;
    var out = [];
    LETTERS.forEach(function (letter) {
      var list = idx[letter];
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        var kv = list[i].split(':');
        if (kv[0] !== key) continue;
        var start = +kv[1];
        var end = i + 1 < list.length ? +list[i + 1].split(':')[1] : GROUPS[letter].length;
        out = out.concat(GROUPS[letter].slice(start, end));
      }
    });
    return out;
  }

  function byStroke(q) {
    var nums = q.split(/[,，]/).map(function (s) { return parseInt(s.trim(), 10); }).filter(function (n) { return !isNaN(n); });
    if (!nums.length) return [];
    return FLAT.filter(function (idiom) {
      var chars = idiom.replace(/[^一-龥]/g, '');
      if (chars.length < nums.length) return false;
      for (var i = 0; i < nums.length; i++) {
        if (window.cnchar.stroke(chars[i]) !== nums[i]) return false;
      }
      return true;
    });
  }

  var input = document.querySelector('.pc-content input.MuiInputBase-input');
  var hintEl = null;
  var mode = '汉字';
  var btn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('查询') >= 0) btn = b;
  });
  // 提示行：input 容器后面的 p
  var pcs = document.querySelectorAll('.pc-content p');
  pcs.forEach(function (p) { if (p.textContent.indexOf('例如') >= 0) hintEl = p; });

  document.querySelectorAll('.pc-content input[type="radio"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var label = r.closest('label');
      mode = label ? label.textContent.trim() : '汉字';
      if (hintEl) hintEl.textContent = HINTS[mode] || '';
    });
  });

  var resultHost = document.createElement('div');
  if (btn) btn.parentElement.appendChild(resultHost);

  if (btn) btn.addEventListener('click', function () {
    var q = (input.value || '').trim();
    resultHost.innerHTML = '';
    if (!q) return;
    var res;
    if (mode === '拼音') res = bySpell(q);
    else if (mode === '笔画数') res = byStroke(q);
    else res = FLAT.filter(function (c) { return c.indexOf(q) === 0; });
    resultHost.innerHTML = res.map(function (c) { return '<div>' + c + '</div>'; }).join('');
  });
})();
