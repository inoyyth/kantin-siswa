import React, {FunctionComponent, useEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import {Alert, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainHeader from '../Components/MainHeader';
import storage from '../Services/storage';
import {getBalance, getDetailUser, logout} from '../Services/user';
import {Dialog, Icon, ListItem, Text} from '@rneui/themed';

type Props = {
  navigation: any;
};

const ProfileScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  const [storageData, setStorageData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [showModalLogout, setShowModalLogout] = useState<boolean>(false);

  const list = [
    {
      title: 'Profile',
      icon: 'profile',
      type: 'ant-design',
      navigation: 'DetailProfile',
    },
    {
      title: 'Ganti Password',
      icon: 'form-textbox-password',
      type: 'material-community',
      navigation: 'ChangePassword',
    },
    {
      title: 'Logout',
      icon: 'logout',
      type: 'material-community',
      navigation: '',
    },
  ];

  const handleLogout: Function = async (): Promise<void> => {
    await logout({
      token: storageData.token,
    })
      .then(async () => {
        await storage.remove({key: 'auth'});
        setShowModalLogout(false);
        navigation.navigate('Login');
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });

    //
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
  }, []);

  return (
    <SafeAreaProvider>
      <MainHeader name={user?.name} sales={balance?.total} />
      <View>
        {list.map((item, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => {
              if (!isEmpty(item.navigation)) {
                navigation.navigate(item.navigation, {
                  data: user,
                  storage: storageData,
                });
              } else {
                setShowModalLogout(true);
              }
            }}>
            <Icon name={item.icon} type={item.type} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
      <View>
        <Dialog isVisible={showModalLogout}>
          <Dialog.Title title="Logout" />
          <Text>Kamu yakin akan logout?</Text>
          <Dialog.Actions>
            <Dialog.Button title="Ya" onPress={() => handleLogout()} />
            <Dialog.Button
              title="Tidak"
              onPress={() => setShowModalLogout(false)}
            />
          </Dialog.Actions>
        </Dialog>
      </View>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;
