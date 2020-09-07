# Promises/A+

下面是对Promise/A+协议的翻译，原文请参看[https://promisesaplus.com/](https://promisesaplus.com/)

一个``Promise``代表着一个异步操作的最终结果。promise提供了``then``方法，并且then方法是同promise交互的主要方法。then方法需要注册两个callback函数，一个用于接收最终的结果，一个用于接收promise不能完成(fullfilled)的原因。

这个规范描述了``then``方法的细节，提供了一个同Promise交互的基础。这个规范是很成熟的，尽管是Promise/A+组织可能会修改这个规范。

## 专业术语

1. "promise"是一个带有符合本规范的``then``方法的object或者function。
2. "thenable"表示一个object或者function定义了``then``方法的。
3. "value"表示任何一种JavaScript的value。
4. "exception"表示是使用了``throw``表达式的value。
5. "reason"表示promise被reject的原因。

## Promise A+的特性

### 1. Promise的状态

一个Promise必须有三种状态，pending、fulfilled、rejected

1. 当处于pending状态时，只能向fulfilled或者rejected状态转变
2. 当处于fulfilled状态时，不能再向其他状态转变，且必须有一个不能改变的value
3. 当处于rejected状态时，不能再向其他状态转变，且必须一个reason

### 2. ``then``方法

一个promise必须提供一个``then``方法，用于获取当前或者最终的value或者reason
``then``方法必须接收两个参数
``promise.then(onFulfilled, onRjected)``

1. ``onFulfilled``和``onRjected``可选参数，并且是一个函数，如果不是函数则被忽略
2. 如果``onFulfilled``是一个函数，它必定会在``promise``变成fulfilled状态被调用，且promise的value是它的第一个参数，并且只会被调用一次。
3. 如果``onRjected``是一个函数，它必定会在``promise``变成rejected状态被调用，且promise的reason是它的第一个参数，并且只会被调用一次。
4. ``onFulfilled``和``onRejected``必须在上下文栈执行结束之后才会被执行。（官方给了解释，不是很懂）。
5. ``onFulfilled``和``onRejected``必须作为一个函数被调用（比如，没有this值）。this值为undefined或者是全局的this值
6. ``then``方法可以被调用多次。
7. ``then``必须返回一个Promise。
    1. ``onFulfilled``或者``onRjected``返回了一个v，执行Promise Resolution Procedure [\[Resolve]](promise2, x)
    2. ``onFulfilled``或者``onRjected``抛出了异常e，prommise2必须rejecte e。
    3. ``onFulfilled``不是一个函数，且promise1是fulfilled状态，那么promise2必须和promise1一样，resolve promise1的值。
    4. ``onRejected``不是一个函数，且promise1是rejected状态，那么promise2必须和promise1一样，rejecte promise1的值。

### Promise Resolution Procedure

``Promise Resolution Procedure``是一个抽象操作，将promise对象和一个value作为输入,可以用``[[Resolve]](promise, x)``表示。如果``x``是thenable，并且x的行为像一个promise，可以试图让promise采用``x``的状态。否则让promise变成fulfilled状态，且``x``作为value。

``[[Resolve]](promise, x)``，执行步骤如下

1. 如果``promise``和``x``是同一个object，reject``promise``，且reason是一个``TypeError``。
2. 如果``x``是一个promise
    1. if``x``是pending状态，promise必须保持pending状态，直到``x``变成fulfilled或者rejected。
    2. if``x``是fulfilled状态，promise必须resolve相同的value（相同的value是指x的value）。
    3. if``x``是rejected状态，promise必须reject相同的reason。
3. 如果``x``是一个object或者function
    1. 让``then``变成``x.then``
    2. 如果``x.then``抛出一个异常，reject promise，且reason是这个异常
    3. 如果``then``是一个function，``x``作为调用它的this值，第一个参数是``resolvePromise``，第二个参数是``rejectPromise``
        1. 如果调用了``resolvePromise``，且参数是y，则执行``[[Resolve]](promise, y)``
        2. 如果调用了``rejectPrromise``，且参数是r，则reject promise，reason是r
        3. 如果``resolvePromise``和``rejectPromise``都被调用了，则先调用的生效，后调用的被忽略
        4. 如果调用``then``方法抛出了异常。在这种情况下，``resolvePromise``或者``rejectPromise``被先调用了，忽略这个异常；如果没有被调用，则reject promise ，reason是这个异常
4. 如果x不是object和function，fulfilled promise，value是x。