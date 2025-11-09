import React, {useRef} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, PanResponder} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = height * 0.7;
const SWIPE_THRESHOLD = 120;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<Props> = ({user, onSwipeLeft, onSwipeRight}) => {
  const navigation = useNavigation<NavigationProp>();
  const position = useRef(new Animated.ValueXY()).current;
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Scale down slightly on touch
        Animated.spring(scale, {
          toValue: 0.95,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({x: gesture.dx, y: gesture.dy});
      },
      onPanResponderRelease: (_, gesture) => {
        // Scale back to normal
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right with bounce effect
          Animated.spring(position, {
            toValue: {x: width + 100, y: gesture.dy},
            friction: 4,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight();
            position.setValue({x: 0, y: 0});
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left with bounce effect
          Animated.spring(position, {
            toValue: {x: -width - 100, y: gesture.dy},
            friction: 4,
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft();
            position.setValue({x: 0, y: 0});
          });
        } else {
          // Return to center with elastic effect
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            friction: 7,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Add scale animation to labels
  const likeScale = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0.5, 1],
    extrapolate: 'clamp',
  });

  const nopeScale = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const handlePhotoPress = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [
            {translateX: position.x}, 
            {translateY: position.y}, 
            {rotate},
            {scale},
          ],
        },
      ]}
      {...panResponder.panHandlers}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePhotoPress}
        style={styles.imageContainer}>
        <Image
          source={{uri: user.photos[currentPhotoIndex]}}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.photoIndicators}>
          {user.photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentPhotoIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        <Animated.View 
          style={[
            styles.likeLabel, 
            {
              opacity: likeOpacity,
              transform: [{scale: likeScale}],
            }
          ]}>
          <Text style={styles.likeLabelText}>LIKE</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.nopeLabel, 
            {
              opacity: nopeOpacity,
              transform: [{scale: nopeScale}],
            }
          ]}>
          <Text style={styles.nopeLabelText}>NOPE</Text>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.name}>
            {user.name}, {user.age}
          </Text>
          {user.verified && <Icon name="checkmark-circle" size={24} color="#00BCD4" />}
        </View>

        {user.pronouns && (
          <View style={styles.pronounsTag}>
            <Text style={styles.pronounsText}>{user.pronouns}</Text>
          </View>
        )}

        <View style={styles.jobRow}>
          <Icon name="briefcase" size={16} color="#666" />
          <Text style={styles.job}>{user.occupation}</Text>
        </View>

        <View style={styles.locationRow}>
          <Icon name="location" size={16} color="#666" />
          <Text style={styles.location}>
            {user.distance} kilometers away
          </Text>
        </View>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate('ProfileDetail', {userId: user.id})}>
          <Icon name="information-circle" size={32} color="#00BCD4" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoIndicators: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  indicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    transform: [{rotate: '-20deg'}],
  },
  likeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 10,
    transform: [{rotate: '20deg'}],
  },
  nopeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  pronounsTag: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  pronounsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  job: {
    fontSize: 16,
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#fff',
  },
  infoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default SwipeCard;