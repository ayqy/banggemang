/* 汉字偏旁：逐字部首，逗号分隔；字母数字原样；其他非汉字为空 */
(function () {
  var tas = document.querySelectorAll('.pc-content textarea:not([aria-hidden])');
  var input = tas[0], output = tas[1];
  var btn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('查询') >= 0) btn = b;
  });
  if (!btn) return;
  btn.addEventListener('click', function () {
    var text = (input.value || '').trim();
    if (!text) { if (output) output.value = ''; return; }
    var parts = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (/[一-龥]/.test(ch)) {
        try {
          var r = window.cnchar.radical(ch);
          parts.push((r && r[0] && r[0].radical) || '');
        } catch (e) { parts.push(''); }
      } else if (/[A-Za-z0-9]/.test(ch)) {
        parts.push(ch);
      } else {
        parts.push('');
      }
    }
    if (output) output.value = parts.join(',');
  });
})();
