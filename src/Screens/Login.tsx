import {Button, Image, Input} from '@rneui/themed';
import React, {FunctionComponent, useState} from 'react';
import {Alert, View} from 'react-native';
import {checkAuth} from '../Services/login';
import storage from '../Services/storage';
import {isEmpty} from 'lodash';

type Props = {
  navigation: any;
};

const Login: FunctionComponent<Props> = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {navigation} = props;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const handleLogin: Function = async (): Promise<void> => {
    setLoadingButton(true);
    const grandAccessType: string = 'students';
    await checkAuth({
      email: email,
      password: password,
      grand_access_type: grandAccessType,
    })
      .then(async (res: any) => {
        if (res.status === 401) {
          Alert.alert('Warning', 'Username atau password salah!');
        } else if (res.status === 422) {
          let errorMessage = '';
          const data = res.data;
          for (var key in data) {
            var i = Object.keys(data).indexOf(key) + 1;
            errorMessage += `${i}. ${key} Wajib diisi \n`;
          }
          Alert.alert('Warning', errorMessage);
        } else {
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
          } else {
            await storage.save({
              key: 'auth',
              data: JSON.stringify(res.data),
              expires: res?.data?.expires_in,
            });
            navigation.navigate('TabNavigation');
          }
        }
        setLoadingButton(false);
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
        setLoadingButton(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}>
      <View>
        <Image
          source={require('../../assets/smkn-65.jpeg')}
          style={{width: 100, height: 100}}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          marginTop: 20,
          padding: 10,
          borderWidth: 1,
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View style={{width: 300}}>
          <Input
            label="Username/Email"
            placeholder="Ketik username atau email"
            errorStyle={{color: 'red'}}
            onChangeText={(e: string) => setEmail(e)}
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        <View style={{width: 300}}>
          <Input
            label="Password"
            placeholder="Ketik password"
            secureTextEntry={true}
            onChangeText={(e: string) => setPassword(e)}
            autoComplete="password"
          />
        </View>
        <View>
          <Button
            size="md"
            onPress={() => handleLogin()}
            loading={loadingButton}
            disabled={loadingButton}>
            Login
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
