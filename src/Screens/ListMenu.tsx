import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {getMenuList} from '../Services/merchant';
import {isEmpty, isUndefined, map} from 'lodash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Button,
  Dialog,
  Header as HeaderRNE,
  Icon,
  Image,
  Skeleton,
  Text,
} from '@rneui/themed';
import {createOrder, getOrderRecap} from '../Services/order';

type Props = {
  navigation: any;
  route: any;
};

type MenusInterface = {
  id: number;
  title: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
};

type Order = {
  id: number;
  qty: number;
};

const ListMenu: FunctionComponent<Props> = (props: Props) => {
  const {
    navigation,
    route: {params},
  } = props;
  const {data, storage} = params;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [listMenu, setListMenu] = useState<MenusInterface[]>([]);
  const [order, setOrder] = useState<any>([]);
  const [recap, setRecap] = useState<any>([]);
  const [showRecapModal, setShowRecapModal] = useState<boolean>(false);
  const [showRecapLoading, setShowRecapLoading] = useState<boolean>(false);

  const createNewOrder: Function = async () => {
    const paramsOrder = {
      merchant_id: data?.id,
      user_id: storage.user_id,
      total_item: recap?.total_item,
      total: recap?.total,
      product: map(recap?.products, 'id'),
      quantity: map(recap?.products, 'quantity'),
      nominal: map(recap?.products, 'price'),
      note: map(recap?.products, function (_e: any) {
        return '-';
      }),
      token: storage.token,
    };
    await createOrder(paramsOrder)
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          console.log('success');
          navigation.navigate('TabOrder');
        }
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  const getRecapOrder: Function = async () => {
    setShowRecapModal(true);
    setShowRecapLoading(true);
    await getOrderRecap({
      order: order,
      token: storage.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setRecap(res?.data?.data);
          setShowRecapLoading(false);
        }
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  const increaseOrder: Function = (array: Order[], element: Order): void => {
    const i = array.find((_element: Order) => _element.id === element.id);
    if (isUndefined(i)) {
      setOrder([...order, element]);
      return;
    } else {
      var newArr = map(array, function (a) {
        const qty = a.qty + 1;
        return a.id === element.id ? {id: a.id, qty: qty} : a;
      });
      setOrder(newArr);
    }
  };

  const decreaseOrder: Function = (array: Order[], element: Order): void => {
    const i = array.findIndex((_element: Order) => _element.id === element.id);
    if (i === -1) {
      return;
    }
    if (isUndefined(i)) {
      setOrder(array);
      return;
    } else {
      const currentArray = array[i];
      if (currentArray.qty > 0) {
        array.splice(i, 1, {id: currentArray.id, qty: currentArray.qty - 1});
        const newArray = array.filter(function (v: Order) {
          return v.qty > 0;
        });
        setOrder([...newArray]);
        return;
      }
    }
  };

  const getListMenu: Function = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await getMenuList({
      merchant_id: data.id,
      token: storage.token,
    })
      .then(async (res: any) => {
        if (isEmpty(res)) {
          Alert.alert('Error', 'Something went wrong!');
          return false;
        } else {
          setListMenu(res?.data?.data);
        }
        setRefreshing(false);
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
        setRefreshing(false);
      });
  }, [data.id, storage.token]);

  const RenderMenuItem: FunctionComponent = (items: any) => {
    const {item} = items;
    let ic = [];
    if (!isEmpty(order)) {
      ic = order.filter(function (v: Order) {
        return v.id === item.id;
      });
    }
    const currentQty = isEmpty(ic) ? 0 : ic[0].qty;
    return (
      <>
        <View style={menuStyles.container}>
          <View style={menuStyles.row}>
            <Image
              style={{width: 100, height: 100, flexGrow: 1}}
              source={{uri: item.image}}
              resizeMode="cover"
            />
            <View style={{paddingHorizontal: 5, flexGrow: 2}}>
              <Text style={{fontSize: 17, fontWeight: '700', color: '#59b300'}}>
                {item.title}
              </Text>
              <Text style={{fontSize: 17, fontWeight: '700', marginTop: 5}}>
                Rp. {item?.price}/{item?.unit}
              </Text>
              {item?.category === 'food' && (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: 5,
                  }}>
                  <Icon name="rice" type="material-community" size={15} />
                </View>
              )}
              {item?.category === 'drink' && (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: 5,
                  }}>
                  <Icon name="drink" type="entypo" size={15} />
                </View>
              )}
              <View
                style={{
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  width: '87%',
                }}>
                <Text style={{textAlign: 'justify'}}>{item?.description}</Text>
              </View>
            </View>
            <View style={{flexGrow: 1}}>
              <View
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderRadius: 4,
                  backgroundColor: '#00a1e9',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    increaseOrder(order, {id: item.id, qty: 1});
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderRadius: 4,
                  backgroundColor: '#00a1e9',
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (currentQty > 0) {
                      decreaseOrder(order, {id: item.id, qty: 1});
                    }
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 5, borderWidth: 1}}>
                <Text style={{textAlign: 'center', fontSize: 30}}>
                  {currentQty}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const RenderMenuList: any = () => {
    return (
      <View style={{marginBottom: 130}}>
        <FlatList
          data={listMenu}
          renderItem={RenderMenuItem}
          keyExtractor={(item: MenusInterface, index: number) => `${index}`}
          refreshing={refreshing}
          extraData={order}
          ListEmptyComponent={() => {
            return (
              <>
                {isEmpty(listMenu) && refreshing ? (
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
        />
      </View>
    );
  };

  useEffect(() => {
    console.log('ORDER', order);
  }, [recap, order]);

  useEffect(() => {
    getListMenu();
  }, [getListMenu]);
  return (
    <SafeAreaProvider>
      <HeaderRNE
        backgroundColor="#00a1e9"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="arrowleft" type="antdesign" color="white" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: `${data?.merchant_name}`,
          style: {color: '#ffffff', fontWeight: '700', fontSize: 20},
        }}
        rightComponent={
          <TouchableOpacity onPress={() => getRecapOrder()}>
            <Icon name="checkmark-done" type="ionicon" color="white" />
          </TouchableOpacity>
        }
      />
      <SafeAreaView>
        <RenderMenuList />
      </SafeAreaView>
      <Dialog
        isVisible={showRecapModal}
        onBackdropPress={() => {
          setShowRecapModal(false);
        }}>
        <Dialog.Title title="Konfirmasi Orderan" />
        {showRecapLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            style={{borderBottomWidth: 1}}
            data={recap.products}
            keyExtractor={(item: any, index: number) => `${index}`}
            renderItem={(items: any) => {
              const {item} = items;
              return (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{item.product_name}</Text>
                  <Text>@{item.price}</Text>
                  <Text>{item.quantity}</Text>
                  <Text>{item.total}</Text>
                </View>
              );
            }}
          />
        )}
        <View>
          <Text style={{textAlign: 'right', fontWeight: '700'}}>
            {recap?.total}
          </Text>
        </View>
        {recap?.total > 0 && (
          <View style={{marginTop: 5}}>
            <Button
              onPress={() => {
                createNewOrder();
              }}>
              Order Sekarang!
            </Button>
          </View>
        )}
      </Dialog>
    </SafeAreaProvider>
  );
};

const menuStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
});

export default ListMenu;
