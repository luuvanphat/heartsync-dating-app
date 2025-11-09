import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<Props> = ({visible, onClose}) => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useStore((state) => state.currentUser);
  const matches = useStore((state) => state.matches);
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigate = (screen: string) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.drawer,
            {transform: [{translateX: slideAnim}]}
          ]}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Image 
                source={{uri: currentUser?.photos[0]}} 
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser?.name}</Text>
                <Text style={styles.userEmail}>{currentUser?.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menu}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                onClose();
                // Already on Main tabs, just close drawer
              }}>
              <Icon name="person-outline" size={24} color="#333" />
              <Text style={styles.menuText}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleNavigate('EditProfile')}>
              <Icon name="create-outline" size={24} color="#333" />
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                onClose();
                // Already on Main tabs, just close drawer
              }}>
              <Icon name="heart-outline" size={24} color="#333" />
              <Text style={styles.menuText}>My Matches</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{matches.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleNavigate('Filters')}>
              <Icon name="options-outline" size={24} color="#333" />
              <Text style={styles.menuText}>Discovery Settings</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleNavigate('UpgradePremium')}>
              <Icon name="star-outline" size={24} color="#FFD700" />
              <Text style={[styles.menuText, styles.premiumText]}>Upgrade to Premium</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleNavigate('Settings')}>
              <Icon name="settings-outline" size={24} color="#333" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.menuText}>Help & Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: 300,
    backgroundColor: '#fff',
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: '#00BCD4',
    padding: 20,
    paddingTop: 50,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  menu: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
});

export default DrawerMenu;