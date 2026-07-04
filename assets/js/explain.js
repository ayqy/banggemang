/* 词语注解：unpkg cnchar-data 按首字懒加载词典（与线上一致） */
(function () {
  var input = document.querySelector('.pc-content input.MuiInputBase-input');
  var btn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('注解查询') >= 0) btn = b;
  });
  if (!btn) return;
  var ul = document.querySelector('.pc-content ul');
  if (!ul) { ul = document.createElement('ul'); btn.parentElement.appendChild(ul); }
  var tipEl = document.querySelector('.pc-content p') || (function () {
    var p = document.createElement('p'); btn.parentElement.insertBefore(p, btn); return p;
  })();
  var cache = {};
  function lookup(word) {
    var first = word[0];
    var p = cache[first] || (cache[first] = fetch('https://unpkg.com/cnchar-data@latest/explanation/' + encodeURIComponent(first) + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }));
    return p.then(function (dict) { return dict[word] || ''; });
  }
  btn.addEventListener('click', function () {
    var word = (input.value || '').trim();
    tipEl.textContent = '';
    ul.innerHTML = '';
    if (!word) { tipEl.textContent = '请输入查询汉词'; return; }
    lookup(word).then(function (text) {
      if (text) ul.innerHTML = '<li class="initialize">' + text + '</li>';
      else ul.innerHTML = '<li class="initialize">词汇还没合适注解</li>';
    });
  });
})();
