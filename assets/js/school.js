/* 高校查询：radio 筛选 + 表格渲染 */
(function () {
  var DATA = window.SCHOOL_DATA || [];
  var tbody = document.querySelector('.pc-content tbody');
  if (!tbody) return;
  var TD = 'MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft MuiTableCell-sizeMedium css-q34dxg';
  function yn(v) {
    return v ? '<span style="color: rgb(0, 154, 97);">是</span>' : '<span style="color: rgb(231, 76, 60);">否</span>';
  }
  function render(filter) {
    var rows = DATA.filter(function (s) {
      if (filter === '全部') return true;
      if (filter === '985') return s['985'];
      if (filter === '211') return s['211'];
      return s.syl === filter;
    });
    tbody.innerHTML = rows.map(function (s) {
      return '<tr class="MuiTableRow-root css-1gqug66">' +
        '<td class="' + TD + '">' + s.name + '</td>' +
        '<td class="' + TD + '">' + yn(s['985']) + '</td>' +
        '<td class="' + TD + '">' + yn(s['211']) + '</td>' +
        '<td class="' + TD + '">' + s.syl + '</td></tr>';
    }).join('');
  }
  document.querySelectorAll('.pc-content input[type="radio"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var label = r.closest('label');
      var txt = label ? label.textContent.trim() : '全部';
      render(txt);
    });
  });
  render('全部');
})();
