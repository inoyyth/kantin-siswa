import {Dialog, Skeleton, Text} from '@rneui/themed';
import {isEmpty} from 'lodash';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainHeader from '../Components/MainHeader';
import {getOrderAllOrder} from '../Services/order';
import storage from '../Services/storage';
import {getBalance, getDetailUser} from '../Services/user';
import QRCode from 'react-native-qrcode-svg';

type Props = {
  navigation: any;
};

const OrderScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  const [listOrder, setListOrder] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [showModalBarcode, setShowModalBarcode] = useState<boolean>(false);
  const [barcodeValue, setBarcodeValue] = useState<number>(0);
  const [orderNumber, setOrderNumber] = useState<string>('');

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
  };

  const RenderOrderItem: FunctionComponent = (orderItem: any) => {
    const {item} = orderItem;
    return (
      <TouchableOpacity
        onLongPress={() => {
          if (item.status === 'READY') {
            showBarcode(item);
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
            <Text style={{color: '#ffffff', fontWeight: '700'}}>
              {item?.status}
            </Text>
          </View>
          <View style={{marginTop: 5}}>
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
          }}>
          <QRCode value={`${barcodeValue}`} logoSize={30} />
          <Text style={{marginTop: 5}}>{orderNumber}</Text>
        </View>
      </Dialog>
    </SafeAreaProvider>
  );
};

export default OrderScreen;
