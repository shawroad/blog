---
title: TypeScript 高级类型体操：让类型系统为你工作
date: 2026-01-30
tag: TypeScript
emoji: 🔷
cover: cover-5
excerpt: 条件类型、映射类型、模板字符串类型……TypeScript 的类型系统远比你想象的强大。
---

## TypeScript 类型系统的本质

TypeScript 的类型系统是图灵完备的——是的，你可以用纯类型运算做任意计算。这既是强大的保证，也是「类型体操」这个词存在的原因。

## 条件类型：类型级的 if-else

```typescript
// 提取 Promise 的 resolve 类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>;  // string
type B = Awaited<number>;           // number

// 递归 Awaited
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>
  : T;

type C = DeepAwaited<Promise<Promise<string>>>;  // string
```

## 映射类型：批量变换属性

```typescript
// 把所有属性变成可选且只读
type ImmutablePartial<T> = {
  readonly [K in keyof T]?: T[K]
};

// 只保留指定类型的属性
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
};

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

// 只剩 { name: string; email: string }
type StringProps = PickByValue<User, string>;
```

## 模板字符串类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>;  // 'onClick'

// 自动生成 getter 方法类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};
```

## 何时用类型体操，何时不用

> 类型体操的目的是消灭运行时错误，而不是炫技。如果一个复杂类型让你的同事需要花 30 分钟才能看懂，这个类型就没有完成它的使命。
