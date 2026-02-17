import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AttachmentList } from '../../components/AttachmentList';
import { BadgePickerSheet } from '../../components/BadgePickerSheet';
import { Composer } from '../../components/Composer';
import { MessageBubble } from '../../components/MessageBubble';
import { ParticipantRow } from '../../components/ParticipantRow';
import { useAppStore } from '../../store/AppStore';
import { AttachmentType, Event, EventStatus } from '../../types/models';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';
import { timeUntil } from '../../utils/time';

export const RoomScreen = ({ event, onBack }: { event: Event; onBack: () => void }) => {
  const {
    currentUser,
    users,
    badges,
    messagesByEvent,
    ensureMessagesLoaded,
    sendMessage,
    addAttachment,
    assignBadge,
  } = useAppStore();

  const [showParticipants, setShowParticipants] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  const roomLocked = event.status === EventStatus.Removed;

  useEffect(() => {
    ensureMessagesLoaded(event.id);
  }, [ensureMessagesLoaded, event.id]);

  const messages = messagesByEvent[event.id] ?? [];

  const participantUsers = useMemo(
    () =>
      event.participants
        .map((participant) => ({ participant, user: users.find((entry) => entry.id === participant.userId) }))
        .filter((item) => !!item.user),
    [event.participants, users]
  );

  const isHost = currentUser.id === event.hostUserId;

  if (roomLocked) {
    return (
      <Screen>
        <Button label="Back" variant="secondary" onPress={onBack} />
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Room Removed</Text>
        <Text>This event room has ended. Attachments remain in Archive.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <Button label="Back" variant="secondary" onPress={onBack} />
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{event.title}</Text>
        <Text>{timeUntil(event.endTime)}</Text>
        <Text style={{ opacity: 0.8 }}>Room will disappear after event ends.</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label={showParticipants ? 'Hide Participants' : 'Show Participants'} variant="secondary" onPress={() => setShowParticipants((value) => !value)} />
          {isHost ? <Button label="Assign Badge" variant="secondary" onPress={() => setShowBadgePicker(true)} /> : null}
        </View>
      </Card>

      {showParticipants ? (
        <Card>
          <Text style={{ fontWeight: '700' }}>Participants</Text>
          <View style={{ gap: 8 }}>
            {participantUsers.map(({ participant, user }) =>
              user ? <ParticipantRow key={participant.userId} user={user} status={participant.status} /> : null
            )}
          </View>
        </Card>
      ) : null}

      <Card style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700' }}>Messages</Text>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} sender={users.find((entry) => entry.id === message.senderUserId)} mine={message.senderUserId === currentUser.id} />
          ))}
        </ScrollView>
        <Composer onSend={(text) => sendMessage(event.id, text)} />
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Attachments</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Input placeholder="https://..." value={linkInput} onChangeText={setLinkInput} style={{ flex: 1 }} />
          <Button
            label="Add Link"
            onPress={async () => {
              await addAttachment(event.id, AttachmentType.Link, linkInput);
              setLinkInput('');
            }}
          />
        </View>
        <Button label="Add Photo (Stub)" variant="secondary" onPress={() => addAttachment(event.id, AttachmentType.Photo, `placeholder://photo-${Date.now()}`)} />
        <AttachmentList attachments={event.attachments} />
      </Card>

      <BadgePickerSheet
        visible={showBadgePicker}
        onClose={() => setShowBadgePicker(false)}
        participants={participantUsers.map((item) => item.user!)}
        badges={badges}
        onAssign={(participantUserId, badgeId) => assignBadge(event.id, participantUserId, badgeId)}
      />
    </Screen>
  );
};
