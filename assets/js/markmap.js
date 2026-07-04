/* 便捷思维导图：markmap-lib/view 渲染，含全屏视图 */
(function () {
  var mk = window.markmap;
  if (!mk) return;
  var transformer = new mk.Transformer();
  function renderTo(svg, md) {
    svg.innerHTML = '';
    var r = transformer.transform(md || '');
    if (svg.__mm) { svg.__mm.setData(r.root); svg.__mm.fit(); return; }
    svg.__mm = mk.Markmap.create(svg, null, r.root);
  }
  var normal = document.querySelectorAll('.pc-content .markmap');
  // 结构：div.markmap 容器 > .flex-1(编辑区) + svg.flex-2.markmap
  var areas = [];
  document.querySelectorAll('.pc-content div.markmap').forEach(function (wrap) {
    var ta = wrap.querySelector('textarea:not([aria-hidden])');
    var svg = wrap.querySelector('svg.markmap');
    var btn = null;
    wrap.querySelectorAll('button').forEach(function (b) { if (b.textContent.indexOf('渲染导图') >= 0) btn = b; });
    if (ta && svg) areas.push({ ta: ta, svg: svg, btn: btn });
  });
  areas.forEach(function (a) {
    if (a.btn) a.btn.addEventListener('click', function () { renderTo(a.svg, a.ta.value); });
    renderTo(a.svg, a.ta.value);
  });
  // 全屏
  var fsBtn = document.querySelector('.full-screen-btn-container');
  var fsWrap = document.querySelector('.full-screen-container');
  if (fsBtn && fsWrap) {
    fsBtn.addEventListener('click', function () {
      fsWrap.style.visibility = 'visible';
      var fsArea = areas[1];
      if (fsArea) {
        if (areas[0]) fsArea.ta.value = areas[0].ta.value;
        renderTo(fsArea.svg, fsArea.ta.value);
      }
    });
    var quit = fsWrap.querySelector('.quit-full-screen-btn');
    if (quit) quit.addEventListener('click', function () { fsWrap.style.visibility = 'hidden'; });
  }
})();
