type PromiseDelegate<T = void> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
};
export function promiseDelegate<T = void>(): PromiseDelegate<T> {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  } as unknown as PromiseDelegate<T>;
}
