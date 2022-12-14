import React from "react";
import { StyleSheet, View } from "react-native";
import { LIGHT_GRAY } from "../../assets/colors";

const ProfileScreen = () => {
  return (
    <View
      showsVerticalScrollIndicator={false}
      style={styles.wrapper}>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 14,
    paddingTop: 44,
  },
});

export default ProfileScreen;
