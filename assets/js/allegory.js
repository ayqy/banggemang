/* 歇后语：前半含关键词模糊匹配，分组 z→a 倒序遍历，编号输出 */
(function () {
  var DATA = window.XIEHOUYU_DATA || {};
  var keys = Object.keys(DATA).sort().reverse();
  var input = document.querySelector('.pc-content input.MuiInputBase-input');
  var btn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('歇后语查询') >= 0) btn = b;
  });
  var ul = document.querySelector('.pc-content ul');
  if (!ul) {
    ul = document.createElement('ul');
    var host = btn ? btn.parentElement : document.querySelector('.pc-content');
    host.appendChild(ul);
  }
  if (!btn) return;
  btn.addEventListener('click', function () {
    var q = (input.value || '').trim();
    ul.innerHTML = '';
    if (!q) return;
    var res = [];
    keys.forEach(function (k) {
      (DATA[k] || []).forEach(function (pair) {
        if (pair[0].indexOf(q) >= 0) res.push(pair);
      });
    });
    ul.innerHTML = res.map(function (p, i) {
      return '<li>' + (i + 1) + '、' + p[0] + '-' + p[1] + '</li>';
    }).join('');
  });
})();
