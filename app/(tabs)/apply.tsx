import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { calcEmi } from '@/api/services/loanService';

export default function ApplyScreen() {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('12');
  const [months, setMonths] = useState('60');
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const onCalc = async () => {
    setLoading(true);
    try {
      const res = await calcEmi({
        principal: Number(principal || 0),
        annualInterestRatePct: Number(rate || 0),
        tenureMonths: Number(months || 0),
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>EMI Calculator</Text>
      <TextInput
        value={principal}
        onChangeText={setPrincipal}
        keyboardType="numeric"
        placeholder="Loan Amount"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />
      <TextInput
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
        placeholder="Annual Interest %"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />
      <TextInput
        value={months}
        onChangeText={setMonths}
        keyboardType="numeric"
        placeholder="Tenure (months)"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />
      <Button title={loading ? 'Calculating...' : 'Calculate'} onPress={onCalc} />

      {result && (
        <View style={{ padding: 12 }}>
          <Text>EMI: ₹{result.emi.toFixed(2)}</Text>
          <Text>Total Interest: ₹{result.totalInterest.toFixed(2)}</Text>
          <Text>Total Payment: ₹{result.totalPayment.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
}


