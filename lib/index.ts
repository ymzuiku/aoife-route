import queryString from "./queryString";

export interface AoifeRouteProps {
  root?: boolean;
  url: string | (() => boolean);
  render: any;
  preload?: boolean;
}

/** 添加 window.listen */
const listFn = [] as any[];

["popstate", "pushState", "replaceState"].forEach((v) => {
  window.addEventListener(v, () => {
    Route.state = queryString.parse(location.search);
    listFn.forEach((fn) => fn());
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
let n = 0;

/** 路由 */
const Route = ({ root, url, render, preload }: AoifeRouteProps) => {
  if (typeof render !== "function") {
    throw "AoifeRoute.render need a Function";
  }

  n += 1;
  const tar = "" + n;

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
      let isInRoot = false;
      if (root && window.location.pathname === "/") {
        isInRoot = true;
      }

      /** 非击中的路由 */
      if (!isInRoot && queryString.decode(window.location.pathname) !== url) {
        return renderEmpty(tar);
      }
    }

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
          old.replaceWith(nextEle);
        }
      });
      return tempEle;
    }

    out.setAttribute("aoife-route", tar);
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
Route.push = (url: string, state?: any, ignoreScrollTop?: boolean) => {
  if (state) {
    url += "?" + queryString.stringify(state);
  }
  history.pushState(state, "", url);
  window.dispatchEvent(new Event("pushState"));
  if (!ignoreScrollTop) {
    document.documentElement.scrollTo({ top: 0 });
  }
};
Route.replace = (url: string, state?: any, ignoreScrollTop?: boolean) => {
  if (state) {
    url += "?" + queryString.stringify(state);
  }
  history.replaceState(state, "", url);
  window.dispatchEvent(new Event("replaceState"));
  if (!ignoreScrollTop) {
    if (window.scrollTo) {
      window.scrollTo({ top: 0 });
    }
    if (document.body && document.body.scrollTo) {
      document.body.scrollTo({ top: 0 });
    }
    if (document.documentElement && document.documentElement.scrollTo) {
      document.documentElement.scrollTo({ top: 0 });
    }
  }
};

Route.back = () => {
  history.back();
};

export default Route;
