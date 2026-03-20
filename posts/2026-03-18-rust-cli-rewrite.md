---
title: 用 Rust 重写我的 CLI 工具：性能提升 10x 的实战记录
date: 2026-03-18
tag: Rust
emoji: 🦀
cover: cover-1
excerpt: 从 Python 迁移到 Rust 的完整心路历程，涵盖所有权系统的理解、异步并发的实践，以及令人吃惊的性能数字。
---

## 为什么要重写？

一切的起点是一个令人沮丧的基准测试结果：我的 Python CLI 工具在处理 10 万行日志时需要 **8.2 秒**，而同事用 Go 写的版本只需要 **0.9 秒**。这个差距让我坐不住了。

> 「工具是思维的延伸。慢工具不只是慢，它会改变你解决问题的方式——让你下意识地避开需要工具参与的场景。」

## 选择 Rust 而不是 Go

我最终选择了 Rust，原因有三：

- 零成本抽象——不为用不到的功能付出运行时代价
- 内存安全——所有权系统在编译期消灭了一大类 bug
- 个人挑战——Rust 的学习曲线出了名的陡，我想看看自己能不能爬上去

## 所有权系统：最难但最值的东西

Rust 的所有权系统是最独特的地方，也是最容易让新手碰壁的地方。核心规则很简单：

```rust
fn main() {
    // s1 拥有这个 String
    let s1 = String::from("hello");
    
    // 所有权转移给 s2，s1 失效
    let s2 = s1;
    
    // 这行会编译错误！
    // println!("{}", s1); // ERROR: use of moved value
    
    // 借用：只读引用，不转移所有权
    let len = calculate_length(&s2);
    println!("'{}' 的长度是 {}", s2, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### 实战中的并发处理

用 `rayon` crate 实现数据并行处理，把原本的串行遍历改成并行迭代器，代码量几乎没变，但速度直接翻了 4 倍：

```rust
use rayon::prelude::*;

fn process_logs(logs: Vec<LogEntry>) -> Vec<ParsedLog> {
    logs.par_iter()           // 并行迭代器，魔法就在这一行
        .filter(|log| log.level == "ERROR")
        .map(|log| parse_entry(log))
        .collect()
}
```

## 最终结果

重写后的 Rust 版本在同样的 10 万行日志测试中：

- ⚡ 执行时间：**0.78 秒**（原 Python 版本：8.2 秒）
- 📦 二进制体积：**2.1 MB**（单文件，无依赖）
- 💾 内存占用：**降低 60%**

## 结语

学 Rust 的过程就像跟一个极度严格的编译器搏斗，它会拒绝你写出的每一段不安全代码，逼你真正理解内存管理。但一旦代码通过编译，它几乎总是能正确运行。这种「先苦后甜」的感觉，很上头。
