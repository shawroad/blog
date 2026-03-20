---
title: 构建高性能 React 应用：从 Re-render 地狱逃出来
date: 2026-03-10
tag: React
emoji: ⚛️
cover: cover-2
excerpt: 深入分析 React 渲染机制，用 memo、useMemo、useCallback 和 Profiler 系统性解决性能瓶颈。
---

## 你以为你的 React 很快，其实并不是

我曾经接手过一个「跑起来有点卡」的中台应用。打开 React DevTools Profiler 一看，惊了——每次点击一个按钮，整棵组件树都在重新渲染。一个简单的状态更新，触发了 **200+** 次不必要的 render。

## 问题根源：状态放错了地方

最常见的性能陷阱不是某个 API 调用慢，而是**状态提升过度**。把所有 state 都放在顶层，任何一个状态变化，都会从顶层开始触发整棵树的 reconciliation。

### 解决方案一：状态下移

```jsx
// ❌ 问题写法：搜索状态放在父组件
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    <>
      <HeavyChart />           {/* 每次输入都会重渲染！ */}
      <SearchInput value={query} onChange={setQuery} />
      <SearchResults query={query} />
    </>
  );
}

// ✅ 好的写法：把搜索状态封装起来
function Dashboard() {
  return (
    <>
      <HeavyChart />           {/* 完全不受搜索影响 */}
      <SearchSection />        {/* 内部管理自己的状态 */}
    </>
  );
}
```

### 解决方案二：正确使用 memo

```jsx
const HeavyChart = React.memo(({ data, config }) => {
  return <canvas />;
});

function Parent({ rawData }) {
  // useMemo 确保 config 对象引用稳定
  const config = useMemo(() => ({
    color: '#00f5ff',
    animation: true,
  }), []);
  
  const processedData = useMemo(
    () => expensiveProcess(rawData),
    [rawData]
  );
  
  return <HeavyChart data={processedData} config={config} />;
}
```

## 用 Profiler 量化优化结果

优化要有数据支撑，不能靠感觉。React DevTools 的 Profiler 面板可以精确记录每次提交的渲染时间和组件树。

> 我们这个案例的最终结果：页面核心交互的渲染时间从 **340ms** 降到了 **28ms**，用户能明显感受到「丝滑」了。

## 一个实用检查清单

- 大型列表用 `react-window` 虚拟化
- 频繁变化的 state 做状态下移或隔离
- 传给子组件的回调函数用 `useCallback` 包裹
- 昂贵计算用 `useMemo`，但不要滥用——简单计算加 memo 反而更慢
- 用 `React.lazy` + `Suspense` 做路由级代码分割
