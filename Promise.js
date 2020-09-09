const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

/**
 * 
 * @param {*} executor 
 */
function Promise(executor) {
    if (typeof executor !== 'function') {
        throw TypeError(`expecting a function but got a ${typeof executor}`)
    }
    this.state = STATE.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const self = this;
    function resolve(value) {
        self.value = value;
        self.state = STATE.FULFILLED;
        self.onFulfilledCallbacks.forEach(function(callback) {
            callback();
        });
    }

    function reject(reason) {
        self.reason = reason;
        self.state = STATE.REJECTED;
        self.onRejectedCallbacks.forEach(function(callback) {
            callback();
        });
    }

    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err);
    }
}

// 只有调用了resolve或者reject方法，才能将推动到下一步。

/**
 * 
 * @param {*} didFulfill 
 * @param {*} didReject 
 */
Promise.prototype.then = function(didFulfill, didReject) {
    didFulfill = typeof didFulfill === 'function' ? didFulfill : function(value) { return value;};
    didReject = typeof didReject === 'function' ? didReject : function(reason) { return reason;};
    const self = this;
    if (self.state === STATE.PENDING) {
        return new Promise(function(resolve, reject) {
            self.onFulfilledCallbacks.push(function() {
                const x = didFulfill(self.value);
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            })

            self.onRejectedCallbacks.push(function() {
                try {
                    const x = didReject(self.reason);
                    if (x instanceof Promise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
                    }
                } catch (err) {
                    reject(err);
                }
            })
        });
    }

    if (self.state === STATE.FULFILLED) {
        const p = new Promise(function(resolve, reject) {
            try {
                const x = didFulfill(self.value);
                if (x === p) {
                  throw new TypeError('')
                }
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    if (self.state === STATE.REJECTED) {
        return new Promise(function(resolve, reject) {
            try {
                const x = didReject(self.reason);
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}