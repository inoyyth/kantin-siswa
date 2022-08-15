import {API_URL} from '../Config/apiConfig';

export async function getDetailUser(params: any) {
  try {
    const user_id = params.user_id;
    const response = await fetch(`${API_URL}/user/${user_id}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${params.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      status: await response.status,
      data: await response.json(),
    };
  } catch (_error: any) {
    return [];
  }
}

export async function getBalance(params: any) {
  try {
    const user_id = params.user_id;
    const response = await fetch(`${API_URL}/balance/user/${user_id}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${params.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return {
      status: await response.status,
      data: await response.json(),
    };
  } catch (_error: any) {
    return [];
  }
}
