import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;
};

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../assets/nurse.png'),
    title: 'Find Healthcare Shifts Easily',
    description:
      'Discover verified healthcare opportunities from hospitals, clinics, and healthcare facilities near you.',
  },
  {
    id: '2',
    image: require('../../assets/verificate.png'),
    title: 'Get Verified and Build Trust',
    description:
      'Upload your licenses and certifications once and get matched with facilities looking for qualified professionals.',
  },
  {
    id: '3',
    image: require('../../assets/earning.png'),
    title: 'Work Flexible Shifts and Earn',
    description:
      'Apply for shifts, track applications, manage your schedule, and monitor your earnings all in one place.',
  },
];

const OnboardingScreen = ({ navigation }: Props) => {
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleGetStarted = () => {
    completeOnboarding();
    navigation.replace('Login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const renderSlide = ({ item }: { item: (typeof SLIDES)[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [7, 22, 7],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.28, 1, 0.28],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />

      <View style={styles.indicatorWrapper}>
        {renderDots()}
      </View>

      <View style={styles.bottomControls}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
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
    backgroundColor: colors.background,
  },

  slide: {
    width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 160,
  },

  imageWrapper: {
    width: width * 0.70,
    height: width * 0.70,
    borderRadius: (width * 0.60) / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },

  image: {
    width: '75%',
    height: '75%',
  },

  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },

  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },

  description: {
    fontSize: typography.md,
    textAlign: 'center',
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 300,
  },

  skipButton: {
    position: 'absolute',
    top: 55,
    right: 24,
    zIndex: 100,
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontFamily: typography.medium,
  },

  indicatorWrapper: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },

  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backText: {
    fontSize: typography.md,
    color: colors.primary,
    fontFamily: typography.medium,
  },

  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 40,
  },

  nextButtonText: {
    color: colors.white,
    fontSize: typography.md,
    fontFamily: typography.bold,
  },
});