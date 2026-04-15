import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  Easing,
} from 'react-native';
import { theme } from '../../utils/theme';

const SplashScreen = ({ navigation }: any) => {
  const scale = useRef(new Animated.Value(0.6)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(10)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;
  const float5 = useRef(new Animated.Value(0)).current;
  const float6 = useRef(new Animated.Value(0)).current;
  const float7 = useRef(new Animated.Value(0)).current;
  const float8 = useRef(new Animated.Value(0)).current;

  const driftX1 = useRef(new Animated.Value(0)).current;
  const driftX2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 6,
      useNativeDriver: true,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, {
            toValue: 1.05,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breathe, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(brandTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 600);

    const floatAnim = (anim: Animated.Value, distance: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -distance,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: distance,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    floatAnim(float1, 10).start();
    floatAnim(float2, 15).start();
    floatAnim(float3, 8).start();
    floatAnim(float4, 12).start();
    floatAnim(float5, 18).start();
    floatAnim(float6, 9).start();
    floatAnim(float7, 14).start();
    floatAnim(float8, 11).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(driftX1, {
          toValue: 12,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(driftX1, {
          toValue: -12,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(driftX2, {
          toValue: -10,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(driftX2, {
          toValue: 10,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const t = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => {
      scale.stopAnimation();
      breathe.stopAnimation();
      float1.stopAnimation();
      float2.stopAnimation();
      float3.stopAnimation();
      float4.stopAnimation();
      float5.stopAnimation();
      float6.stopAnimation();
      float7.stopAnimation();
      float8.stopAnimation();
      driftX1.stopAnimation();
      driftX2.stopAnimation();
      clearTimeout(t);
    };
  }, []);

  return (
    <View style={styles.safeArea}>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float1 }], top: 100, left: 40 }]}>📚</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float2 }], top: 200, right: 50 }]}>🎓</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float3 }], bottom: 150, left: 80 }]}>✏️</Animated.Text>

      <Animated.Text style={[styles.icon, { transform: [{ translateY: float4 }, { translateX: driftX1 }], top: 80, right: 30, fontSize: 24 }]}>📖</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float5 }], bottom: 120, right: 60, fontSize: 32 }]}>🧠</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float6 }, { translateX: driftX2 }], bottom: 200, left: 30, fontSize: 22 }]}>🧪</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float7 }], top: 250, left: 120, fontSize: 26 }]}>🧮</Animated.Text>
      <Animated.Text style={[styles.icon, { transform: [{ translateY: float8 }], bottom: 80, right: 100, fontSize: 20 }]}>📘</Animated.Text>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              transform: [{ scale }, { scale: breathe }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Image source={{ uri: 'logo' }} style={styles.badgeImage} />
          </View>

          <Animated.Text
            style={[
              styles.brand,
              {
                opacity: brandOpacity,
                transform: [{ translateY: brandTranslate }],
              },
            ]}
          >
            Edyone LMS
          </Animated.Text>

          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Learning made simple
          </Animated.Text>
        </Animated.View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.madeWith}>Made with ❤️ in India</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  badge: {
    width: 160,
    height: 160,
    borderRadius: 100,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  badgeImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  brand: {
    marginTop: theme.spacing.md,
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  tagline: {
    marginTop: theme.spacing.xs,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  bottom: {
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  madeWith: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  icon: {
    position: 'absolute',
    fontSize: 28,
    opacity: 0.12,
  },
});