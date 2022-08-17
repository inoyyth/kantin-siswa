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

export async function updatePassword(params: any) {
  console.log('params', params);
  try {
    const response = await fetch(
      `${API_URL}/user/change-password/${params.user_id}`,
      {
        method: 'put',
        body: JSON.stringify(params),
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      status: await response.status,
      data: await response.json(),
    };
  } catch (_error: any) {
    return [];
  }
}

export async function logout(params: any) {
  try {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
