/* 翻译：5 家翻译站 iframe 聚合，tab 切换 src */
(function () {
  var SRC = {
    '搜狗翻译': 'https://fanyi.sogou.com/text',
    '腾讯翻译': 'https://fanyi.qq.com',
    '有道翻译': 'https://fanyi.youdao.com',
    '微软翻译': 'https://www.bing.com/translator',
    'CNKI学术翻译': 'https://dict.cnki.net/index'
  };
  var frame = document.getElementById('navFrame');
  var lis = document.querySelectorAll('.main-content ul.nav li');
  lis.forEach(function (li) {
    li.querySelector('a').addEventListener('click', function (e) {
      e.preventDefault();
      lis.forEach(function (o) { o.classList.remove('active'); o.querySelector('a').style.color = ''; });
      li.classList.add('active');
      li.querySelector('a').style.color = 'rgb(73, 80, 87)';
      var name = li.textContent.trim();
      if (frame && SRC[name]) frame.src = SRC[name];
    });
  });
})();
