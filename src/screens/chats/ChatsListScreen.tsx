import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';

type DrawerRole = 'student' | 'teacher';

export interface ChatItem {
  id: string;
  name: string;
  subject?: string; // only for teacher contacts (student sees teacher's subject)
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

// Student sees → list of Teachers (each has a subject)
const STUDENT_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Ravi Sharma',
    subject: 'Physics',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Please submit your assignment by tomorrow.',
    time: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Priya Mehta',
    subject: 'Mathematics',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Great work on the last test!',
    time: '9:15 AM',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Anil Verma',
    subject: 'Chemistry',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    lastMessage: 'Chapter 5 notes have been uploaded.',
    time: 'Yesterday',
    unread: 1,
    online: false,
  },
  {
    id: '4',
    name: 'Sunita Rao',
    subject: 'Biology',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    lastMessage: 'Lab session rescheduled to Friday.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Deepak Singh',
    subject: 'English',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    lastMessage: 'Read chapter 3 before next class.',
    time: 'Mon',
    unread: 0,
    online: true,
  },
  {
    id: '6',
    name: 'Kavita Joshi',
    subject: 'History',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    lastMessage: 'Quiz on Monday. Be prepared!',
    time: 'Sun',
    unread: 3,
    online: false,
  },
];

// Teacher sees → list of Students (no subject)
const TEACHER_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastMessage: 'Sir, I have a doubt in chapter 4.',
    time: '11:02 AM',
    unread: 3,
    online: true,
  },
  {
    id: '2',
    name: 'Sneha Gupta',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    lastMessage: 'Thank you for the notes!',
    time: '10:30 AM',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    lastMessage: 'Can I submit the assignment tomorrow?',
    time: 'Yesterday',
    unread: 1,
    online: false,
  },
  {
    id: '4',
    name: 'Pooja Singh',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    lastMessage: 'I missed the class today.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Karan Shah',
    avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    lastMessage: 'Understood, thank you!',
    time: 'Mon',
    unread: 0,
    online: true,
  },
  {
    id: '6',
    name: 'Nisha Verma',
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    lastMessage: 'Please share the study material.',
    time: 'Sun',
    unread: 2,
    online: false,
  },
];

const ChatRow = ({
  item,
  isStudent,
  onPress,
}: {
  item: ChatItem;
  isStudent: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
    <View style={s.avatarWrap}>
      <Image source={{ uri: item.avatar }} style={s.avatar} />
      {item.online && <View style={s.onlineDot} />}
    </View>

    <View style={s.body}>
      <View style={s.topRow}>
        <View style={s.nameRow}>
          <Text style={s.name} numberOfLines={1}>
            {item.name}
          </Text>
          {/* subject badge only when student views teacher */}
          {isStudent && item.subject && (
            <View style={s.subjectBadge}>
              <Text style={s.subjectText}>{item.subject}</Text>
            </View>
          )}
        </View>
        <Text
          style={[s.time, item.unread > 0 && { color: theme.colors.primary }]}
        >
          {item.time}
        </Text>
      </View>

      <View style={s.bottomRow}>
        <Text
          style={[s.lastMsg, item.unread > 0 && s.lastMsgBold]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
        {item.unread > 0 && (
          <View style={s.unreadBadge}>
            <Text style={s.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ChatsListScreen = ({ navigation, route }: any) => {
  const userRole: DrawerRole =
    route?.params?.userRole === 'teacher' ? 'teacher' : 'student';
  const chats = userRole === 'student' ? STUDENT_CHATS : TEACHER_CHATS;

  return (
    <View style={s.root}>
      <Header title="Chats" />
      <FlatList
        data={chats}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item }) => (
          <ChatRow
            item={item}
            isStudent={userRole === 'student'}
            onPress={() =>
              navigation.navigate('UserChats', {
                chat: item,
                userRole,
              })
            }
          />
        )}
      />
    </View>
  );
};

export default ChatsListScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingVertical: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: theme.colors.surface,
  },

  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  subjectBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  time: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMsg: {
    fontSize: 13,
    color: theme.colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  lastMsgBold: { color: theme.colors.textSecondary, fontWeight: '600' },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { fontSize: 11, fontWeight: '800', color: '#fff' },

  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 80,
  },
});
