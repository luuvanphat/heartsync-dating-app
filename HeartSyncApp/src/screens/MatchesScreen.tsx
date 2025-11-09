import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Match} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MatchesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const matches = useStore((state) => state.matches);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Filter matches based on search
  const filteredMatches = matches.filter(match =>
    match.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate chats with messages
  const chatsWithMessages = filteredMatches.filter(m => m.lastMessage);

  const renderMatchItem = ({item}: {item: Match}) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => navigation.navigate('ChatDetail', {matchId: item.id})}>
      <View style={styles.matchImageContainer}>
        <Image source={{uri: item.user.photos[0]}} style={styles.matchImage} />
        {item.user.isOnline && <View style={styles.onlineDot} />}
      </View>
      <Text style={styles.matchName}>{item.user.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({item}: {item: Match}) => {
    const timeAgo = Math.floor((Date.now() - item.matchedAt.getTime()) / 3600000);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatDetail', {matchId: item.id})}>
        <View style={styles.chatImageContainer}>
          <Image source={{uri: item.user.photos[0]}} style={styles.chatImage} />
          {item.user.isOnline && <View style={styles.onlineDotChat} />}
          {(item.unreadCount || 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.user.name}</Text>
          <Text style={[
            styles.chatMessage,
            (item.unreadCount || 0) > 0 && styles.chatMessageUnread
          ]}>
            {item.lastMessage ? `You: ${item.lastMessage.text}` : 'Say hi! 👋'}
          </Text>
        </View>
        <View style={styles.chatRight}>
          <Text style={styles.chatTime}>{timeAgo}h ago</Text>
          {!item.lastMessage?.read && item.lastMessage?.senderId !== 'current-user' && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search matches"
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.searchResultText}>
            Found {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''}
          </Text>
        </View>
      )}

      <View style={styles.matchesSection}>
        <Text style={styles.sectionTitle}>Matches ({filteredMatches.length})</Text>
        {filteredMatches.length > 0 ? (
          <FlatList
            horizontal
            data={filteredMatches}
            renderItem={renderMatchItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="heart-dislike" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matches found' : 'No matches yet'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chatsSection}>
        <View style={styles.chatHeader}>
          <Text style={styles.sectionTitle}>Chats ({chatsWithMessages.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
            <Icon name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        {chatsWithMessages.length > 0 ? (
          <FlatList
            data={chatsWithMessages}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No chats found' : 'Start a conversation!'}
            </Text>
          </View>
        )}
      </View>
    </View>
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
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  searchResults: {
    padding: 12,
    backgroundColor: '#E0F7FA',
  },
  searchResultText: {
    fontSize: 14,
    color: '#00838F',
    fontWeight: '600',
  },
  matchesSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  matchesList: {
    paddingHorizontal: 16,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  matchImageContainer: {
    position: 'relative',
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#00BCD4',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  matchName: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  chatsSection: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#E0F7FA',
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  chatImageContainer: {
    position: 'relative',
  },
  chatImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineDotChat: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatMessageUnread: {
    fontWeight: '600',
    color: '#333',
  },
  chatRight: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00BCD4',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default MatchesScreen;