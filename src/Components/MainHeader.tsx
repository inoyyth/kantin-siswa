import React, {FunctionComponent} from 'react';
import {Text} from '@rneui/base';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
import 'moment/locale/id';

type Props = {
  name: string;
  sales: string;
};

const MainHeader: FunctionComponent<Props> = (props: Props) => {
  const {name, sales} = props;
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.title}>Saldo Kamu Saat ini,</Text>
        <Text style={styles.subTitle}>Rp. {sales}</Text>
      </View>
      <View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subTitle}>
          {moment().format('dddd, D MMMM YYYY')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#00a1e9',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default MainHeader;
