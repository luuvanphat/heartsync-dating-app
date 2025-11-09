import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useStore} from '../store/useStore';

const {width, height} = Dimensions.get('window');

const ProfileDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {userId} = route.params as {userId: string};
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const users = useStore((state) => state.users);
  const user = users.find((u) => u.id === userId);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: user.photos[currentPhotoIndex]}}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-down" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreButton}>
            <Icon name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>

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
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            {user.verified && <Icon name="checkmark-circle" size={28} color="#00BCD4" />}
          </View>

          {user.pronouns && (
            <View style={styles.pronounsTag}>
              <Text style={styles.pronounsText}>{user.pronouns}</Text>
            </View>
          )}

          <View style={styles.jobRow}>
            <Icon name="briefcase" size={18} color="#666" />
            <Text style={styles.jobText}>{user.occupation}</Text>
          </View>

          <View style={styles.locationRow}>
            <Icon name="location" size={18} color="#666" />
            <Text style={styles.locationText}>
              {user.distance} kilometers away
            </Text>
          </View>
          <Text style={styles.locationDetail}>{user.location}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About me</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My details</Text>
            <View style={styles.detailsGrid}>
              {user.details.height && (
                <View style={styles.detailItem}>
                  <Icon name="heart" size={16} color="#00BCD4" />
                  <Text style={styles.detailText}>{user.details.height}</Text>
                </View>
              )}
              {user.details.smoking && (
                <View style={styles.detailItem}>
                  <Icon name="close-circle" size={16} color="#00BCD4" />
                  <Text style={styles.detailText}>{user.details.smoking}</Text>
                </View>
              )}
              {user.details.drinking && (
                <View style={styles.detailItem}>
                  <Icon name="beer" size={16} color="#00BCD4" />
                  <Text style={styles.detailText}>{user.details.drinking}</Text>
                </View>
              )}
              {user.details.education && (
                <View style={styles.detailItem}>
                  <Icon name="school" size={16} color="#00BCD4" />
                  <Text style={styles.detailText}>{user.details.education}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I enjoy</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I communicate in</Text>
            <View style={styles.languagesContainer}>
              {user.languages.map((language, index) => (
                <View key={index} style={styles.languageTag}>
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.photosGrid}>
            {user.photos.slice(1).map((photo, index) => (
              <Image
                key={index}
                source={{uri: photo}}
                style={styles.gridPhoto}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.reportButton}>
          <Icon name="close" size={24} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeButton}>
          <Icon name="checkmark" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.reportLink}>
        <Text style={styles.reportText}>Hide and Report Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.6,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndicators: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  pronounsTag: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pronounsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobText: {
    fontSize: 16,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  locationDetail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  interestText: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '500',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 14,
    color: '#666',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  gridPhoto: {
    width: (width - 56) / 3,
    height: (width - 56) / 3,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reportButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  reportLink: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  reportText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
});

export default ProfileDetailScreen;