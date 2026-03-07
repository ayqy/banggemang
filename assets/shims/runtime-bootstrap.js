(function () {
  var nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  var NativeXHR = window.XMLHttpRequest;
  var linkMap = window.__QBTOOL_LINK_MAP__ || { localPages: {}, remoteBase: 'https://tool.browser.qq.com' };
  var fixtures = window.__QBTOOL_FIXTURES__ || {};
  var remoteBase = linkMap.remoteBase || 'https://tool.browser.qq.com';
  var telemetryMatchers = [
    'google-analytics.com',
    'galileotelemetry.tencent.com',
    'otheve.beacon.qq.com',
    'beacon.cdn.qq.com',
    'aegiscontrol',
    'h.trace.qq.com',
    'htrace.wetvinfo.com',
    'svibeacon.onezapp.com',
    'oth.str.beacon.qq.com'
  ];

  function isTelemetry(url) {
    return telemetryMatchers.some(function (matcher) {
      return url.indexOf(matcher) > -1;
    });
  }

  function normalizeUrl(input) {
    if (!input) {
      return '';
    }
    if (/^https?:\/\//i.test(input)) {
      return input;
    }
    if (/^\/\//.test(input)) {
      return 'https:' + input;
    }
    if (input.charAt(0) === '/') {
      return remoteBase + input;
    }
    if (window.location.protocol === 'file:') {
      return new URL(input, remoteBase + '/').toString();
    }
    return new URL(input, window.location.href).toString();
  }

  function createJsonResponse(payload) {
    return {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    };
  }

  function createTextResponse(payload) {
    return {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: String(payload)
    };
  }

  function getStatisticsFallback() {
    var fallback = fixtures.statisticsFallback || { count: '367174539' };
    return fallback.count || '367174539';
  }

  function fetchLiveStatistics() {
    if (!nativeFetch || window.location.protocol === 'file:') {
      return Promise.resolve(getStatisticsFallback());
    }
    return nativeFetch(remoteBase + '/category/education', {
      headers: {
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('status:' + response.status);
      }
      return response.text();
    }).then(function (html) {
      var match = html.match(/工具箱已累计帮助了\s*<b[^>]*>(\d+)<\/b>\s*人次/);
      if (!match) {
        match = html.match(/工具箱已累计帮助了\s*(\d+)\s*人次/);
      }
      return match ? match[1] : getStatisticsFallback();
    }).catch(function () {
      return getStatisticsFallback();
    });
  }

  function proxyTextResource(url) {
    if (!nativeFetch) {
      return Promise.resolve(createTextResponse(''));
    }
    return nativeFetch(url).then(function (response) {
      if (!response.ok) {
        throw new Error('status:' + response.status);
      }
      return response.text();
    }).then(function (body) {
      return createTextResponse(body);
    });
  }

  function resolveStub(method, url) {
    if (isTelemetry(url)) {
      return Promise.resolve(createJsonResponse((fixtures.sharedStubs || {}).emptySuccess || { ret: 0, msg: 'succ' }));
    }
    if (/^https:\/\/unpkg\.com\/cnchar-data@latest\/explanation\//.test(url)) {
      return proxyTextResource(url).catch(function () {
        return createTextResponse('{}');
      });
    }
    if (/\/api\/get_tool_list(\?|$)/.test(url)) {
      return Promise.resolve(createJsonResponse(fixtures.toolList || { ret: 0, msg: 'succ', data: [] }));
    }
    if (/\/api\/getToken(\?|$)/.test(url)) {
      return Promise.resolve(createJsonResponse((fixtures.sharedStubs || {}).token || { ret: 0, token: '' }));
    }
    if (/\/api\/getLoginInfo(\?|$)/.test(url)) {
      return Promise.resolve(createJsonResponse((fixtures.sharedStubs || {}).loginInfo || { ret: 0, data: { logo: '', nick_name: '', qbid: '' } }));
    }
    if (/\/api\/addToolPV(\?|$)/.test(url) || /\/cgi-bin\/tools\/report(\?|$)/.test(url)) {
      return Promise.resolve(createJsonResponse((fixtures.sharedStubs || {}).emptySuccess || { ret: 0, msg: 'succ' }));
    }
    if (/\/cgi-bin\/tools\/get_statistics(\?|$)/.test(url)) {
      return fetchLiveStatistics().then(function (count) {
        return createTextResponse(count);
      });
    }
    return null;
  }

  function rewriteHrefValue(href) {
    if (!href || href.indexOf('javascript:') === 0 || href.charAt(0) === '#') {
      return href;
    }
    if (/^https?:\/\//i.test(href)) {
      var absoluteUrl = new URL(href);
      if (absoluteUrl.origin === remoteBase) {
        return linkMap.localPages[absoluteUrl.pathname] || href;
      }
      return href;
    }
    if (/^\/\//.test(href)) {
      return 'https:' + href;
    }
    var pathname = href.charAt(0) === '/' ? href : new URL(href, remoteBase + '/').pathname;
    if (linkMap.localPages[pathname]) {
      return linkMap.localPages[pathname];
    }
    return pathname.charAt(0) === '/' ? remoteBase + pathname : href;
  }

  function rewriteLinks(root) {
    var scope = root || document;
    var anchors = scope.querySelectorAll ? scope.querySelectorAll('a[href]') : [];
    Array.prototype.forEach.call(anchors, function (anchor) {
      var rewritten = rewriteHrefValue(anchor.getAttribute('href'));
      if (rewritten) {
        anchor.setAttribute('href', rewritten);
      }
    });
  }

  function watchDomChanges() {
    if (!window.MutationObserver) {
      return;
    }
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        if (record.target && record.target.nodeType === 1) {
          rewriteLinks(record.target);
        }
        Array.prototype.forEach.call(record.addedNodes || [], function (node) {
          if (node && node.nodeType === 1) {
            rewriteLinks(node);
          }
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function bindAnchorDelegation() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      var anchor = target && target.closest ? target.closest('a[href]') : null;
      if (!anchor) {
        return;
      }
      var rawHref = anchor.getAttribute('href');
      var rewritten = rewriteHrefValue(rawHref);
      if (!rewritten || rewritten === rawHref) {
        return;
      }
      anchor.setAttribute('href', rewritten);
      if (window.location.protocol !== 'file:' || rewritten.indexOf('./') !== 0) {
        return;
      }
      event.preventDefault();
      var absoluteHref = new URL(rewritten, window.location.href).toString();
      if (anchor.target === '_blank') {
        window.open(absoluteHref, '_blank');
        return;
      }
      window.location.href = absoluteHref;
    }, true);
  }

  function makeFetchResponse(result) {
    return new Response(result.body, {
      status: result.status,
      headers: result.headers
    });
  }

  if (nativeFetch) {
    window.fetch = function (input, init) {
      var rawUrl = typeof input === 'string' ? input : input.url;
      var url = normalizeUrl(rawUrl);
      var stub = resolveStub((init && init.method) || 'GET', url);
      if (stub) {
        return Promise.resolve(stub).then(makeFetchResponse);
      }
      if (typeof input === 'string' && rawUrl.charAt(0) === '/') {
        input = remoteBase + rawUrl;
      }
      return nativeFetch(input, init);
    };
  }

  function FakeXMLHttpRequest() {
    this._headers = {};
    this._listeners = {};
    this.readyState = 0;
    this.status = 0;
    this.responseText = '';
    this.response = '';
    this.responseType = '';
    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;
    this.onloadend = null;
  }

  FakeXMLHttpRequest.prototype.addEventListener = function (type, listener) {
    if (!type || typeof listener !== 'function') {
      return;
    }
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(listener);
  };

  FakeXMLHttpRequest.prototype.removeEventListener = function (type, listener) {
    var listeners = this._listeners[type] || [];
    this._listeners[type] = listeners.filter(function (current) {
      return current !== listener;
    });
  };

  FakeXMLHttpRequest.prototype._emit = function (type, payload) {
    var listeners = this._listeners[type] || [];
    listeners.forEach(function (listener) {
      listener.call(this, payload);
    }, this);
  };

  FakeXMLHttpRequest.prototype.open = function (method, url) {
    this._method = method || 'GET';
    this._url = url;
    this.readyState = 1;
    if (typeof this.onreadystatechange === 'function') {
      this.onreadystatechange();
    }
  };

  FakeXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
    this._headers[key] = value;
  };

  FakeXMLHttpRequest.prototype.getAllResponseHeaders = function () {
    return this._responseHeaders || 'content-type: text/plain; charset=utf-8';
  };

  FakeXMLHttpRequest.prototype.getResponseHeader = function (name) {
    var headers = this.getAllResponseHeaders().split('\r\n');
    var lowerName = String(name || '').toLowerCase();
    for (var index = 0; index < headers.length; index += 1) {
      var header = headers[index];
      if (!header) {
        continue;
      }
      var separator = header.indexOf(':');
      if (separator === -1) {
        continue;
      }
      var key = header.slice(0, separator).trim().toLowerCase();
      if (key === lowerName) {
        return header.slice(separator + 1).trim();
      }
    }
    return null;
  };

  FakeXMLHttpRequest.prototype.send = function () {
    var self = this;
    var normalized = normalizeUrl(this._url || '');
    var stub = resolveStub(this._method, normalized);

    function complete(result) {
      self.status = result.status;
      self.responseText = result.body;
      self.response = result.body;
      self._responseHeaders = Object.keys(result.headers || {}).map(function (key) {
        return key + ': ' + result.headers[key];
      }).join('\r\n');
      self.readyState = 4;
      if (typeof self.onreadystatechange === 'function') {
        self.onreadystatechange();
      }
      self._emit('readystatechange', { target: self, currentTarget: self, type: 'readystatechange' });
      self._emit('readystatechange', { target: self, currentTarget: self, type: 'readystatechange' });
      if (typeof self.onload === 'function') {
        self.onload();
      }
      self._emit('load', { target: self, currentTarget: self, type: 'load' });
      self._emit('load', { target: self, currentTarget: self, type: 'load' });
      if (typeof self.onloadend === 'function') {
        self.onloadend();
      }
      self._emit('loadend', { target: self, currentTarget: self, type: 'loadend' });
      self._emit('loadend', { target: self, currentTarget: self, type: 'loadend' });
    }

    if (stub) {
      Promise.resolve(stub).then(function (result) {
        complete(result);
      }).catch(function () {
        if (typeof self.onerror === 'function') {
          self.onerror(new Error('stub error'));
        }
      });
      return;
    }

    var delegate = new NativeXHR();
    this._delegate = delegate;

    delegate.onreadystatechange = function () {
      self.readyState = delegate.readyState;
      self.status = delegate.status;
      self.responseText = delegate.responseText;
      self.response = delegate.response;
      if (typeof self.onreadystatechange === 'function') {
        self.onreadystatechange();
      }
    };
    delegate.onload = function () {
      self.status = delegate.status;
      self.responseText = delegate.responseText;
      self.response = delegate.response;
      if (typeof self.onload === 'function') {
        self.onload();
      }
    };
    delegate.onerror = function (error) {
      if (typeof self.onerror === 'function') {
        self.onerror(error);
      }
      self._emit('error', { target: self, currentTarget: self, type: 'error', error: error });
    };
    delegate.onloadend = function () {
      if (typeof self.onloadend === 'function') {
        self.onloadend();
      }
    };

    delegate.open(this._method, normalized, true);
    Object.keys(this._headers).forEach(function (key) {
      delegate.setRequestHeader(key, self._headers[key]);
    });
    delegate.send.apply(delegate, arguments);
  };

  window.XMLHttpRequest = FakeXMLHttpRequest;

  function initialize() {
    rewriteLinks(document);
    watchDomChanges();
    bindAnchorDelegation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  window.addEventListener('load', function () {
    rewriteLinks(document);
    setTimeout(function () {
      rewriteLinks(document);
    }, 500);
  });
}());
