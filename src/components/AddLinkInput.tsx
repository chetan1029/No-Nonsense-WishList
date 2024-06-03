import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';
import Feather from 'react-native-vector-icons/Feather';

interface AddLinkInputProp {
  value: string;
  handleOnChageText: any;
  resetUrlField: any;
  urlError: any;
  placeholder: string;
  themeColor: any;
}

const AddLinkInput: React.FC<AddLinkInputProp> = ({
  resetUrlField,
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
      <TouchableOpacity>
        <Feather
          name="link"
          size={20}
          color={urlError ? COLORS.primaryRedHex : themeColor.primaryText}
          style={styles.InputIcon}
        />
      </TouchableOpacity>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.primaryLightGreyHex}
        style={[styles.TextInputContainer, {color: themeColor.secondaryText}]}
        onChangeText={handleOnChageText}
        value={value}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            resetUrlField();
          }}>
          <CustomIcon
            style={styles.InputIcon}
            name="close"
            size={FONTSIZE.size_16}
            color={COLORS.primaryLightGreyHex}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default AddLinkInput;

const styles = StyleSheet.create({
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_16,
    borderRadius: BORDERRADIUS.radius_20,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
});
