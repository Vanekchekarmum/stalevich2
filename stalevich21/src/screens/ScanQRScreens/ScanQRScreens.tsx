import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';
import {IAuthStore} from '../../stores/AuthStore';
import {IDataStore} from '../../stores/DataStore';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {BAG, RESTAURANT, RESTAURANTS} from '../../utils/navigation';
import {inject, observer} from 'mobx-react';


let debounce = null 
const ScanQrScreens: React.FC<{
  navigation: any;
  route: any;
  authStore: IAuthStore;
  dataStore: IDataStore;
}> = inject(
  'authStore',
  'dataStore',
)(
  observer(({navigation, route, authStore, dataStore}) => {
    const camera = useRef<Camera>(null);
    const [loader, setLoader] = useState(true);
    const devices = useCameraDevices();
    const [frameProcessor, barcodes] = useScanBarcodes(
      [BarcodeFormat.ALL_FORMATS],
      {checkInverted: true},
    );
    const {loading,  getShop, getListProducts,setTable,setStreetId,setHouseNumber, setOrganizationId} = dataStore;
    
    useEffect(() => {
      if (devices.back) {
        setLoader(false);
      }
    }, [devices]);

    useEffect(() => {
      if (barcodes[0]?.rawValue) {
        setLoader(true);
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          processResult(barcodes[0]);
        }, 300);
      }
    }, [barcodes, processResult]);

    const processResult = useCallback(
      value => {
        const res= JSON.parse(value.rawValue)
        console.log('-----', res);
        setHouseNumber(res.houseNumber);
        setStreetId(res.streetId)
        setTable(res.tableId);
        setOrganizationId(res.organizationId);
        getShop(res.organizationId);
        getListProducts(res.organizationId);
        setTimeout(() => {
          navigation.navigate(RESTAURANT);
          setLoader(false);
        }, 1000);
      },
      [getListProducts, getShop, navigation],
    );

    return (
      <View style={{flex: 1}}>
        {loader ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator size="large" />
          </View>
        ) : devices.back ? (
          <Camera
            ref={camera}
            style={[styles.camera]}
            device={devices?.back}
            isActive={!loader}
            frameProcessor={frameProcessor}
            frameProcessorFps={50}
            captureAudio={false}
          />
        ) : null}
      </View>
    );
  }),
);
const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default ScanQrScreens;
