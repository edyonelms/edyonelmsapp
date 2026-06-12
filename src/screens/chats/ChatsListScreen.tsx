import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

type DrawerRole = 'student' | 'teacher';

// WhatsApp palette
const WA = {
  teal: '#075E54',
  green: '#25D366',
  textDark: '#111B21',
  textGrey: '#667781',
};

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
        <Text style={[s.time, item.unread > 0 && { color: WA.green }]}>
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
      {/* ── Top bar (WhatsApp style) ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.topIconBtn}
          activeOpacity={0.7}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="arrow-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={s.topTitle}>Chats</Text>
        <TouchableOpacity style={s.topIconBtn} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="camera-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={s.topIconBtn} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="search"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={s.topIconBtn} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="ellipsis-vertical"
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

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

      {/* ── New chat FAB (WhatsApp style) ── */}
      <TouchableOpacity style={s.fab} activeOpacity={0.85}>
        <VectorIcon
          iconSet="MaterialCommunityIcons"
          iconName="message-text"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatsListScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WA.teal,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 52 : 14,
    paddingBottom: 12,
    gap: 4,
    elevation: 4,
  },
  topIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
  },

  list: { paddingVertical: 6, paddingBottom: 90 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
  },

  avatarWrap: { position: 'relative', marginRight: 13 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: WA.green,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: WA.textDark,
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
  time: { fontSize: 12, color: WA.textGrey, fontWeight: '400' },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMsg: {
    fontSize: 14,
    color: WA.textGrey,
    flex: 1,
    marginRight: 8,
  },
  lastMsgBold: { color: WA.textDark, fontWeight: '500' },

  unreadBadge: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: WA.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 11, fontWeight: '800', color: '#fff' },

  separator: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginLeft: 79,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: WA.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
