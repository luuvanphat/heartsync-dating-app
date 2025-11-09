import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, RefreshControl, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, User} from '../types';
import SwipeCard from '../components/SwipeCard';
import MatchModal from '../components/MatchModal';
import DrawerMenu from '../components/DrawerMenu';

const {width} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SwipeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {users, swipeLeft, swipeRight, getNextUser, matches, applyFilters} = useStore();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = getNextUser();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - reload filters
    await new Promise(resolve => setTimeout(resolve, 1000));
    applyFilters();
    setRefreshing(false);
  };

  const handleSwipeLeft = () => {
    if (currentUser) {
      swipeLeft(currentUser.id);
    }
  };

  const handleSwipeRight = () => {
    if (currentUser) {
      const isMatch = Math.random() > 0.3;
      swipeRight(currentUser.id);
      
      if (isMatch) {
        setMatchedUser(currentUser);
        setShowMatchModal(true);
      }
    }
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    const match = matches.find(m => m.user.id === matchedUser?.id);
    if (match) {
      navigation.navigate('ChatDetail', {matchId: match.id});
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>
            <Icon name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HeartSync</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
            <Icon name="options" size={28} color="#00BCD4" />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyContainer}>
          <Icon name="heart-dislike" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No more profiles</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters to see more people!
          </Text>
          <TouchableOpacity 
            style={styles.adjustFiltersButton}
            onPress={() => navigation.navigate('Filters')}>
            <Icon name="options-outline" size={20} color="#fff" />
            <Text style={styles.adjustFiltersText}>Adjust Filters</Text>
          </TouchableOpacity>
        </View>

        <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HeartSync</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
          <Icon name="options" size={28} color="#00BCD4" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00BCD4']}
            tintColor="#00BCD4"
            title="Finding new people..."
            titleColor="#00BCD4"
          />
        }>
        <View style={styles.cardContainer}>
          <SwipeCard
            user={currentUser}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handleSwipeLeft}>
          <Icon name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]}>
          <Icon name="star" size={28} color="#00BCD4" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleSwipeRight}>
          <Icon name="heart" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <MatchModal
        visible={showMatchModal}
        user={matchedUser}
        onClose={() => setShowMatchModal(false)}
        onSendMessage={handleSendMessage}
      />

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  superLikeButton: {},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  adjustFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    gap: 8,
  },
  adjustFiltersText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SwipeScreen;