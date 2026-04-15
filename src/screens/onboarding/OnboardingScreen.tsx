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
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  title: string;
  desc: string;
  lottie: any;
};

const DATA: Slide[] = [
  {
    id: '1',
    title: 'Communication & Administration',
    desc: 'Streamline communication and policies with announcements, queries, contact info, rules & regulations, about app, terms of use and privacy policy — keeping everyone informed and engaged.',
    lottie: require('../../assets/lottiefiles/onboard1.json'),
  },
  {
    id: '2',
    title: 'Learning , Assessments & More...',
    desc: 'Deliver and track academic success with homework, syllabus, quiz exam, admit card, seating plan, exam copy, report card and library — all in one app.',
    lottie: require('../../assets/lottiefiles/onboard2.json'),
  },
  {
    id: '3',
    title: 'Student & Teacher Management',
    desc: 'Effortlessly manage students, teachers, attendance, fee, payroll and ID cards. Track performance, maintain records and ensure smooth day-to-day operations.',
    lottie: require('../../assets/lottiefiles/onboard3.json'),
  },
  {
    id: '4',
    title: 'All-in-One Dashboard for Students \n& Teachers',
    desc: 'Access everything you need in one place — from home, quick links, analytics and account settings to announcements, calendar and contact; keeping students, teachers and administrators connected seamlessly.',
    lottie: require('../../assets/lottiefiles/onboard4.json'),
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
      <View style={styles.illustrationWrap}>
        <LottieView source={item.lottie} autoPlay loop style={styles.illustration} />
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
    backgroundColor: theme.colors.white,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 70,
  },
  illustrationWrap: {
    width: width,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  illustration: {
    width: width * 0.64,
    height: 240,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 200,
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