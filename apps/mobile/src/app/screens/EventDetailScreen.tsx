import React, { useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { JoinStatusSheet } from '../../components/JoinStatusSheet';
import { ParticipantRow } from '../../components/ParticipantRow';
import { useAppStore } from '../../store/AppStore';
import { Event, JoinStatus } from '../../types/models';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Divider } from '../../ui/Divider';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';
import { formatDateTime } from '../../utils/time';
import { Ionicons } from '@expo/vector-icons';

export const EventDetailScreen = ({
  event,
  onBack,
  onEnterRoom,
  onManageParticipants,
}: {
  event: Event;
  onBack: () => void;
  onEnterRoom: (event: Event) => void;
  onManageParticipants: (event: Event) => void;
}) => {
  const { currentUser, users, joinEvent, endEvent } = useAppStore();
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const host = users.find((entry) => entry.id === event.hostUserId);
  const me = event.participants.find((participant) => participant.userId === currentUser.id);
  const joined = !!me?.joinedAt;
  const isHost = currentUser.id === event.hostUserId;

  const participantUsers = useMemo(
    () => event.participants.map((participant) => ({ participant, user: users.find((item) => item.id === participant.userId) })).filter((item) => !!item.user),
    [event.participants, users]
  );

  return (
    <Screen
      titleAlign="center"
      title={
        <Text style={{ fontSize: 18, fontWeight: '800' }}>
          {event.title}
        </Text>
      }
      // FIXME: Info in card
      // subtitle={
      //   <Text>
      //     Host: {host?.displayName ?? 'Unknown'}
      //   </Text>
      // }
      left={
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
      }
      
    >
      {/* body 開始 */}
      <Card>
        <Text style={{ fontWeight: '700' }}>Event Info</Text>

        <Text>
          Host: {host?.displayName ?? 'Unknown'}
        </Text>

        <Text>
        {event.description || 'No description'}
        </Text>

        <Text>
          {event.isTimeTBD
            ? 'Time TBD'
            : `${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}`}
        </Text>
      </Card>

      
      <Card>
        <Text style={{ fontWeight: '700' }}>Participants</Text>

        <View style={{ gap: 10 }}>
          {participantUsers.map(({ participant, user }) =>
            user ? (
              <ParticipantRow
                key={participant.userId}
                user={user}
                status={participant.status}
              />
            ) : null
          )}
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Actions</Text>

        {!joined ? (
          <Button
            label="Join Event"
            onPress={() => setJoinModalVisible(true)}
          />
        ) : (
          <Button
            label="Enter Room"
            onPress={() => onEnterRoom(event)}
          />
        )}

        {isHost && (
          <Button
            label="Manage Participants"
            onPress={() => onManageParticipants(event)}
            variant="secondary"
          />
        )}

        {isHost && (
          <Button
            label="Simulate End Event"
            variant="danger"
            onPress={() => endEvent(event.id)}
          />
        )}
      </Card>

      <Divider />

      <Text style={{ opacity: 0.8 }}>
        Room will disappear after event ends. Archive remains accessible for participants.
      </Text>

      <JoinStatusSheet
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onPick={async (status: JoinStatus) => {
          await joinEvent(event.id, status);
          setJoinModalVisible(false);
        }}
      />
    </Screen>
  );
};
