import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

type DrawerRole = 'student' | 'teacher';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'other',
    text: 'Hello! How are you doing today?',
    time: '9:00 AM',
    status: 'read',
  },
  {
    id: '2',
    sender: 'me',
    text: 'Hi! I am doing well. I had a doubt in chapter 4.',
    time: '9:02 AM',
    status: 'read',
  },
  {
    id: '3',
    sender: 'other',
    text: 'Sure, go ahead. What is your doubt?',
    time: '9:03 AM',
    status: 'read',
  },
  {
    id: '4',
    sender: 'me',
    text: "I didn't understand Newton's 3rd law in the context of rockets.",
    time: '9:05 AM',
    status: 'read',
  },
  {
    id: '5',
    sender: 'other',
    text: "When a rocket expels gas downward, the reaction force pushes the rocket upward. That's Newton's 3rd law in action.",
    time: '9:07 AM',
    status: 'read',
  },
  {
    id: '6',
    sender: 'me',
    text: 'Oh! That makes sense now. Thank you so much!',
    time: '9:08 AM',
    status: 'read',
  },
  {
    id: '7',
    sender: 'other',
    text: 'You are welcome! Please submit your assignment by tomorrow.',
    time: '10:42 AM',
    status: 'delivered',
  },
];

const Bubble = ({ msg }: { msg: Message }) => {
  const isMe = msg.sender === 'me';
  return (
    <View style={[s.bubbleWrap, isMe ? s.bubbleWrapMe : s.bubbleWrapOther]}>
      <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
        <Text style={[s.bubbleText, isMe ? s.bubbleTextMe : s.bubbleTextOther]}>
          {msg.text}
        </Text>
        <View style={s.meta}>
          <Text style={[s.metaTime, isMe ? s.metaTimeMe : s.metaTimeOther]}>
            {msg.time}
          </Text>
          {isMe && (
            <VectorIcon
              iconSet="Ionicons"
              iconName={msg.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={13}
              color={
                msg.status === 'read' ? '#A5B4FC' : 'rgba(255,255,255,0.55)'
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

const DateSep = ({ label }: { label: string }) => (
  <View style={s.dateSep}>
    <View style={s.dateLine} />
    <Text style={s.dateLabel}>{label}</Text>
    <View style={s.dateLine} />
  </View>
);

const ChatsScreen = ({ navigation, route }: any) => {
  // chat item passed from ChatsListScreen
  const chat = route?.params?.chat ?? {
    name: 'Ravi Sharma',
    subject: 'Physics',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    online: true,
  };

  // userRole = who is logged in right now
  const userRole: DrawerRole =
    route?.params?.userRole === 'teacher' ? 'teacher' : 'student';

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      },
    ]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  /*
    Subtitle rules:
    - logged in as STUDENT  → talking to a Teacher → show "Teacher · <subject>"
    - logged in as TEACHER  → talking to a Student → show "Student"
  */
  const subtitle =
    userRole === 'student' ? `Teacher · ${chat.subject ?? ''}` : 'Student';

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      {/* Top Bar */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.7}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={s.topAvatarWrap}>
          <Image source={{ uri: chat.avatar }} style={s.topAvatar} />
          {chat.online && <View style={s.topOnlineDot} />}
        </View>

        <View style={s.topInfo}>
          <Text style={s.topName} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={s.topSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={s.msgList}
        showsVerticalScrollIndicator={false}
        style={s.flex}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
        ListHeaderComponent={<DateSep label="Today" />}
        renderItem={({ item }) => <Bubble msg={item} />}
      />

      {/* Input Bar */}
      <View style={s.inputBar}>
        <TextInput
          style={s.input}
          placeholder="Type a message…"
          placeholderTextColor={theme.colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[s.sendBtn, input.trim().length > 0 && s.sendBtnActive]}
          onPress={send}
          activeOpacity={0.85}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="send"
            size={18}
            color={input.trim().length > 0 ? '#fff' : theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EEF2FF' },
  flex: { flex: 1 }, // used by FlatList

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 52 : 14,
    paddingBottom: 12,
    gap: 10,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAvatarWrap: { position: 'relative' },
  topAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  topOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  topInfo: { flex: 1 },
  topName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  topSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
    marginTop: 1,
  },

  msgList: { paddingHorizontal: 14, paddingBottom: 10, paddingTop: 6 },

  dateSep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 8,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: '#C7D2FE' },
  dateLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },

  bubbleWrap: { marginBottom: 6 },
  bubbleWrapMe: { alignItems: 'flex-end' },
  bubbleWrapOther: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: '#7161ef',
    borderBottomRightRadius: 4,
    shadowColor: '#7161ef',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMe: { color: '#fff' },
  bubbleTextOther: { color: theme.colors.textPrimary },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  metaTime: { fontSize: 10, fontWeight: '500' },
  metaTimeMe: { color: 'rgba(255,255,255,0.6)' },
  metaTimeOther: { color: theme.colors.textMuted },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: theme.colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
