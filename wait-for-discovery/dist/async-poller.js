"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncPoll = asyncPoll;
/**
 * How to repeatedly call an async function until get a desired result.
 *
 * Inspired by the following gist:
 * https://gist.github.com/twmbx/2321921670c7e95f6fad164fbdf3170e#gistcomment-3053587
 * https://davidwalsh.name/javascript-polling
 *
 * Usage:
    asyncPoll(
        async (): Promise<AsyncData<any>> => {
            try {
                const result = await getYourAsyncResult();
                if (result.isWhatYouWant) {
                    return Promise.resolve({
                        done: true,
                        data: result,
                    });
                } else {
                    return Promise.resolve({
                        done: false
                    });
                }
            } catch (err) {
                return Promise.reject(err);
            }
        },
        500,    // interval
        15000,  // timeout
    );
 */
async function asyncPoll(
/**
 * Function to call periodically until it resolves or rejects.
 *
 * It should resolve as soon as possible indicating if it found
 * what it was looking for or not. If not then it will be reinvoked
 * after the `pollInterval` if we haven't timed out.
 *
 * Rejections will stop the polling and be propagated.
 */
fn, 
/**
 * Milliseconds to wait before attempting to resolve the promise again.
 * The promise won't be called concurrently. This is the wait period
 * after the promise has resolved/rejected before trying again for a
 * successful resolve so long as we haven't timed out.
 *
 * Default 5 seconds.
 */
pollInterval = 5 * 1000, 
/**
 * Max time to keep polling to receive a successful resolved response.
 * If the promise never resolves before the timeout then this method
 * rejects with a timeout error.
 *
 * Default 30 seconds.
 */
pollTimeout = 30 * 1000) {
    const endTime = Date.now() + pollTimeout;
    const checkCondition = (resolve, reject) => {
        Promise.resolve(fn())
            .then(result => {
            const now = Date.now();
            if (result.done && result.data) {
                resolve(result.data);
            }
            else if (now < endTime) {
                setTimeout(checkCondition, pollInterval, resolve, reject);
            }
            else {
                reject(new Error('The pooling timed out.'));
            }
        })
            .catch(err => {
            reject(err);
        });
    };
    return new Promise(checkCondition);
}
