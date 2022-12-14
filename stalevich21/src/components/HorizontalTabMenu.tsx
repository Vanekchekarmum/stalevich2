import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RED, WHITE} from '../assets/colors';
import {fonts} from '../constants/styles';

const itemsDefault = [
  {
    name: 'Все',
    type: 'all',
  },
  {
    name: 'По названию',
    type: 'name',
  },
  {
    name: 'По рейтингу',
    type: 'rating',
  },
  {
    name: 'По стоимости',
    type: 'price',
  },
];

const HorizontalTabMenu: React.FC<{
  style?: object;
  onChange: (value: string) => void;
  defaultValue?: string;
  items: {name: string; type: string}[];
}> = ({style, onChange, defaultValue, items = itemsDefault}) => {
  const [selected, setSelected] = useState(defaultValue);

  const onChangeLocal = (value: {name: string; type: string}) => {
    onChange && onChange(value.type);
    setSelected(value.type);
  };

  return (
    <ScrollView
      style={style}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      {items.map((item: {name: string; type: string}) => (
        <TouchableOpacity
          style={[
            styles.button,
            selected === item?.type && {backgroundColor: RED},
          ]}
          onPress={() => onChangeLocal(item)}
          key={item?.type}>
          <Text style={fonts.font12bold}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 28,
    borderRadius: 28,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: WHITE,
    marginRight: 8,
  },
});

export default HorizontalTabMenu;
