import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';

type DrawerRole = 'student' | 'teacher';

// WhatsApp palette
const WA = {
  teal: '#075E54',
  tealDark: '#054D44',
  green: '#25D366',
  bubbleMe: '#DCF8C6',
  bubbleOther: '#FFFFFF',
  chatBg: '#ECE5DD',
  blueTick: '#34B7F1',
  textDark: '#111B21',
  textGrey: '#667781',
  chip: '#FFF5C4',
};

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

const Ticks = ({ status }: { status: Message['status'] }) => (
  <VectorIcon
    iconSet="Ionicons"
    iconName={status === 'sent' ? 'checkmark' : 'checkmark-done'}
    size={14}
    color={status === 'read' ? WA.blueTick : '#8696A0'}
  />
);

const Bubble = ({ msg }: { msg: Message }) => {
  const isMe = msg.sender === 'me';
  return (
    <View style={[s.bubbleWrap, isMe ? s.bubbleWrapMe : s.bubbleWrapOther]}>
      <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
        <Text style={s.bubbleText}>{msg.text}</Text>
        <View style={s.meta}>
          <Text style={s.metaTime}>{msg.time}</Text>
          {isMe && <Ticks status={msg.status} />}
        </View>
      </View>
    </View>
  );
};

const DateChip = ({ label }: { label: string }) => (
  <View style={s.dateChipWrap}>
    <View style={s.dateChip}>
      <Text style={s.dateChipText}>{label}</Text>
    </View>
  </View>
);

const EncryptionNotice = () => (
  <View style={s.dateChipWrap}>
    <View style={s.encChip}>
      <VectorIcon
        iconSet="Ionicons"
        iconName="lock-closed"
        size={10}
        color="#54656F"
      />
      <Text style={s.encText}>
        Messages are end-to-end encrypted. Only people in this chat can read
        them.
      </Text>
    </View>
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
  const subtitle = chat.online
    ? 'online'
    : userRole === 'student'
    ? `Teacher · ${chat.subject ?? ''}`
    : 'Student';

  const hasText = input.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      {/* ── Top bar (WhatsApp style) ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.7}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="arrow-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <Image source={{ uri: chat.avatar }} style={s.topAvatar} />

        <View style={s.topInfo}>
          <Text style={s.topName} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={s.topSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <TouchableOpacity style={s.topIconBtn} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="videocam-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={s.topIconBtn} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="call-outline"
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

      {/* ── Messages over wallpaper ── */}
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
        ListHeaderComponent={
          <>
            <EncryptionNotice />
            <DateChip label="Today" />
          </>
        }
        renderItem={({ item }) => <Bubble msg={item} />}
      />

      {/* ── Input bar (WhatsApp style) ── */}
      <View style={s.inputBar}>
        <View style={s.inputPill}>
          <TouchableOpacity activeOpacity={0.7}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="happy-outline"
              size={22}
              color="#8696A0"
            />
          </TouchableOpacity>
          <TextInput
            style={s.input}
            placeholder="Message"
            placeholderTextColor="#8696A0"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="attach"
              size={22}
              color="#8696A0"
            />
          </TouchableOpacity>
          {!hasText && (
            <TouchableOpacity activeOpacity={0.7}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="camera-outline"
                size={22}
                color="#8696A0"
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={s.sendBtn} onPress={send} activeOpacity={0.85}>
          <VectorIcon
            iconSet="Ionicons"
            iconName={hasText ? 'send' : 'mic'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WA.chatBg },
  flex: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WA.teal,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 52 : 14,
    paddingBottom: 12,
    gap: 8,
    elevation: 4,
  },
  backBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  topInfo: { flex: 1, marginLeft: 2 },
  topName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  topSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
    marginTop: 1,
  },
  topIconBtn: {
    width: 34,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  msgList: { paddingHorizontal: 12, paddingBottom: 8, paddingTop: 4 },

  // Date chip + encryption notice
  dateChipWrap: { alignItems: 'center', marginVertical: 8 },
  dateChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    elevation: 1,
  },
  dateChipText: { fontSize: 12, color: '#54656F', fontWeight: '500' },
  encChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WA.chip,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 24,
    elevation: 1,
  },
  encText: {
    flex: 1,
    fontSize: 11,
    color: '#54656F',
    lineHeight: 16,
    textAlign: 'center',
  },

  // Bubbles
  bubbleWrap: { marginBottom: 3 },
  bubbleWrapMe: { alignItems: 'flex-end' },
  bubbleWrapOther: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  bubbleMe: {
    backgroundColor: WA.bubbleMe,
    borderTopRightRadius: 0,
  },
  bubbleOther: {
    backgroundColor: WA.bubbleOther,
    borderTopLeftRadius: 0,
  },
  bubbleText: { fontSize: 14.5, lineHeight: 20, color: WA.textDark },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-end',
    marginTop: 2,
    marginLeft: 8,
  },
  metaTime: { fontSize: 10.5, color: WA.textGrey },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: WA.textDark,
    maxHeight: 110,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#00A884',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
