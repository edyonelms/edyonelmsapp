import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

const DATA: Slide[] = [
  {
    id: '1',
    title: 'Welcome to Edyone LMS',
    desc: 'Manage your learning journey with one simple and modern app.',
    icon: 'school-outline',
  },
  {
    id: '2',
    title: 'Track Progress',
    desc: 'View attendance, scores and assignments in real-time.',
    icon: 'stats-chart-outline',
  },
  {
    id: '3',
    title: 'Learn Anytime',
    desc: 'Access classes, notes and resources whenever you need them.',
    icon: 'time-outline',
  },
  {
    id: '4',
    title: 'Stay Connected',
    desc: 'Communicate with teachers and parents with ease.',
    icon: 'chatbubbles-outline',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState<number>(0);

  // Sync index on manual swipe
  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setIndex(newIndex);
  };

  const goToSlide = (target: number) => {
    flatListRef.current?.scrollToIndex({ index: target, animated: true });
    setIndex(target);
  };

  const onNext = () => {
    if (index === DATA.length - 1) {
      navigation.replace('SelectUser');
      return;
    }

    goToSlide(index + 1);
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconBadge}>
        <VectorIcon
          iconSet="Ionicons"
          iconName={item.icon}
          size={64}
          color={theme.colors.primary}
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />

      <View style={styles.dotContainer}>
        {DATA.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index
                    ? theme.colors.primary
                    : theme.colors.border,
                width: i === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={() => navigation.replace('SelectUser')}
          activeOpacity={0.85}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.9}
          onPress={onNext}
        >
          <Text style={styles.nextText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  iconBadge: {
    width: 180,
    height: 180,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  bottomActions: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
  },
  nextText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});