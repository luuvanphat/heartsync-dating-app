import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useStore} from '../store/useStore';

const VideoCallScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {matchId} = route.params as {matchId: string};
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const matches = useStore((state) => state.matches);
  const currentUser = useStore((state) => state.currentUser);
  const match = matches.find((m) => m.id === matchId);

  if (!match || !currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to start call</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-down" size={32} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.moreButton}>
        <Icon name="ellipsis-vertical" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.mainVideo}>
        <Image
          source={{uri: currentUser.photos[0]}}
          style={styles.videoBackground}
          blurRadius={20}
        />
        <View style={styles.callerInfo}>
          <Image source={{uri: match.user.photos[0]}} style={styles.callerAvatar} />
          <Text style={styles.callerName}>{match.user.name}</Text>
          <Text style={styles.callingText}>Calling...</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.switchButton]}
          onPress={() => setIsVideoOff(!isVideoOff)}>
          <Icon name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.mutedButton]}
          onPress={() => setIsMuted(!isMuted)}>
          <Icon name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={() => navigation.goBack()}>
          <Icon name="call" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  callerInfo: {
    alignItems: 'center',
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  callingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  mutedButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3B30',
    transform: [{rotate: '135deg'}],
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default VideoCallScreen;