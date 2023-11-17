import axios from "axios";

// const header = {
//   headers: {
//     Authorization: window.localStorage.getItem('userToken'),
//   },
// };

// export const axiosDelete = async (url) => {
//     const response = await axios.delete(encodeURI(import.meta.env.VITE_SVELTE_APP_API_URL + url), {
//         headers: {
//             Authorization: window.localStorage.getItem('userToken'),
//         },
//     });
//     if (process.env.REACT_APP_NODE_ENV === 'development') {
//         // console.log('response.data :', response.data);
//     }
//     return response;
// };

const host = 'http://ec2-43-200-130-185.ap-northeast-2.compute.amazonaws.com:8000';
// const host = 'http://localhost:3000';

export const axiosPost = async (url, body) => {
    // const response = await axios.post('http://43.202.101.127:8000' + url, body);
    const response = await axios.post(host + url, body);

    return response;
};

export const axiosDelete = async (url, body) => {
    // const response = await axios.post('http://43.202.101.127:8000' + url, body);
    const response = await axios.delete(host + url, body);

    return response;
};

export const axiosGet = async (url, header = {}) => {
    // console.log(`APIURL = `,API_URL);
    // const response = await axios.get('http://43.202.101.127:8000' + url);
    const response = await axios.get(host + url);

    return response;
};

// const headers = {
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//   },
