#!/usr/bin/env python3
"""从 research/rendered/*.html（线上渲染快照）装配本地静态页面。

原则：DOM 结构 / 类名 / 文案与线上完全一致；仅做四类改写——
 1) 移除线上脚本与统计（bundle/GTM/beacon）
 2) 静态资源本地化（CSS/图片/favicon）
 3) 链接改写（16 个教育工具 → 本地页；其余保持线上绝对地址）
 4) 注入本地实现脚本（common/mui-lite/工具逻辑/数据）
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, 'research')

EDU = ('handwriting_erasure zitie_new relatives_name school wordcount dynasties capital '
       'jielong markmap hanzifayin periodic translate radical allegory explain chengyujielong').split()

IMG_MAP = json.load(open(os.path.join(ROOT, 'assets/img/_map.json')))

COMMON_SCRIPTS = ['data/tools-meta.js', 'assets/vendor/qrcode.js', 'assets/js/common.js']
PAGE_SCRIPTS = {
    'index': [],
    'school': ['data/school.js', 'assets/js/school.js'],
    'wordcount': ['assets/js/wordcount.js'],
    'radical': ['assets/vendor/cnchar/cnchar.min.js', 'assets/vendor/cnchar/cnchar.radical.min.js',
                'assets/js/radical.js'],
    'allegory': ['data/xiehouyu.js', 'assets/js/allegory.js'],
    'explain': ['assets/js/explain.js'],
    'chengyujielong': ['data/chengyu.js', 'assets/vendor/cnchar/cnchar.min.js', 'assets/js/chengyujielong.js'],
    'jielong': ['data/chengyu.js', 'assets/vendor/cnchar/cnchar.min.js', 'assets/js/jielong.js'],
    'hanzifayin': ['assets/js/hanzifayin.js'],
    'relatives_name': ['assets/vendor/relationship.min.js', 'assets/js/relatives_name.js'],
    'markmap': ['assets/vendor/markmap/d3.min.js', 'assets/vendor/markmap/markmap-view.js',
                'assets/vendor/markmap/markmap-lib.js', 'assets/js/markmap.js'],
    'zitie_new': ['data/zitie-grades.js', 'assets/js/zitie_new.js'],
    'translate': ['assets/js/translate.js'],
    'handwriting_erasure': ['assets/js/handwriting_erasure.js'],
    'capital': [], 'dynasties': [], 'periodic': [],
}


def empty_div(html, open_marker):
    """清空 open_marker 定位的 div 的内部内容（按 div 嵌套深度平衡定位闭合标签）。"""
    i = html.find(open_marker)
    if i < 0:
        raise RuntimeError(f'marker not found: {open_marker}')
    start = html.find('>', i) + 1
    depth = 1
    for m in re.finditer(r'<div\b|</div>', html[start:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return html[:start] + html[start + m.start():]
    raise RuntimeError('unbalanced div')


def build(name):
    html = open(os.path.join(R, 'rendered', f'{name}.html'), errors='replace').read()

    # 1) 移除脚本 / noscript / 空 style（emotion speedy 模式的空壳）
    html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<noscript>.*?</noscript>', '', html, flags=re.S)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.S)

    # 2) CSS 本地化
    html = html.replace('https://static.res.qq.com/qbtool/css/pchome.00b6f.css', 'assets/css/pchome.css')
    html = re.sub(r'https://static\.res\.qq\.com/qbtool/css/([a-z_]+)\.00b6f\.css', r'assets/css/\1.css', html)
    extra = f'<link href="assets/css/emotion-{name}.css" rel="stylesheet">' if name != 'index' and \
        os.path.getsize(os.path.join(ROOT, f'assets/css/emotion-{name}.css')) > 0 else ''
    html = html.replace('</head>', f'{extra}<link href="assets/css/site-extra.css" rel="stylesheet"></head>')

    # 3) 图片本地化（含 apple-touch icon 与翻译 tab favicon）
    for u, n in {
        'https://dlweb.sogoucdn.com/translate/favicon.ico': 'favicon-sogou.ico',
        'https://fanyi.qq.com/favicon.ico': 'favicon-qq.ico',
        'https://shared.ydstatic.com/images/favicon.ico': 'favicon-youdao.ico',
        # CNKI favicon 源站反爬无法本地化，保留线上直链（浏览器端可正常加载，与线上一致）
    }.items():
        html = html.replace(u, f'assets/img/{n}')
    for url, local in IMG_MAP.items():
        html = html.replace(url, f'assets/img/{local}')
    html = html.replace('href="/favicon.ico"', 'href="./favicon.ico"')

    # 4) 链接改写
    for p in EDU:
        html = html.replace(f'href="/{p}.html"', f'href="./{p}.html"')
    html = re.sub(r'href="/category/([a-z_]+)"', r'href="https://tool.browser.qq.com/category/\1"', html)
    html = re.sub(r'href="/"', 'href="https://tool.browser.qq.com/"', html)

    # 5) 页面特例
    if name == 'zitie_new':  # 1.7MB 渲染结果清空，由 JS 按数据重建
        html = empty_div(html, '<div class="print-content"')
    if name == 'markmap':  # 导图 SVG 清空为骨架，由 markmap-view 挂载
        html = re.sub(r'<svg class="flex-2 markmap[^"]*">.*?</svg>', '<svg class="flex-2 markmap"></svg>',
                      html, flags=re.S)

    # 6) 注入本地脚本
    scripts = COMMON_SCRIPTS + (['assets/js/mui-lite.js'] if name != 'index' else []) + PAGE_SCRIPTS[name]
    tags = ''.join(f'<script src="{s}"></script>' for s in scripts)
    html = html.replace('</body>', f'{tags}</body>')

    out = os.path.join(ROOT, 'index.html' if name == 'index' else f'{name}.html')
    # 线上页面无 DOCTYPE（quirks 模式），保持一致以获得相同的盒模型渲染
    open(out, 'w').write(html)
    return out, len(html)


if __name__ == '__main__':
    for n in ['index'] + EDU:
        out, size = build(n)
        print(f'{os.path.basename(out):28s} {size:9d}')
