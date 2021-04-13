/**
 * @desc 实现promise.allSettled方法
 * @author tankm
 * @since 2021-04-14 01:04:06
 */

interface PromiseFulfilledResult<T> {
	status: 'fulfilled';
	value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

const promiseAllSettled = async function (
  tasks: (Promise<any> | any)[],
  options?: { dealError: boolean }
) {
  const { dealError = true } = options || {};
  let settledNum = 0;
	const results: PromiseSettledResult<any>[] = [];
  tasks.forEach((task: Promise<any>, index: number) => {
    // 若为task为Promise实例
    if (task instanceof Promise) {
      task
        .then((res) => (results[index] = { status: 'fulfilled', value: res }))
        .catch((err) => (results[index] = { status: 'rejected', reason: err.message }))
        .finally(() => {
          settledNum += 1;
          if (settledNum === results.length) {
            dealError && dealResultError(results);
            return Promise.resolve(results);
          }
        });
    } else {
      // 若task非Promise实例，直接塞进结果数组
      results[index] = { status: 'fulfilled', value: task };
      settledNum += 1;
      if (settledNum === results.length) {
        dealError && dealResultError(results);
        return Promise.resolve(results);
      }
    }
  });
};

/**
 * 处理返回集中的报错项
 */
const dealResultError = function (results: PromiseSettledResult<any>[] = []) {
  return results.map(res => {
    if (res.status === 'rejected') {
      // 打印错误
      console.log(res.reason);
			return null;
    }
		return res.value;
  });
};
