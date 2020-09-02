# Promises/A+

一个``Promise``代表着一个异步操作的最终结果。promise提供了``then``方法，并且then方法是同promise交互的主要方法。then方法需要注册两个callback函数，一个用于接收最终的结果，一个用于接收promise不能完成(fullfilled)的原因。

这个规范描述了``then``方法的细节，提供了一个同Promise交互的基础。这个规范是很成熟的，尽管是Promise/A+组织可能会修改这个规范。

## 专业术语

1. "promise"是一个带有符合本规范的``then``方法的object或者function。
2. "thenable"表示一个object或者function定义了``then``方法的。
3. "value"表示任何一种JavaScript的value。
4. "exception"表示是使用了``throw``表达式的value。
5. "reason"表示promise被reject的原因。

## 
