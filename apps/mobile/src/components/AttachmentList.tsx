import React from 'react';
import { View } from 'react-native';
import { Attachment, AttachmentType } from '../types/models';
import { BadgePill } from '../ui/BadgePill';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

export const AttachmentList = ({ attachments }: { attachments: Attachment[] }) => {
  if (!attachments.length) return <Text style={{ opacity: 0.7 }}>No attachments yet.</Text>;

  return (
    <View style={{ gap: 8 }}>
      {attachments.map((item) => (
        <Card key={item.id} style={{ padding: 10 }}>
          <BadgePill label={item.type === AttachmentType.Link ? 'Link' : 'Photo'} />
          <Text numberOfLines={1}>{item.url}</Text>
        </Card>
      ))}
    </View>
  );
};
