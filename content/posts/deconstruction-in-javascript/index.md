---
title: "JavaScript 中的解构赋值"
slug: "deconstruction-in-javascript"
date: 2024-07-22T13:26:51+08:00
cover: cover.svg
thumbnail: cover.svg
draft: true
categories: "javascript"
tags: ["javascript"]
gemini: true
showSummary: true
summary: 不知道摸了多久的鱼，是时候杀几条鱼了
---

{{<alert>}}这是一篇隐藏内容，因为我不想发布它{{</alert>}}

## 解构赋值？

解构赋值啊，什么是解构赋值呢？

简言之，**JavaScript 中的解构**（ES6 提出）是一种可以将数组中的值取出、赋给其它变量的表达式

## 用法

举个栗子，假如我现在有一个变量 `name`，它的变量值为 `{ before: "Hajeekn", now: "FloatSheep" }`

这时候，我们通过解构这个对象，可以将 `before` 和 `now` 赋值给其它变量

```javascript
const name = { before: "Hajeekn", now: "FloatSheep" };
const { before: b, now: n } = name;

console.log(b, n); // 输出：Hajeekn FloatSheep

```

或者，可以这样写

```javascript
const name = { before: "Hajeekn", now: "FloatSheep" };
const { before, now } = name;

console.log(before, now); // 输出：Hajeekn FloatSheep

```

当然，除了解构对象，还可以解构数组

```javascript
const [name1, name2] = ["Hajeekn", "FloatSheep"];

console.log(name1, name2); // 输出：Hajeekn FloatSheep

```

拿解构对象的栗子，其实代码中的 `b` 和 `n` 就可以等于 `name.before` 和 `name.now`

## 对比传统赋值

如果不使用解构，那么就应该这样写

```javascript
const name = { before: "Hajeekn", now: "FloatSheep" };

console.log(name.before, name.now); // 输出：Hajeekn FloatSheep
```

所以，通过解构赋值，代码变得更加易读和简洁{{<heimu>}}哪里易读了{{<emoji data="pouting_face_color">}}{{</emoji>}}{{</heimu>}}
