import xFetch from '../services/xFetch'
import config from '../services/config'

//获取banner
export const getBanner = async () => {
	let res = await xFetch(`/banner`);
	return res;
}

//mv排行
export const getTopMv = async (offset = 0, limit = 10) => {
	let res = await xFetch(`/top/mv?offset=${offset}&limit=${limit}`);
	return res;
}

//获取mv详情
export const getMvDetail = async (mvid) => {
	let res = await xFetch(`/mv?mvid=${mvid}`);
	return res;
}

//播放mv
export const mvPlayer = async (mvUrl) => {
	let res = await xFetch(`/mv/url?url=${mvUrl}`);
	return res;
}

//相似mv
export const getSimiMv = async (mvid) => {
	let res = await xFetch(`/simi/mv?mvid=${mvid}`);
	return res;
}

//mv评论
export const getMvComment = async (id, offset = 0, limit = 20) => {
	let res = await xFetch(`/comment/mv?id=${id}&offset=${offset}&limit=${limit}`);
	return res;
}