import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, View, Pressable } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: 12,
      paddingHorizontal: 14,
    }}
  >
    <Text style={{ fontWeight: '700', color: danger ? '#b91c1c' : '#111827' }}>
      {label}
    </Text>
  </Pressable>
);

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

  const [menuOpen, setMenuOpen] = useState(false);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
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
    <Screen
      titleAlign="center"
      title={
        <Text style={{ fontSize: 18, fontWeight: '800' }}>
          {event.title}
        </Text>
      }
      left={
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
      }
      right={
        <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
          <Ionicons name="menu" size={24} color="#111827" />
        </Pressable>
      }
      scroll={false} 
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0} // Typing and keyboard gap
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => {

              const prev = messages[index - 1];
              const next = messages[index + 1];

              const mine = message.senderUserId === currentUser.id;

              const isSameAsPrev =
                prev && prev.senderUserId === message.senderUserId;

              const isSameAsNext =
                next && next.senderUserId === message.senderUserId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  sender={users.find((u) => u.id === message.senderUserId)}
                  mine={mine}

                  // ⭐ 新增 props
                  showAvatar={!mine && !isSameAsPrev}
                  showName={!mine && !isSameAsPrev}

                  groupTop={!isSameAsPrev}
                  groupBottom={!isSameAsNext}
                />
              );
            })}
          </ScrollView>

          <View style={{ paddingTop: 8 }}>
            <Composer onSend={(text) => sendMessage(event.id, text)} />
          </View>
        </View>
        
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >

          <Pressable
            onPress={() => setMenuOpen(false)}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)' }}
          >

            <View
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                top: 60,
                right: 16,
                width: 220,
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                overflow: 'hidden',
              }}
            >
              <MenuItem
                label={showParticipants ? 'Hide participants' : 'Show participants'}
                onPress={() => {
                  setMenuOpen(false);
                  setShowParticipants((v) => !v);
                }}
              />

              {isHost ? (
                <MenuItem
                  label="Assign badge"
                  onPress={() => {
                    setMenuOpen(false);
                    setShowBadgePicker(true);
                  }}
                />
              ) : null}

              <MenuItem
                label={showAttachments ? 'Hide attachments' : 'Attachments'}
                onPress={() => {
                  setMenuOpen(false);
                  setShowAttachments((v) => !v);
                }}
              />
            </View>
          </Pressable>
        </Modal>

        {/* ===== Turn on when needed ===== */}
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

        {showAttachments ? (
          <Card>
            <Text style={{ fontWeight: '700' }}>Attachments</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
              <Input placeholder="https://..." value={linkInput} onChangeText={setLinkInput} style={{ flex: 1 }} />
              <Button
                label="Add"
                onPress={async () => {
                  await addAttachment(event.id, AttachmentType.Link, linkInput);
                  setLinkInput('');
                }}
              />
            </View>
            <AttachmentList attachments={event.attachments} />
          </Card>
        ) : null}

        <BadgePickerSheet
          visible={showBadgePicker}
          onClose={() => setShowBadgePicker(false)}
          participants={participantUsers.map((item) => item.user!)}
          badges={badges}
          onAssign={(participantUserId, badgeId) => assignBadge(event.id, participantUserId, badgeId)}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};