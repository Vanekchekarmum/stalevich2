import Reac,{useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import StatusBar from '../../components/StatusBar';

import {fonts} from '../../constants/styles';
import {GRAY} from '../../assets/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/style';
import {BOOKTABLE, DELIVERY, RESTAURANTS, SCANQR} from '../../utils/navigation';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {IAuthStore} from '../../stores/AuthStore';
import {IDataStore} from '../../stores/DataStore';
import {inject, observer} from 'mobx-react';

const HomeScreen: React.FC<{
  navigation: any;
  route: any;
  authStore: IAuthStore;
  dataStore: IDataStore;
}> = inject(
  'authStore',
  'dataStore',
)(
  observer(({navigation, route, authStore, dataStore}) => {
    const {setType} = dataStore;
    // const openSberOnline = useCallback(async () => {
    //  Linking.openURL('sberbankonline://')
    // }, []);
  



    return (
      <View>
        <StatusBar />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 14,
            height: WINDOW_HEIGHT - 90 - getBottomSpace(),
          }}>

          <Text style={styles.helloFont}>{'Привет, Джон!'}</Text>
          <Text style={styles.descriptionFont}>
            {'Сегодня отличный день,\n чтобы немного покушать :)'}
          </Text>
          <TouchableOpacity
            style={{marginTop: 28}}
            onPress={() => {
              Camera.requestCameraPermission().then(value => {
                if (value === 'authorized') {
                  setType(BOOKTABLE);
                  navigation.navigate(SCANQR);
                }
              });
            }}>
            <Image
              source={require('../../assets/images/order-on-spot.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType(DELIVERY);
              navigation.navigate(RESTAURANTS);
            }}
            style={{marginTop: 15}}>
            <Image
              source={require('../../assets/images/order-delivery.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType(BOOKTABLE);
              navigation.navigate(RESTAURANTS);
            }}
            style={{marginTop: 15}}>
            <Image
              source={require('../../assets/images/book-table.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <View style={{height: 16}} />
        </ScrollView>
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  buttonImage: {
    width: WINDOW_WIDTH - 28,
    height: (WINDOW_WIDTH - 28) * 0.476744,
  },
  descriptionFont: {
    ...fonts.font16semibold,
    marginTop: 9,
    textAlign: 'center',
    color: GRAY,
  },
  helloFont: {
    ...fonts.font28bold,
    marginTop: 36,
    textAlign: 'center',
  },
});

export default HomeScreen;
