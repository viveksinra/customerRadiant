import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable } from 'react-native';
import { requestOtp, verifyOtp, getToken } from '@/api/services/authService';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const onSend = async () => {
    try {
      setLoading(true);
      if (!/^\d{10}$/.test(phone)) {
        throw new Error('Enter a valid 10-digit phone number');
      }
      const res = await requestOtp(phone);
      const ttl = Number(res?.ttlSeconds ?? 30);
      setCooldown(ttl > 0 ? ttl : 30);
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
      if (!code || code.length < 4) {
        throw new Error('Enter the OTP sent to your phone');
      }
      await verifyOtp(phone, code);
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto redirect if already logged in
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          router.replace('/');
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

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
        <Button
          title={loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}
          onPress={onSend}
          disabled={loading || !phone || cooldown > 0}
        />
      ) : (
        <>
          <Button
            title={loading ? 'Verifying...' : 'Verify'}
            onPress={onVerify}
            disabled={loading || !code}
          />
          <View style={{ height: 8 }} />
          <Pressable onPress={onSend} disabled={cooldown > 0 || loading}>
            <Text style={{ textAlign: 'center', color: cooldown > 0 ? '#888' : '#007bff' }}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </Text>
          </Pressable>
          <View style={{ height: 8 }} />
          <Pressable
            onPress={() => {
              setSent(false);
              setCode('');
            }}
            disabled={loading}
          >
            <Text style={{ textAlign: 'center', color: '#555' }}>Change phone number</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}


