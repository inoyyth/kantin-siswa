import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Skeleton, Text} from '@rneui/themed';
import {isEmpty} from 'lodash';
import {Alert, FlatList, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainHeader from '../Components/MainHeader';
import storage from '../Services/storage';
import {getBalance, getDetailUser} from '../Services/user';
import moment from 'moment';
import {getOrderHistory, getTopUpHistory} from '../Services/order';

type Props = {
  navigation: any;
};

const HistoryScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [storageData, setStorageData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [listOrder, setListOrder] = useState<any[]>([]);
  const [listTopUp, setListTopUp] = useState<any[]>([]);

  const handleTopUpList: Function = useCallback(
    async (params: any): Promise<void> => {
      await getTopUpHistory({
        user_id: params.user_id,
        token: params.token,
        date: moment(date).format('YYYY-MM-DD'),
      })
        .then(async (res: any) => {
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
            return false;
          } else {
            setListTopUp(res?.data?.data);
          }
        })
        .catch((_err: any) => {
          Alert.alert('Error', 'Something went wrong!');
        });
    },
    [date],
  );

  const handleOrderList: Function = useCallback(
    async (params: any): Promise<void> => {
      await getOrderHistory({
        user_id: params.user_id,
        token: params.token,
        date: moment(date).format('YYYY-MM-DD'),
      })
        .then(async (res: any) => {
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
            return false;
          } else {
            setListOrder(res?.data?.data);
          }
        })
        .catch((_err: any) => {
          Alert.alert('Error', 'Something went wrong!');
        });
    },
    [date],
  );

  const detailUser: Function = async (params: any): Promise<void> => {
    console.log('croot');
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
        detailUser(parse);
        userBalance(parse);
        handleOrderList(parse);
        handleTopUpList(parse);
      })
      .catch(_err => {
        // any exception including data not found
        // goes to catch()
        console.log(_err);
        navigation.navigate('Login');
      });
  };

  useEffect(() => {
    getStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const RenderTopUpItem: FunctionComponent = (orderItem: any) => {
    const {item} = orderItem;
    return (
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
          <Text style={{color: '#ffffff', fontWeight: '700'}}>TOPUP</Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text style={{fontWeight: '700'}}>Total: {item?.nominal}</Text>
        </View>
      </View>
    );
  };

  const RenderOrderItem: FunctionComponent = (orderItem: any) => {
    const {item} = orderItem;
    const textColor = item.status === 'CANCEL' ? 'red' : 'white';
    return (
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
        <View style={{marginTop: 1}}>
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
                <Text style={{textAlign: 'right'}}>@{val?.product?.price}</Text>
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
    );
  };

  return (
    <SafeAreaProvider>
      <MainHeader name={user?.name} sales={balance?.total} />
      <View style={{padding: 10}}>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Text style={{fontWeight: '700'}}>Pilih Tanggal: </Text>
            <View style={{backgroundColor: '#00a1e9'}}>
              <Text style={{color: '#ffffff', fontWeight: '700'}}>
                {moment(date).format('dddd, D MMMM YYYY')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <FlatList
            data={listOrder}
            renderItem={RenderOrderItem}
            keyExtractor={(_item: any, index: number) => `${index}`}
            extraData={listOrder}
            ListEmptyComponent={() => {
              return (
                <>
                  {isEmpty(listOrder) ? (
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
          <FlatList
            data={listTopUp}
            renderItem={RenderTopUpItem}
            keyExtractor={(_item: any, index: number) => `${index}`}
            extraData={listTopUp}
          />
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={(e: any) => {
            setOpen(false);
            setDate(e);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default HistoryScreen;
