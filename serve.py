#!/usr/bin/env python3
"""本地服务器（可选）：静态托管 + /api、/cgi-bin 反向代理到线上（供“去手写”等云端能力使用）。
用法：python3 serve.py  →  http://localhost:8210/index.html
"""
import http.server
import urllib.request

UPSTREAM = 'https://tool.browser.qq.com'
PORT = 8210


class Handler(http.server.SimpleHTTPRequestHandler):
    def _proxy(self):
        url = UPSTREAM + self.path
        body = None
        if self.command == 'POST':
            length = int(self.headers.get('Content-Length') or 0)
            body = self.rfile.read(length) if length else None
        req = urllib.request.Request(url, data=body, method=self.command)
        for h in ('Content-Type', 'Cookie', 'User-Agent'):
            if self.headers.get(h):
                req.add_header(h, self.headers[h])
        req.add_header('Referer', UPSTREAM + '/')
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
                self.send_response(r.status)
                self.send_header('Content-Type', r.headers.get('Content-Type', 'application/json'))
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_error(502, str(e))

    def do_GET(self):
        if self.path.startswith(('/api/', '/cgi-bin/')):
            return self._proxy()
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith(('/api/', '/cgi-bin/')):
            return self._proxy()
        self.send_error(404)


if __name__ == '__main__':
    print(f'Serving on http://localhost:{PORT}/index.html  (Ctrl+C 退出)')
    http.server.ThreadingHTTPServer(('', PORT), Handler).serve_forever()
