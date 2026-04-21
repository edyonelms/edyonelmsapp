import React from 'react';
import { Text, View } from 'react-native';
import { shared } from './feesStyles';

interface Props {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}

const FeeRow = ({ label, value, color, bold }: Props) => (
  <View style={shared.row}>
    <Text style={bold ? shared.rowLabelBold : shared.rowLabel}>{label}</Text>
    <Text style={[bold ? shared.rowValueBold : shared.rowValue, color ? { color } : {}]}>
      {value}
    </Text>
  </View>
);

export default FeeRow;
