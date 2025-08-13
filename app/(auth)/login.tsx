import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { requestOtp, verifyOtp } from '@/api/services/authService';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    try {
      setLoading(true);
      await requestOtp(phone);
      setSent(true);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    try {
      setLoading(true);
      await verifyOtp(phone, code);
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Login</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />
      {sent && (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="OTP code"
          keyboardType="number-pad"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
        />
      )}
      {!sent ? (
        <Button title={loading ? 'Sending...' : 'Send OTP'} onPress={onSend} disabled={loading || !phone} />
      ) : (
        <Button title={loading ? 'Verifying...' : 'Verify'} onPress={onVerify} disabled={loading || !code} />
      )}
    </View>
  );
}


