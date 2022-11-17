import {API_URL} from '../Config/apiConfig';

export async function checkAuth(params: any) {
  try {
    let formData = new FormData();
    formData.append('email', params?.email);
    formData.append('password', params?.password);
    formData.append('grand_access_type', params?.grand_access_type);
    console.log(API_URL);
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'post',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('response', response);
    return {
      status: await response.status,
      data: await response.json(),
    };
  } catch (_error: any) {
    return [];
  }
}
