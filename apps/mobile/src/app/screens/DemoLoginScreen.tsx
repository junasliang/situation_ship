import React from 'react';
import { View } from 'react-native';
import { useAppStore } from '../../store/AppStore';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const DemoLoginScreen = ({ onContinue }: { onContinue: () => void }) => {
  const { currentUser, users, switchUser } = useAppStore();

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>situation_ship</Text>
      <Text style={{ opacity: 0.8 }}>Time-limited event rooms with archive memory.</Text>
      <Card>
        <Text style={{ fontWeight: '700' }}>Current demo user</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar name={currentUser.displayName} size={44} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{currentUser.displayName}</Text>
            <Text>{currentUser.bio}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Switch user (debug)</Text>
        <View style={{ gap: 8 }}>
          {users.map((user) => (
            <Button
              key={user.id}
              label={user.displayName}
              variant={currentUser.id === user.id ? 'primary' : 'secondary'}
              onPress={() => switchUser(user.id)}
            />
          ))}
        </View>
      </Card>

      <Button label="Continue as Demo User" onPress={onContinue} />
    </Screen>
  );
};
