import {Image, Skeleton, Text} from '@rneui/themed';
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
import {getMerchantList} from '../Services/merchant';
import storage from '../Services/storage';
import {getBalance, getDetailUser} from '../Services/user';

type Props = {
  navigation: any;
};

type MerchantInterface = {
  id: number;
  merchant_name: string;
  merchant_tagline: string;
  merchant_logo: string;
  merchant_brand_color: string;
  user_detail: {
    user_id: number;
    name: string;
  };
};

const HomeScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  const [storageData, setStorageData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [merchants, setMerchants] = useState<MerchantInterface[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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

  const merchantList: Function = async (params: any): Promise<void> => {
    setRefreshing(true);
    await getMerchantList({
      token: params.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setMerchants(res?.data?.data);
        }
        setRefreshing(false);
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
        setRefreshing(false);
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
        merchantList(parse);
      })
      .catch(_err => {
        // any exception including data not found
        // goes to catch()
        console.log(_err);
        navigation.navigate('Login');
      });
  };

  const RenderMerchantItem: FunctionComponent = (items: any) => {
    const {item} = items;
    return (
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ListMenu', {data: item, storage: storageData});
          }}>
          <Image
            source={require('../../assets/shop-icon.png')}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode="cover"
          />
          <Text style={{textAlign: 'center'}}>{item.merchant_name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderMerchantList: FunctionComponent = () => {
    return (
      <View>
        <FlatList
          data={merchants}
          renderItem={RenderMerchantItem}
          keyExtractor={(item: MerchantInterface, index: number) => `${index}`}
          refreshing={refreshing}
          ListEmptyComponent={() => {
            return (
              <>
                {isEmpty(merchants) && refreshing ? (
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
                    <Text h4>List Menu Kosong</Text>
                  </View>
                )}
              </>
            );
          }}
          numColumns={2}
          contentContainerStyle={{
            padding: 5,
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    getStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <MainHeader name={user?.name} sales={balance?.total} />
      <SafeAreaView>
        <RenderMerchantList />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
