const FULFILLED = 'fulfilled';
const PENDING = 'pending';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        this.state = PENDING;
        this.result = undefined;
        this.onFulfilledFn = [];
        this.onRejectedFn = [];

        const resolve = (value) => {
            if (this.state === PENDING) {
                this.state = FULFILLED;
                this.result = value;
                this.onFulfilledFn.forEach((fn) => fn());
            }
        };

        const reject = (error) => {
            if (this.state === PENDING) {
                this.state = REJECTED;
                this.result = error;
                this.onRejectedFn.forEach((fn) => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            if (this.state === PENDING) {
                if (onFulfilled) {
                    this.onFulfilledFn.push(() => {
                        try {
                            let newResult = onFulfilled(this.result);
                            resolve(newResult);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }

                if (onRejected) {
                    this.onRejectedFn.push(() => {
                        try {
                            let newResult = onRejected(this.result);
                            reject(newResult);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
            }

            if (onFulfilled && this.state === FULFILLED) {
                try {
                    let newResult = onFulfilled(this.result);
                    resolve(newResult);
                } catch (error) {
                    reject(error);
                }
                return;
            }

            if (onRejected && this.state === REJECTED) {
                try {
                    let newResult = onRejected(this.result);
                    reject(newResult);
                } catch (error) {
                    reject(error);
                }
                return;
            }
        });
    }

    catch(onRejected) {
        then(null, onRejected);
    }
}

const promise = new MyPromise((resolve, reject) => {
    resolve('success');
})
    .then((res) => {
        return res + ' 123';
    })
    .then((res) => {
        return res + '456';
    });

console.log(promise);
