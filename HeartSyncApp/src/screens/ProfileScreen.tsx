import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image source={{uri: currentUser.photos[0]}} style={styles.profileImage} />
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>45% complete</Text>
          </View>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {currentUser.name}, {currentUser.age}
          </Text>
          {currentUser.verified && <Icon name="checkmark-circle" size={24} color="#00BCD4" />}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editButtonText}>Edit your profile</Text>
          <Icon name="chevron-forward" size={20} color="#00BCD4" />
        </TouchableOpacity>
      </View>

      <View style={styles.verificationCard}>
        <Icon name="shield-checkmark" size={40} color="#00BCD4" />
        <View style={styles.verificationText}>
          <Text style={styles.verificationTitle}>
            Verification adds an extra layer of authenticity and trust to your profile.
          </Text>
          <Text style={styles.verificationLink}>Verify your account now!</Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#999" />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Safety</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.premiumCard}>
        <View style={styles.premiumHeader}>
          <Icon name="star" size={20} color="#fff" />
          <Text style={styles.premiumTitle}>HeartSync Premium</Text>
          <Icon name="star" size={20} color="#fff" />
        </View>
        <Text style={styles.premiumSubtitle}>
          Unlock exclusive features and supercharge your dating experience.
        </Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('UpgradePremium')}>
          <Text style={styles.upgradeButtonText}>Upgrade from $7.99</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresCard}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>What's included</Text>
          <View style={styles.planTypes}>
            <Text style={styles.planType}>Free</Text>
            <Text style={[styles.planType, styles.premiumPlan]}>Premium</Text>
          </View>
        </View>

        {[
          {name: 'Unlimited swipes', free: true, premium: true},
          {name: 'Advanced filters', free: true, premium: true},
          {name: 'Remove ads', free: false, premium: true},
          {name: 'Undo accidental left swipes', free: false, premium: true},
          {name: 'Push you profile to more viewers', free: false, premium: true},
        ].map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureName}>{feature.name}</Text>
            <View style={styles.featureChecks}>
              <Icon
                name={feature.free ? 'checkmark' : 'close'}
                size={20}
                color={feature.free ? '#00BCD4' : '#ccc'}
              />
              <Icon
                name={feature.premium ? 'checkmark' : 'close'}
                size={20}
                color={feature.premium ? '#00BCD4' : '#ccc'}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00BCD4',
  },
  completionBadge: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    backgroundColor: '#00BCD4',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  completionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    backgroundColor: '#E0F7FA',
    padding: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    gap: 12,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  verificationLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00BCD4',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  premiumCard: {
    backgroundColor: '#00BCD4',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planTypes: {
    flexDirection: 'row',
    gap: 40,
  },
  planType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  premiumPlan: {
    color: '#00BCD4',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  featureName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  featureChecks: {
    flexDirection: 'row',
    gap: 40,
  },
});

export default ProfileScreen;