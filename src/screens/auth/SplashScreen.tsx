import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }: Props) => {
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const taglineOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Subtle background circles for depth */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Logo image */}
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Connecting Healthcare Professionals to Opportunities
      </Animated.Text>

      {/* Bottom text */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Version 1.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleTop: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: colors.primaryLight,
    top: -width * 0.2,
    right: -width * 0.2,
  },

  circleBottom: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: colors.primaryLight,
    bottom: -width * 0.15,
    left: -width * 0.15,
  },

  logo: {
    width: 400,
    height: 400,
    marginBottom: 24,
  },

  brandName: {
    fontSize: typography.xxxl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 8,
  },

  tagline: {
    fontSize: typography.md,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },

  bottomText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default SplashScreen;