import {Button, Dialog, Icon, Skeleton, Text} from '@rneui/themed';
import {isEmpty} from 'lodash';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainHeader from '../Components/MainHeader';
import {
  getOrderAllOrder,
  updateStatus,
  updateStatusByScan,
} from '../Services/order';
import storage from '../Services/storage';
import {getBalance, getDetailUser} from '../Services/user';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import moment from 'moment';
import 'moment/locale/id';

type Props = {
  navigation: any;
};

const OrderScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  const scanner = useRef(null);
  const [storageData, setStorageData] = useState<any>(null);
  const [listOrder, setListOrder] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [showModalBarcode, setShowModalBarcode] = useState<boolean>(false);
  const [barcodeValue, setBarcodeValue] = useState<number>(0);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showDialogCancel, setShowDialogCancel] = useState<boolean>(false);
  const [transactionCode, setTransactionCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [detailOrder, setDetailOrder] = useState<any>(null);

  const onSuccess = async (e: any) => {
    setShowModalBarcode(false);
    console.log('orderId', barcodeValue);
    console.log(e);
    if (!isEmpty(e.data)) {
      const merchantId = e?.data;
      await updateStatusByScan({
        merchant_id: merchantId,
        orderId: barcodeValue,
        status: 'SUCCESS',
        token: storageData.token,
      })
        .then(async (res: any) => {
          console.log('res', res);
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
            return false;
          } else if (res.status === 404) {
            Alert.alert('Error', 'Data tidak valid!');
            return false;
          } else if (res.status === 422) {
            Alert.alert('Error', 'Voucher sudah digunakan!');
            return false;
          } else {
            setScanSuccess(true);
            getStorage();
          }
        })
        .catch((_err: any) => {
          Alert.alert('Error', 'Something went wrong!');
        });
    }
  };

  const handleCancelOrder: Function = async () => {
    setButtonLoading(true);
    await updateStatus({
      orderId: orderId,
      token: storageData.token,
      status: 'CANCEL',
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setButtonLoading(false);
          setShowDialogCancel(false);
          getStorage();
        }
      })
      .catch((_err: any) => {
        setButtonLoading(false);
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  const getListOrder: Function = async (params: any): Promise<void> => {
    setRefreshing(true);
    await getOrderAllOrder({
      user_id: params?.user_id,
      token: params.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setListOrder(res?.data?.data);
        }
        setRefreshing(false);
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
        setRefreshing(false);
      });
  };

  const userBalance: Function = async (params: any): Promise<void> => {
    await getBalance({
      user_id: params.user_id,
      token: params.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setBalance(res?.data?.data);
        }
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  const detailUser: Function = async (params: any): Promise<void> => {
    await getDetailUser({
      user_id: params.user_id,
      token: params.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setUser(res?.data?.data);
        }
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  const getStorage: Function = () => {
    storage
      .load({
        key: 'auth',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {
            // blahblah
          },
          someFlag: true,
        },
      })
      .then(ret => {
        const parse = JSON.parse(ret);
        setStorageData(parse);
        getListOrder(parse);
        userBalance(parse);
        detailUser(parse);
        setRefreshing(false);
      })
      .catch(_err => {
        // any exception including data not found
        // goes to catch()
        console.log(_err);
        navigation.navigate('Login');
      });
  };

  const showBarcode: Function = (orderValue: any) => {
    setBarcodeValue(orderValue?.id);
    setOrderNumber(orderValue?.transaction_code);
    setShowModalBarcode(true);
    setDetailOrder(orderValue);
  };

  const RenderOrderItem: FunctionComponent = (orderItem: any) => {
    const {item} = orderItem;
    let textColor = 'white';
    if (item.status === 'CANCEL') {
      textColor = 'red';
    }
    if (item.status === 'SUCCESS') {
      textColor = '#00ff00';
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.status === 'READY') {
            showBarcode(item);
          }
        }}
        onLongPress={() => {
          if (item.status === 'READY') {
            setTransactionCode(item?.transaction_code);
            setOrderId(item?.id);
            setShowDialogCancel(true);
          }
        }}>
        <View
          style={{
            borderWidth: 1,
            marginVertical: 10,
            marginHorizontal: 5,
            padding: 5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderBottomWidth: 1,
              backgroundColor: '#00a1e9',
            }}>
            <Text style={{color: '#ffffff', fontWeight: '700'}}>
              {item.transaction_code}
            </Text>
            <Text style={{color: textColor, fontWeight: '700'}}>
              {item?.status}
            </Text>
          </View>
          <View
            style={{
              marginTop: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontWeight: '700', fontSize: 12, textAlign: 'left'}}>
              {item?.created_at}
            </Text>
            <Text style={{fontWeight: '700', fontSize: 12, textAlign: 'right'}}>
              {item?.merchant?.merchant_name}
            </Text>
          </View>
          <View style={{marginTop: 1}}>
            <Text style={{fontWeight: '700'}}>Menu:</Text>
          </View>
          {item?.order_detail.map((val: any, index: number) => {
            return (
              <View
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <View style={{width: '50%'}}>
                  <Text>{val?.product?.title}</Text>
                </View>
                <View style={{width: '10%'}}>
                  <Text>{val?.quantity}</Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={{textAlign: 'right'}}>
                    @{val?.product?.price}
                  </Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={{textAlign: 'right'}}>{val?.nominal}</Text>
                </View>
              </View>
            );
          })}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderTopWidth: 1,
            }}>
            <View style={{width: '50%'}}>
              <Text style={{textAlign: 'center', fontWeight: '700'}}>
                Total:{' '}
              </Text>
            </View>
            <View style={{width: '10%'}}>
              <Text style={{fontWeight: '700'}}>{item?.total_item}</Text>
            </View>
            <View style={{width: '20%'}} />
            <View style={{width: '20%'}}>
              <Text style={{textAlign: 'right', fontWeight: '700'}}>
                {item?.total}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderOrderList: FunctionComponent = () => {
    return (
      <View style={{marginBottom: 130}}>
        <FlatList
          data={listOrder}
          renderItem={RenderOrderItem}
          keyExtractor={(_item: any, index: number) => `${index}`}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            getStorage();
          }}
          ListEmptyComponent={() => {
            return (
              <>
                {isEmpty(listOrder) && refreshing ? (
                  <View style={{paddingHorizontal: 15}}>
                    <Skeleton
                      animation="wave"
                      height={100}
                      style={{
                        marginTop: 15,
                      }}
                    />
                    <Skeleton
                      animation="wave"
                      height={100}
                      style={{
                        marginTop: 15,
                      }}
                    />
                    <Skeleton
                      animation="wave"
                      height={100}
                      style={{
                        marginTop: 15,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text h4>List Order Kosong</Text>
                  </View>
                )}
              </>
            );
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    getStorage();
    console.log('CRIIT');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <MainHeader name={user?.name} sales={balance?.total} />
      <SafeAreaView>
        <RenderOrderList />
      </SafeAreaView>
      <Dialog
        isVisible={showModalBarcode}
        onBackdropPress={() => {
          setShowModalBarcode(false);
          getStorage();
        }}>
        <Dialog.Title
          titleStyle={{textAlign: 'center'}}
          title="Konfirmasi Orderan"
        />
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40%',
            width: '100%',
            top: 50,
          }}>
          <QRCodeScanner
            ref={scanner}
            reactivate
            showMarker
            onRead={(e: any) => onSuccess(e)}
            flashMode={RNCamera.Constants.FlashMode.auto}
            containerStyle={{position: 'relative', height: 100}}
            cameraStyle={{width: 200, left: 96, top: -100}}
          />
          <View>
            <Text style={styles.centerText}>
              Merchant: {detailOrder?.merchant?.merchant_name}
            </Text>
            <Text style={styles.centerText}>Order Id: {orderNumber}</Text>
          </View>
        </View>
      </Dialog>
      <Dialog
        isVisible={showDialogCancel}
        onBackdropPress={() => {
          setShowDialogCancel(false);
        }}>
        <Dialog.Title
          titleStyle={{textAlign: 'center'}}
          title={`Batalkan Order ${transactionCode}`}
        />
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{margin: 5}}>
              <Button
                color="primary"
                loading={buttonLoading}
                disabled={buttonLoading}
                onPress={() => {
                  setShowDialogCancel(false);
                }}>
                Tidak
              </Button>
            </View>
            <View style={{margin: 5}}>
              <Button
                color="error"
                loading={buttonLoading}
                disabled={buttonLoading}
                onPress={() => {
                  handleCancelOrder();
                }}>
                Ya
              </Button>
            </View>
          </View>
        </View>
      </Dialog>
      <Dialog
        isVisible={scanSuccess}
        onBackdropPress={() => setScanSuccess(false)}>
        <Dialog.Title title="Proses Bayar Sukses" />
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 5,
            flexGrow: 1,
          }}>
          <Icon name="checkcircle" type="antdesign" />
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {detailOrder?.merchant?.merchant_name}
          </Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text style={{fontWeight: 'bold'}}>Order Detail</Text>
        </View>
        {detailOrder &&
          detailOrder?.order_detail.map((val: any, i: number) => {
            return (
              <View
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <View style={{width: '50%'}}>
                  <Text>{val?.product?.title}</Text>
                </View>
                <View style={{width: '10%'}}>
                  <Text>{val?.quantity}</Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={{textAlign: 'right'}}>
                    @{val?.product?.price}
                  </Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text style={{textAlign: 'right'}}>{val?.nominal}</Text>
                </View>
              </View>
            );
          })}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderTopWidth: 1,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'center', fontWeight: '700'}}>
              Total:{' '}
            </Text>
          </View>
          <View style={{width: '10%'}}>
            <Text style={{fontWeight: '700'}}>{detailOrder?.total_item}</Text>
          </View>
          <View style={{width: '20%'}} />
          <View style={{width: '20%'}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {detailOrder?.total}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 12}}>
            waktu bayar: {moment().format('dddd, D MMMM YYYY HH:mm:ss')}
          </Text>
        </View>
      </Dialog>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default OrderScreen;
