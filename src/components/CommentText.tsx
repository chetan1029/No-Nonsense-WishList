import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from './CustomIcon';
import Feather from 'react-native-vector-icons/Feather';

interface CommentTextProp {
  value: string;
  handleOnChageText: any;
  urlError: any;
  placeholder: string;
  themeColor: any;
}

const CommentText: React.FC<CommentTextProp> = ({
  handleOnChageText,
  value,
  urlError,
  placeholder,
  themeColor,
}) => {
  return (
    <View
      style={[
        styles.InputContainerComponent,
        {
          borderColor: urlError ? COLORS.primaryRedHex : '',
          borderWidth: urlError ? 1 : 0,
          backgroundColor: themeColor.priamryDarkBg,
        },
      ]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.primaryLightGreyHex}
        style={[styles.TextInputContainer, {color: themeColor.secondaryText}]}
        onChangeText={handleOnChageText}
        value={value}
      />
    </View>
  );
};

export default CommentText;

const styles = StyleSheet.create({
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    paddingHorizontal: SPACING.space_20,
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 2,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
  },
});
