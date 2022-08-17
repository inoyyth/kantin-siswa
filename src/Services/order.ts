import moment from 'moment';
import {API_URL} from '../Config/apiConfig';

export async function getOrderRecap(params: any) {
  try {
    const response = await fetch(`${API_URL}/order/order-recap/`, {
      method: 'post',
      body: JSON.stringify(params.order),
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);
    return {
      status: await response.status,
      data: await response.json(),
    };
  } catch (_error: any) {
    console.log('error', _error);
    return [];
  }
}

export async function createOrder(params: any) {
  console.log(params);
  try {
    const response = await fetch(`${API_URL}/order/`, {
      method: 'post',
      body: JSON.stringify(params),
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
    console.log('error', _error);
    return [];
  }
}

export async function getOrderAllOrder(params: any) {
  try {
    const {user_id, token} = params;
    const date = moment().format('YYYY-MM-DD');
    const response = await fetch(
      `${API_URL}/order/?page=1&per_page=10&sort_field=id&sort_order=asc&filterGroups[0][field]=user_id&filterGroups[0][filters][0][value]=${user_id}&filterGroups[0][filters][0][condition]=equal&filterGroups[1][field]=created_at&filterGroups[1][filters][0][value]=${date}&filterGroups[1][filters][0][condition]=equaldate`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
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

export async function getOrderHistory(params: any) {
  try {
    const {user_id, token, date} = params;
    const response = await fetch(
      `${API_URL}/order/?page=1&per_page=100&sort_field=id&sort_order=asc&filterGroups[0][filters][0][condition]=equal&filterGroups[0][field]=user_id&filterGroups[0][filters][0][value]=${user_id}&filterGroups[1][filters][0][condition]=equal&filterGroups[1][filters][0][condition]=equaldate&filterGroups[1][field]=created_at&filterGroups[1][filters][0][value]=${date}`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
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

export async function getTopUpHistory(params: any) {
  try {
    const {user_id, token, date} = params;
    const response = await fetch(
      `${API_URL}/topup/?page=1&per_page=100&sort_field=id&sort_order=desc&filterGroups[0][field]=user_id&filterGroups[0][filters][0][value]=${user_id}&filterGroups[0][filters][0][condition]=equal&filterGroups[1][field]=created_at&filterGroups[1][filters][0][value]=${date}&filterGroups[1][filters][0][condition]=equaldate`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
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
