import queryString from "querystring-number";

const ua = navigator.userAgent;
const isIOS = /(?:iphone)/.test(ua);
const isWechat = /MicroMessenger/.test(ua);
const isOnlyReplace = isWechat && isIOS;

export interface AoifeRouteProps {
  url: string | (() => boolean);
  render: any;
  cache?: boolean;
  preload?: boolean;
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

/** 路由 */
const Route = ({ url, render, preload, cache }: AoifeRouteProps) => {
  if (typeof render !== "function") {
    throw "AoifeRoute.render need a Function";
  }

  _n += 1;
  const tar = "" + _n;

  const fn = () => {
    /** 预渲染 */
    if (preload) {
      render();
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
  if (isOnlyReplace) {
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

Route.back = () => {
  _lastUrl = location.pathname;
  // 若在第一个页面，点返回，重新渲染 '/'
  if (_urls.length === 0) {
    history.replaceState({}, "", "/");
    window.dispatchEvent(new Event("backState"));
    return;
  }

  // 处理不增加 history 的方案返回
  if (isOnlyReplace) {
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

export default Route;
