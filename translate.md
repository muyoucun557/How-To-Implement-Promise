# Promises/A+

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

1. onFulfilled和onRjected可选参数，并且是一个函数，如果不是函数则被忽略
2. 如果onFulfilled是一个函数，它必定会在``promise``变成fulfilled状态被调用，且promise的value是它的第一个参数，并且只会被调用一次。
3. 如果onRjected是一个函数，它必定会在``promise``变成rejected状态被调用，且promise的reason是它的第一个参数，并且只会被调用一次。