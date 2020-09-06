const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

/**
 * 
 * @param {*} resolve 
 * @param {*} reject 
 */
function Promise(executor) {
    this.state = STATE.PENDING;
    this.value;
    this.reason;
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const self = this;
    function resolve(value) {
        self.value = value;
        self.state = STATE.FULFILLED;
        self.onFulfilledCallbacks.forEach(callback => callback(self.value));
    }

    function reject(reason) {
        self.reason = reason;
        self.state = STATE.REJECTED;
        self.onRejectedCallbacks.forEach(callback => callback(self.reason));
    }

    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err)
    }
    
}

/**
 * 
 * @param {*} resolve 
 * @param {*} reject 
 */
Promise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value) { return value; }
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { return reason; }
    
    
    if (self.state === STATE.FULFILLED) {
        return new Promise(function(resolve, reject) {
            try {
                const x = onFulfilled(self.value);
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    resolve(x);
                }
            } catch(err) {
                reject(err)
            }
        });
    }
    
    if (self.state === STATE.REJECTED) {
        
        return new Promise(function(resolve, reject) {
            try {
                const x = onRejected(self.reason);
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x)
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    if (self.state === STATE.PENDING) {
        return new Promise(function(resolve, reject) {
            self.onFulfilledCallbacks.push(function() {
                const x = onFulfilled(self.value);
                if (x instanceof Promise) {
                    x.then()
                } else {
                    resolve(x);
                }
            });
            self.onRejectedCallbacks.push(function() {
                const x = onRejected(self.reason);
                if (x instanceof Promise) {
                    x.then()
                } else {
                    resolve(x);
                }
            });
        });
    }
}

Promise.prototype.catch = function(fn) {
    return this.then(null, fn)
}