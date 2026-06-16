import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { FeeType, PaymentStatusResponse } from '../../api/feeApi';
import { usePhonePePayment } from '../../hooks/usePhonePePayment';

interface Props {
  amount: number;
  feeType?: FeeType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  label?: string;
  onPaid?: (result: PaymentStatusResponse) => void;
}

/**
 * "Pay Now" button that drives an online PhonePe fee payment.
 * Drop-in replacement for the static pay buttons on the fee cards — pass the
 * installment `amount` (₹) and the `feeType`.
 */
const PayFeeButton: React.FC<Props> = ({
  amount,
  feeType = 'academic',
  style,
  textStyle,
  iconColor = '#fff',
  label = 'Pay Now',
  onPaid,
}) => {
  const onSettled = useCallback(
    (result: PaymentStatusResponse) => {
      if (result.state === 'COMPLETED') {
        Alert.alert(
          'Payment successful',
          result.receipt_number
            ? `Receipt: ${result.receipt_number}`
            : 'Your fee payment was received.',
        );
        onPaid?.(result);
      } else if (result.state === 'FAILED') {
        Alert.alert('Payment failed', 'Your payment did not go through. Please try again.');
      }
    },
    [onPaid],
  );

  const { phase, payFees, checkStatus, error } = usePhonePePayment(onSettled);

  const busy = phase === 'initiating' || phase === 'checking';

  const onPress = useCallback(() => {
    if (busy) return;

    // After returning from checkout, the same button lets the user re-verify.
    if (phase === 'awaiting') {
      void checkStatus();
      return;
    }

    if (!amount || amount <= 0) {
      Alert.alert('Nothing due', 'There is no pending amount to pay.');
      return;
    }

    Alert.alert(
      'Confirm payment',
      `Pay ₹${amount.toLocaleString('en-IN')} via PhonePe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay', onPress: () => void payFees(amount, feeType) },
      ],
    );
  }, [amount, busy, checkStatus, feeType, payFees, phase]);

  // Surface init/verify errors once.
  React.useEffect(() => {
    if (phase === 'error' && error) {
      Alert.alert('Payment error', error);
    }
  }, [phase, error]);

  const text = phase === 'awaiting' ? 'I have paid — Check' : label;

  return (
    <TouchableOpacity style={style} activeOpacity={0.85} onPress={onPress} disabled={busy}>
      {busy ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <VectorIcon
          iconSet="Ionicons"
          iconName={phase === 'awaiting' ? 'refresh' : 'flash'}
          size={16}
          color={iconColor}
        />
      )}
      <Text style={textStyle}>{busy ? 'Please wait…' : text}</Text>
    </TouchableOpacity>
  );
};

export default PayFeeButton;
