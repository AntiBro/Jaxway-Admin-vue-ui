import axios from 'axios';

let base = '/portal';

export const requestLogin = params => {  return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


export const adminAddUser = params => { return axios.post(`${base}/insertUser`, params).then(res => res.data); };

export const logOutUser =  params => { return axios.post(`${base}/logout`, params).then(res => res.data); };

//查看 predicates 类型
export const getPredicatesInfos =  params => { return axios.get(`${base}/support/getPredicatesInfo`).then(res => res.data); };

//查看 filter 类型
export const getFilterInfos =  params => { return axios.get(`${base}/support/getFilterInfos`).then(res => res.data); };

//插入路由信息
export const addRouteDefinition = params => {  return axios.post(`${base}/insertRouteDefinition`, params).then(res => res.data); };

// 查看目前登录用户的 Jaxway Server 信息
export const getJaxwayServers =  params => { return axios.get(`${base}/support/getOwnJaxwayServers`).then(res => res.data); };

// 查看目前登录用户的 Jaxway Server 信息
export const getJaxwayServersRoutesInfo =  params => { return axios.get(`${base}/support/getOwnJaxwayServersRouteDefinitions`,{ params: params }).then(res => res.data); };

// 删除路由
export const removeRouteDefinition =  params => { return axios.post(`${base}/removeRouteDefinition`,params).then(res => res.data); };



