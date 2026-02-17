import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Composer = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState('');

  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Input placeholder="Type message" value={text} onChangeText={setText} style={{ flex: 1 }} />
      <Button
        label="Send"
        onPress={() => {
          if (!text.trim()) return;
          onSend(text);
          setText('');
        }}
        style={{ paddingVertical: 10, paddingHorizontal: 14 }}
      />
    </View>
  );
};
