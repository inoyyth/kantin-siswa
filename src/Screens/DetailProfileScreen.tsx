import React, {FunctionComponent} from 'react';
import {Text, Header as HeaderRNE, Icon} from '@rneui/themed';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

const DetailProfileScreen: FunctionComponent<Props> = (props: Props) => {
  const {
    navigation,
    route: {params},
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {data, storage} = params;

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
          text: 'Detail Profile',
          style: {color: '#ffffff', fontWeight: '700', fontSize: 20},
        }}
      />
      <View style={{padding: 10}}>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Nama Lengkap:</Text>
          <Text style={styles.text}>{data?.name}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Jenis Kelamin:</Text>
          <Text style={styles.text}>
            {data?.sex === 'M' ? 'Laki-laki' : 'Perempuan'}
          </Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{data?.email}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>NIK:</Text>
          <Text style={styles.text}>{data?.nik}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>NIS:</Text>
          <Text style={styles.text}>{data?.nis}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>No. Handphone:</Text>
          <Text style={styles.text}>{data?.phone_number}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Alamat:</Text>
          <Text style={styles.text}>{data?.address}</Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#b3b3cc',
  },
  text: {
    fontWeight: '700',
    fontSize: 15,
  },
  wrapper: {
    marginBottom: 10,
  },
});

export default DetailProfileScreen;
