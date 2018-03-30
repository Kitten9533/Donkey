import config from '../services/config';
const TIME_OUT = 15000;

const formatResponse = res => {
	res = res;
	return {
		code: res.code || 200,
		res: res
	}
}

async function xFetch(path, options = {
	method: 'GET'
}) {
	console.log(getPath(path));
	const normalFetch = fetch(getPath(path), options)
		.then((response) => {
			return response.json()
		})
		.catch((err) => {
			throw new Error(`Error in xFetch ${err}`);
			return {
				code: null
			};
		});
	const res = await timeoutPromise(TIME_OUT, normalFetch.then(formatResponse));
	if (res.code === 200) {
		return res.res;
	} else {
		console.log(res.res.msg);
		throw new Error(`${res.code}  ${res.res.msg}`);
	}
}

export const getPath = function(path) {
	if (/^http.*/.test(path)) {
		return path;
	} else {
		return config.url + path;
	}
}

export const timeoutPromise = function(ms, promise) {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error('request time out'))
		}, ms);
		promise.then(
			(res) => {
				clearTimeout(timeoutId);
				resolve(res);
			},
			(err) => {
				clearTimeout(timeoutId);
				reject(err);
			}
		);
	})
}

export default xFetch;