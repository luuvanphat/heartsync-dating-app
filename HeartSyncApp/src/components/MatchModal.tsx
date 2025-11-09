import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../types';

const {width} = Dimensions.get('window');

interface Props {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSendMessage: () => void;
}

const MatchModal: React.FC<Props> = ({visible, user, onClose, onSendMessage}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={32} color="#fff" />
        </TouchableOpacity>

        <Animated.View style={[styles.content, {transform: [{scale: scaleAnim}]}]}>
          <View style={styles.confetti}>
            <Text style={styles.confettiItem}>🎉</Text>
            <Text style={styles.confettiItem}>✨</Text>
            <Text style={styles.confettiItem}>💜</Text>
            <Text style={styles.confettiItem}>🎊</Text>
          </View>

          <Text style={styles.title}>Match found!</Text>

          <View style={styles.photosContainer}>
            <View style={styles.photoWrapper}>
              <Image source={{uri: user.photos[0]}} style={styles.photo} />
            </View>
            <View style={styles.heartIcon}>
              <Icon name="heart" size={50} color="#9C27B0" />
            </View>
          </View>

          <Text style={styles.message}>
            You've both shown interest in each other! Now go send that first
            message. Don't wait too long!
          </Text>

          <View style={styles.promptBox}>
            <Icon name="chatbubble-ellipses" size={24} color="#00BCD4" />
            <Text style={styles.promptText}>
              Stuck on what to say? Choose from these conversation starters!
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.sendButton} onPress={onSendMessage}>
              <Icon name="paper-plane" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: width * 0.85,
    alignItems: 'center',
  },
  confetti: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  confettiItem: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginBottom: 24,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  photoWrapper: {
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  heartIcon: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    elevation: 8,
    shadowColor: '#9C27B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  promptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    color: '#00838F',
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#00BCD4',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keepSwipingButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  keepSwipingText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MatchModal;