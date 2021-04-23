import queryString from "querystring-number";

const ua = navigator.userAgent.toLocaleLowerCase();
const isIOS = /(?:iphone)/.test(ua);
const isWechat = /micromessenger/.test(ua);

export interface AoifeRouteProps {
  url: string | (() => boolean);
  render: any;
  cache?: boolean;
  preload?: boolean | number;
}

const caches = {} as { [key: string]: HTMLElement };

/** 添加 window.listen */
const listFn = [] as any[];

["popstate", "pushState", "replaceState", "backState"].forEach((v) => {
  window.addEventListener(v, () => {
    Route.state = queryString.parse(location.search);
    listFn.forEach((fn) => fn());
    if (v === "popstate" || v === "backState") {
      delete caches[_lastUrl];
    }
    if (v === "popstate") {
      _urls.pop();
    }
  });
});

/** 渲染空元素 */
function renderEmpty(tar: string) {
  const span = document.createElement("span");
  span.style.display = "none";
  span.setAttribute("aoife-route", tar);
  return span;
}

/** 路由编码 */
let _n = 0;
/** 忽略页面缓存 */
let _ignoreCache = false;
/** 记录上一个URL */
let _lastUrl = "";
const _urls = [] as { state: any; url: string }[];
const renderFns = {} as { [key: string]: any };

/** 路由 */
const Route = ({ url, render, preload, cache }: AoifeRouteProps) => {
  // if (url === "/" && url !== Route.rootURL) {
  //   Route.push(Route.rootURL);
  //   return renderEmpty("/__rootURL");
  // }
  if (typeof render !== "function") {
    throw "AoifeRoute.render need a Function";
  }

  if (!preload && typeof url === "string") {
    renderFns[url] = render;
  }

  _n += 1;
  const tar = "" + _n;

  const fn = () => {
    /** 预渲染 */
    if (preload) {
      const time = typeof preload === "number" ? preload : 50;
      setTimeout(() => {
        render();
      }, time);
    }

    if (typeof url === "function") {
      if (!url()) {
        return renderEmpty(tar);
      }
    } else {
      // let isInRoot = false;
      // if (root && window.location.pathname === "/") {
      //   isInRoot = true;
      // }
      // /** 非击中的路由 */
      if (queryString.decode(window.location.pathname) !== url) {
        return renderEmpty(tar);
      }
      // return renderEmpty(tar);
    }

    // 对元素做一个缓存
    if (typeof url === "string" && caches[url]) {
      const out = caches[url];

      // 兼容 aoife 更新历史页面
      let ao = (window as any).aoife;
      if (ao) {
        ao.waitAppend(out).then(() => {
          ao.next(out);
        });
      }
      return out;
    }

    const isNeedCache = cache && !_ignoreCache && typeof url == "string";
    _ignoreCache = false;

    /** 击中的路由，但是为一个异步对象 */
    const out = render();
    if (out.then) {
      const tempEle = renderEmpty(tar);
      Promise.resolve(out).then((v) => {
        if (v.default) {
          const old = document.querySelector(`[aoife-route="${tar}"]`);
          if (!old) {
            return;
          }
          const nextEle = v.default();
          nextEle.setAttribute("aoife-route", tar);
          // 对元素做一个缓存
          if (isNeedCache) {
            caches[url as string] = nextEle;
          }
          old.replaceWith(nextEle);
        }
      });
      return tempEle;
    }

    out.setAttribute("aoife-route", tar);

    // 对元素做一个缓存
    if (isNeedCache) {
      caches[url as string] = out;
    }
    return out;
  };
  listFn.push(() => {
    const old = document.querySelector(`[aoife-route="${tar}"]`);
    if (!old) {
      return;
    }
    old.replaceWith(fn());
  });
  return fn();
};

Route.onlyReplace = isWechat && isIOS;

Route.preload = (url: string) => {
  const fn = renderFns[url];
  if (typeof fn === "function") {
    fn();
    // 每个 url，preload 只需要加载一次执行一次
    renderFns[url] = true;
  }
};
Route.state = {};
Route.queryString = queryString;
Route.push = (
  url: string,
  state?: any,
  {
    ignoreScrollTop,
    ignoreCache,
  }: { ignoreScrollTop?: boolean; ignoreCache?: boolean } = {}
) => {
  if (Route.onlyReplace) {
    Route.replace(url, state, { ignoreCache, ignoreScrollTop });
    return;
  }
  _urls.push({ state, url });
  if (state) {
    url += "?" + queryString.stringify(state);
  }
  if (!ignoreScrollTop) {
    if (window.scrollTo) {
      window.scrollTo({ top: 0 });
    }
  }
  setTimeout(() => {
    if (ignoreCache) {
      _ignoreCache = true;
    }
    history.pushState(state, "", url);
    window.dispatchEvent(new Event("pushState"));
  });
};
Route.replace = (
  url: string,
  state?: any,
  {
    ignoreScrollTop,
    ignoreCache,
  }: { ignoreScrollTop?: boolean; ignoreCache?: boolean } = {}
) => {
  _urls.push({ state, url });

  if (state) {
    url += "?" + queryString.stringify(state);
  }
  if (!ignoreScrollTop) {
    if (window.scrollTo) {
      window.scrollTo({ top: 0 });
    }
  }
  setTimeout(() => {
    if (ignoreCache) {
      _ignoreCache = true;
    }
    history.replaceState(state, "", url);
    window.dispatchEvent(new Event("replaceState"));
  });
};

const _back = () => {
  _lastUrl = location.pathname;
  // 若在第一个页面，点返回，重新渲染 '/'
  if (_urls.length === 0) {
    history.replaceState({}, "", "/");
    window.dispatchEvent(new Event("backState"));
    return;
  }

  // 处理不增加 history 的方案返回
  if (Route.onlyReplace) {
    _urls.pop();
    if (_urls.length === 0) {
      history.replaceState({}, "", "/");
    } else {
      const { state, url } = _urls[_urls.length - 1];
      history.replaceState(state, "", url);
    }

    window.dispatchEvent(new Event("backState"));
    return;
  }

  history.back();
};

const __back = (num = 1, callback?: Function) => {
  if (num <= 0) {
    if (callback) {
      setTimeout(() => {
        callback();
      });
    }
    return;
  }
  num -= 1;
  _back();
  setTimeout(() => {
    __back(num, callback);
  });
};

Route.back = (num = 1) => {
  return new Promise((res) => {
    __back(num, res);
  });
};

Route.rootURL = "/";

export default Route;
