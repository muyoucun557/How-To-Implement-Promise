# 怎样去实现一个Promise

JS中或者NodeJs中，异步流程控制使用的是``回调函数``。如果串行多个异步操作时，会出现``回调地狱``这种情况。为了解决这一问题，出现了Promise，Promise可以更优雅的处理异步流程控制。V8和bluebirdjs实现的是Promise/A+规范。

[Promise/A+官网](https://promisesaplus.com)
[Promise/A+协议翻译](./Promise-A+.md)
