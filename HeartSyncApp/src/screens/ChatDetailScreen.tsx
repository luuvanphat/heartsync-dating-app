import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Message} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChatDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const {matchId} = route.params as {matchId: string};
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const matches = useStore((state) => state.matches);
  const chats = useStore((state) => state.chats);
  const sendMessage = useStore((state) => state.sendMessage);
  const markMessagesAsRead = useStore((state) => state.markMessagesAsRead);

  const match = matches.find((m) => m.id === matchId);
  const messages = chats[matchId] || [];

  React.useEffect(() => {
    markMessagesAsRead(matchId);
  }, [matchId]);

  const handleBlockUser = () => {
    setMenuVisible(false);
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${match?.user.name}? They won't be able to message you anymore.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Blocked', `${match?.user.name} has been blocked`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleDeleteChat = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Conversation has been deleted');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleReport = () => {
    setMenuVisible(false);
    Alert.alert(
      'Report User',
      'Please select a reason for reporting:',
      [
        {text: 'Inappropriate content'},
        {text: 'Spam or scam'},
        {text: 'Harassment'},
        {text: 'Other'},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  if (!match) return null;

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(matchId, inputText.trim());
      setInputText('');
    }
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isMe = item.senderId === 'current-user';

    return (
      <View style={[styles.messageContainer, isMe && styles.myMessage]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerCenter}>
          <Image source={{uri: match.user.photos[0]}} style={styles.headerImage} />
          <View>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{match.user.name}, {match.user.age}</Text>
              {match.user.verified && <Icon name="checkmark-circle" size={16} color="#fff" />}
            </View>
            <Text style={styles.headerJob}>{match.user.occupation}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VideoCall', {matchId})}>
            <Icon name="videocam" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Icon name="ellipsis-vertical" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      

      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>Today</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.gamePrompt}>
        <Icon name="game-controller" size={24} color="#00BCD4" />
        <View style={styles.gameText}>
          <Text style={styles.gameTitle}>Invite your match to play a mini-game.</Text>
          <Text style={styles.gameSubtitle}>Break the ice and find out if you both sync on a deeper level.</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton}>
          <Icon name="happy-outline" size={24} color="#00BCD4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="game-controller" size={24} color="#00BCD4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="images" size={24} color="#00BCD4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="camera" size={24} color="#00BCD4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="location" size={24} color="#00BCD4" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity>
            <Icon name="happy-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={24} color="#00BCD4" />
        </TouchableOpacity>
      </View>
      {menuVisible && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity 
            style={styles.menuBackdrop} 
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuOption} onPress={handleReport}>
              <Icon name="flag-outline" size={20} color="#333" />
              <Text style={styles.menuOptionText}>Report User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption} onPress={handleBlockUser}>
              <Icon name="ban-outline" size={20} color="#FF9800" />
              <Text style={[styles.menuOptionText, styles.warningText]}>Block User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption} onPress={handleDeleteChat}>
              <Icon name="trash-outline" size={20} color="#FF3B30" />
              <Text style={[styles.menuOptionText, styles.dangerText]}>Delete Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00BCD4',
    gap: 12,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerJob: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  dateHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  theirBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    backgroundColor: '#00BCD4',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  myMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  gamePrompt: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FA',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  gameText: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BCD4',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  emojiButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  menuBackdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    minWidth: 180,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuOptionText: {
    fontSize: 15,
    color: '#333',
  },
  warningText: {
    color: '#FF9800',
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export default ChatDetailScreen;