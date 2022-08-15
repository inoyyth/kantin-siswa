import {API_URL} from '../Config/apiConfig';

export async function getMerchantList(params: any) {
  try {
    const response = await fetch(
      `${API_URL}/merchant/?page=1&per_page=10&sort_field=merchant_name&sort_order=asc`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${params.token}`,
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

export async function getMenuList(params: any) {
  try {
    const merchant_id = params?.merchant_id;
    const response = await fetch(
      `${API_URL}/product/?page=1&per_page=100&sort_field=id&sort_order=desc&filterGroups[0][field]=merchant_id&filterGroups[0][filters][0][value]=${merchant_id}&filterGroups[0][filters][0][condition]=equal`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${params.token}`,
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
