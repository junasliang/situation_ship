import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { ArchiveDetailScreen } from '../screens/ArchiveDetailScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { BoardScreen } from '../screens/BoardScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { DemoLoginScreen } from '../screens/DemoLoginScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { ManageParticipantsScreen } from '../screens/ManageParticipantsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoomScreen } from '../screens/RoomScreen';
import { useAppStore } from '../../store/AppStore';
import { Text } from '../../ui/Text';
import { colors } from '../../ui/theme';
import { ArchiveRoute, BoardRoute, TabName, findEvent } from './types';

const TabButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: active ? '#d1fae5' : '#fff' }}>
    <Text style={{ fontWeight: active ? '800' : '600' }}>{label}</Text>
  </Pressable>
);

export const AppShell = () => {
  const { events } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('Board');

  const [boardStack, setBoardStack] = useState<BoardRoute[]>([{ name: 'Board' }]);
  const [archiveStack, setArchiveStack] = useState<ArchiveRoute[]>([{ name: 'Archive' }]);

  const boardTop = boardStack[boardStack.length - 1];
  const archiveTop = archiveStack[archiveStack.length - 1];

  const boardEvent = useMemo(
    () => (boardTop && 'eventId' in boardTop ? findEvent(events, boardTop.eventId) : undefined),
    [boardTop, events]
  );
  const archiveEvent = useMemo(
    () => (archiveTop && 'eventId' in archiveTop ? findEvent(events, archiveTop.eventId) : undefined),
    [archiveTop, events]
  );

  if (!isAuthenticated) {
    return <DemoLoginScreen onContinue={() => setIsAuthenticated(true)} />;
  }

  const renderBoard = () => {
    if (boardTop.name === 'Board') {
      return <BoardScreen onOpenEvent={(event) => setBoardStack((prev) => [...prev, { name: 'EventDetail', eventId: event.id }])} />;
    }

    if (boardTop.name === 'EventDetail') {
      if (!boardEvent) {
        return <BoardScreen onOpenEvent={(event) => setBoardStack([{ name: 'EventDetail', eventId: event.id }])} />;
      }
      return (
        <EventDetailScreen
          event={boardEvent}
          onBack={() => setBoardStack((prev) => prev.slice(0, -1))}
          onEnterRoom={(event) => setBoardStack((prev) => [...prev, { name: 'Room', eventId: event.id }])}
          onManageParticipants={(event) => setBoardStack((prev) => [...prev, { name: 'ManageParticipants', eventId: event.id }])}
        />
      );
    }

    if (boardTop.name === 'Room') {
      if (!boardEvent) return null;
      return <RoomScreen event={boardEvent} onBack={() => setBoardStack((prev) => prev.slice(0, -1))} />;
    }

    if (boardTop.name === 'ManageParticipants') {
      if (!boardEvent) return null;
      return <ManageParticipantsScreen event={boardEvent} onBack={() => setBoardStack((prev) => prev.slice(0, -1))} />;
    }

    return null;
  };

  const renderArchive = () => {
    if (archiveTop.name === 'Archive') {
      return <ArchiveScreen onOpen={(event) => setArchiveStack((prev) => [...prev, { name: 'ArchiveDetail', eventId: event.id }])} />;
    }

    if (archiveTop.name === 'ArchiveDetail') {
      if (!archiveEvent) return null;
      return <ArchiveDetailScreen event={archiveEvent} onBack={() => setArchiveStack((prev) => prev.slice(0, -1))} />;
    }

    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'Board' ? renderBoard() : null}
        {activeTab === 'Create' ? (
          <CreateEventScreen
            onCreated={(event) => {
              setActiveTab('Board');
              setBoardStack([{ name: 'Board' }, { name: 'EventDetail', eventId: event.id }]);
            }}
          />
        ) : null}
        {activeTab === 'Archive' ? renderArchive() : null}
        {activeTab === 'Profile' ? <ProfileScreen onLogout={() => setIsAuthenticated(false)} /> : null}
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#d1d5db', backgroundColor: '#fff' }}>
        <TabButton label="Board" active={activeTab === 'Board'} onPress={() => setActiveTab('Board')} />
        <TabButton label="Create" active={activeTab === 'Create'} onPress={() => setActiveTab('Create')} />
        <TabButton label="Archive" active={activeTab === 'Archive'} onPress={() => setActiveTab('Archive')} />
        <TabButton label="Profile" active={activeTab === 'Profile'} onPress={() => setActiveTab('Profile')} />
      </View>
    </SafeAreaView>
  );
};
