import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {BORDERRADIUS} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';
// Function to generate a random hex color
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const PlaceholderImage = () => {
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  return (
    <View style={[styles.Image, {backgroundColor: color1}]}>
      {/* Customize the gradient colors as per your requirement */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `linear-gradient(to bottom, ${color1}, ${color2})`,
        }}>
        <Feather name="shopping-cart" size={20} color={'white'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Image: {
    height: 70,
    width: 70,
    borderRadius: BORDERRADIUS.radius_15,
  },
});

export default memo(PlaceholderImage);
