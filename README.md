# aoife-route

一个极轻量的原生 js 路由，不需要顶层包裹，可以嵌入在局部元素中使用。

配合 aoife 使用更佳.

体积：gzip < 1kb.

## Install

yarn:

```sh
$ yarn add aoife-route
```

## API

实力化一个路由对象，当 url 匹配时，会自动渲染

```jsx
import Route from "aoife-route";

const ele = <Route url="/url" render={() => <div>hello</div>} />;
```

Route.push: 推进一个新页面

```jsx
import Route from "aoife-route";

Route.push("/url");
```

Route.push 方法推进一个新页面, 并且传递和读取 url 参数

```jsx
Route.push("/url", { name: "hello" });

// url 参数和 Route.state 保持一致
console.log(Route.state);
```

ROute.replace 方法更新当前页面, replace 不会增加 history 的长度

```jsx
Route.replace("/url");
```

Route.back 方法返回上一个页面

```jsx
Route.back();
```

## 配合原生 JS 使用

```js
import Route from "./aoife-route";

const Foo = () => {
  const ele = document.createElement("div");
  ele.textContent = "foo";
  return ele;
};

const Bar = () => {
  const ele = document.createElement("div");
  ele.textContent = "bar";
  return ele;
};

const buttons = () => {
  const ele = document.createElement("div");
  ["/foo", "/bar"].forEach((v) => {
    const btn = document.createElement("button");
    btn.textContent = "go " + v;
    btn.onclick = () => {
      Route.push(v);
    };
    ele.append(btn);
  });
  return ele;
};

const App = () => {
  const ele = document.createElement("div");
  ele.append(buttons());
  ele.append(Route({ url: "/foo", render: Foo }));
  ele.append(Route({ url: "/bar", render: Bar }));
  return ele;
};

document.body.append(App());
```

## 配合 Aoife 使用

```js
import "aoife";
import Route from "./aoife-route";

const Foo = () => {
  console.log(Route.state);
  return <div>foo</div>;
};

const Bar = () => {
  return <div>bar</div>;
};

const App = () => {
  return (
    <div>
      <Route root url="/foo" render={Foo} />
      <Route url="/bar" render={Bar} />
      <Route url="/cat" render={() => import("./Cat")} />
      <div>
        <button onclick={() => Route.push("/foo", { name: 20 })}>
          foo page
        </button>
        <button onclick={() => Route.push("/bar", { name: "bar" })}>
          bar page
        </button>
        <button onclick={() => Route.replace("/cat", { name: "cat" })}>
          cat page
        </button>
        <button onclick={() => Route.back()}>back page</button>
      </div>
    </div>
  );
};

document.body.append(<App />);
```

## 以上就是全部，保持简单
