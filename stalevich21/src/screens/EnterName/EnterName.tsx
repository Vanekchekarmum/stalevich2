import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ButtonBack from '../../components/ButtonBack';
import InputWithLabel from '../../components/InputWithLabel';
import ButtonRed from '../../components/ButtonRed';

import {LIGHT_GRAY} from '../../assets/colors';
import {fonts} from '../../constants/styles';
import {WINDOW_HEIGHT, wrappers} from '../../utils/style';
import {PROFILE} from '../../utils/navigation';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const EnterName = ({navigation}) => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={styles.wrapper}>
      <View>
        <ButtonBack onPress={() => navigation.goBack()} />
        <View style={wrappers.centeredWrapper}>
          <Text style={styles.fontProfile}>{'Как вас зовут?'}</Text>
          <InputWithLabel
            style={{marginTop: 24, width: '100%'}}
            defaultValue={'Джон'}
          />
        </View>
      </View>
      <ButtonRed
        style={{marginTop: WINDOW_HEIGHT - 360 - getBottomSpace()}}
        label={'Продолжить'}
        //onPress={() => navigation.navigate(PROFILE)}
        onPress={() => {}}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  fontProfile: {
    ...fonts.font22extrabold,
    marginTop: 24,
  },
  wrapper: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 14,
    paddingTop: 44,
  },
});

export default EnterName;
