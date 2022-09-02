import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {Button} from '@rneui/themed';
import storage from '../Services/storage';
import {isEmpty} from 'lodash';
import {updateVoucher} from '../Services/voucher';

type Props = {
  navigation: any;
};

const ScannerScreen: FunctionComponent<Props> = (props: Props) => {
  const {navigation} = props;
  const scanner = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [storageData, setStorageData] = useState<any>(null);
  const [scan, setScan] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const onSuccess = async (e: any) => {
    console.log(e);
    setScan(false);
    if (!isEmpty(e.data)) {
      await updateVoucher({
        voucherCode: e.data,
        user_id: storageData.user_id,
        token: storageData.token,
      })
        .then(async (res: any) => {
          if (isEmpty(res)) {
            Alert.alert('Error', 'Something went wrong!');
            return false;
          } else if (res.status === 404) {
            Alert.alert('Error', 'Voucher tidak valid!');
          } else if (res.status === 422) {
            Alert.alert('Error', 'Voucher sudah digunakan!');
          } else {
            Alert.alert(
              'Success',
              'Yeay, Top up berhasil. Silahkan kembali ke beranda untuk update saldo ',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('TabMain'),
                },
              ],
            );
          }
        })
        .catch((_err: any) => {
          Alert.alert('Error', 'Something went wrong!');
        });
    }
  };

  const getStorage: Function = async () => {
    await storage
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
      })
      .catch(_err => {
        // any exception including data not found
        // goes to catch()
        navigation.navigate('Login');
      });
  };

  useEffect(() => {
    getStorage();
    console.log('CRIIT');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('CROOT');
  }, [scan]);

  return (
    <>
      {!scan ? (
        <View style={{marginTop: 10}}>
          <Button disabled={buttonLoading} onPress={() => setScan(true)}>
            Scan Ulang
          </Button>
        </View>
      ) : (
        <QRCodeScanner
          ref={scanner}
          reactivate
          showMarker
          onRead={(e: any) => onSuccess(e)}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topContent={
            <Text style={styles.centerText}>
              Arahkan kamera kamu ke barcode, dan pastikan memiliki pencahayaan
              yang cukup terang
            </Text>
          }
          bottomContent={
            <>
              {/* <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => scanner?.current?.reactivate()}>
                <Text style={styles.buttonText}>OK. Got it!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setTorch(true)}>
                <Text style={styles.buttonText}>Torch on/off!</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setScan(false)}>
                <Text style={styles.buttonText}>Batal!</Text>
              </TouchableOpacity>
            </>
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    color: '#777',
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

export default ScannerScreen;
