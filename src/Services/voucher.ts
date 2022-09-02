import {API_URL} from '../Config/apiConfig';

export async function updateVoucher(params: any) {
  try {
    console.log('pram', params);
    const response = await fetch(`${API_URL}/voucher/${params.voucherCode}`, {
      method: 'put',
      body: JSON.stringify(params),
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
