import React, {FunctionComponent, useState} from 'react';
import {Button, Header as HeaderRNE, Icon, Input} from '@rneui/themed';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Alert, TouchableOpacity, View} from 'react-native';
import {updatePassword} from '../Services/user';
import {isEmpty, map} from 'lodash';

type Props = {
  navigation: any;
  route: any;
};

const ChangePasswordScreen: FunctionComponent<Props> = (props: Props) => {
  const {
    navigation,
    route: {params},
  } = props;

  const {data, storage} = params;
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const handleUpdatePassword: Function = async () => {
    setLoadingButton(true);
    await updatePassword({
      old_password: oldPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
      token: storage.token,
      user_id: data?.user_id,
    })
      .then(async (res: any) => {
        if (res.status === 422) {
          const response = res.data?.message;
          let errx: string[] = [];
          let i = 1;
          map(response, (x: any) => {
            errx.push(`${i}. ${x[0]}`);
            i++;
          });
          Alert.alert('Warning', errx.join('\n'));
          setLoadingButton(false);
        } else {
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
            setLoadingButton(false);
          }
          console.log(res?.data?.message);
          Alert.alert('Success', res?.data?.message);
          navigation.goBack();
        }
      })
      .catch((_err: any) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };

  return (
    <SafeAreaProvider>
      <HeaderRNE
        backgroundColor="#00a1e9"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="arrowleft" type="antdesign" color="white" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Ganti Password',
          style: {color: '#ffffff', fontWeight: '700', fontSize: 20},
        }}
      />
      <View style={{padding: 5}}>
        <View>
          <Input
            value={oldPassword}
            label="Password Lama"
            placeholder="Ketik password lama"
            onChangeText={(e: string) => setOldPassword(e)}
            secureTextEntry
          />
        </View>
        <View>
          <Input
            value={newPassword}
            label="Password Baru"
            placeholder="Ketik password baru"
            onChangeText={(e: string) => setNewPassword(e)}
            secureTextEntry
          />
        </View>
        <View>
          <Input
            value={confirmPassword}
            label="Confirm Password Baru"
            placeholder="Konfirmasi password baru"
            onChangeText={(e: string) => setConfirmPassword(e)}
            secureTextEntry
          />
        </View>
        <View>
          <Button
            onPress={() => handleUpdatePassword()}
            loading={loadingButton}
            disabled={loadingButton}>
            Update Password!
          </Button>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default ChangePasswordScreen;
