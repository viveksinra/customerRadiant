import { useEffect, useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { get, post } from '@/api/config/axiosConfig';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await get('/api/v1/profile/me');
        setProfile(me);
      } catch {}
    })();
  }, []);

  const onPickAndUpload = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset) return;
    setLoading(true);
    try {
      const key = `profiles/${Date.now()}.jpg`;
      const signed: any = await post('/api/v1/storage/signed-url', { key, contentType: 'image/jpeg' });
      const file = await fetch(asset.uri);
      const blob = await file.blob();
      await fetch(signed.url, { method: signed.method, headers: signed.headers, body: blob });
      const updated = await post('/api/v1/profile/me', { imageUrl: signed.url.split('?')[0] });
      setProfile(updated);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Welcome</Text>
      {profile?.imageUrl ? (
        <Image source={{ uri: profile.imageUrl }} style={{ width: 120, height: 120, borderRadius: 60 }} />
      ) : null}
      <Text>{profile?.name || 'No name'}</Text>
      <Button title={loading ? 'Uploading...' : 'Upload avatar'} onPress={onPickAndUpload} disabled={loading} />
    </View>
  );
}
