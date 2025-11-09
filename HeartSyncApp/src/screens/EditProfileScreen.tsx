import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useStore((state) => state.currentUser);
  const updateCurrentUser = useStore((state) => state.updateCurrentUser);
  const saveProfile = useStore((state) => state.saveProfile);
  const hasUnsavedChanges = useStore((state) => state.hasUnsavedChanges);
  const setUnsavedChanges = useStore((state) => state.setUnsavedChanges);
  
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [photos, setPhotos] = useState<string[]>(currentUser?.photos || []);

  const handleAddPhoto = (index: number) => {
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate camera pick
            const newPhoto = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg`;
            const newPhotos = [...photos];
            if (index < newPhotos.length) {
              newPhotos[index] = newPhoto;
            } else {
              newPhotos.push(newPhoto);
            }
            setPhotos(newPhotos);
            updateCurrentUser({photos: newPhotos});
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate gallery pick
            const newPhoto = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg`;
            const newPhotos = [...photos];
            if (index < newPhotos.length) {
              newPhotos[index] = newPhoto;
            } else {
              newPhotos.push(newPhoto);
            }
            setPhotos(newPhotos);
            updateCurrentUser({photos: newPhotos});
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const handleDeletePhoto = (index: number) => {
    if (index === 0) {
      Alert.alert('Error', 'Cannot delete main photo');
      return;
    }
    
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            setPhotos(newPhotos);
            updateCurrentUser({photos: newPhotos});
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Set up back button handler
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          {text: "Don't leave", style: 'cancel', onPress: () => {}},
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setUnsavedChanges(false);
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, setUnsavedChanges]);

  const handleBioChange = (text: string) => {
    setBio(text);
    updateCurrentUser({bio: text});
  };

  const handleOccupationChange = (text: string) => {
    setOccupation(text);
    updateCurrentUser({occupation: text});
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      updateCurrentUser({interests: updatedInterests});
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter(i => i !== interest);
    setInterests(updatedInterests);
    updateCurrentUser({interests: updatedInterests});
  };

  const handleSave = () => {
    saveProfile();
    Alert.alert('Success', 'Your profile has been updated!', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const handleOpenSettings = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Please save or discard your changes first.',
        [{text: 'OK'}]
      );
    } else {
      navigation.navigate('Settings');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleOpenSettings}>
          <Icon name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Profile completion: 45%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: '45%'}]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSubtitle}>
            The main photo is how you appear to others on the swipe view.
          </Text>

          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{uri: photo}} style={index === 0 ? styles.mainPhoto : styles.photo} />
                <TouchableOpacity 
                  style={styles.editPhotoButton}
                  onPress={() => handleAddPhoto(index)}>
                  <Icon name="camera" size={16} color="#fff" />
                </TouchableOpacity>
                {index > 0 && (
                  <TouchableOpacity 
                    style={styles.deletePhotoButton}
                    onPress={() => handleDeletePhoto(index)}>
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
                {index === 0 && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>Main</Text>
                  </View>
                )}
              </View>
            ))}

            {photos.length < 6 && (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={() => handleAddPhoto(photos.length)}>
                <Icon name="add" size={32} color="#999" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About me</Text>
          <Text style={styles.sectionSubtitle}>
            Share a few words about yourself, your interests, and what you're looking for.
          </Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={handleBioChange}
            multiline
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <Text style={styles.charCount}>{bio.length}/500</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Occupation</Text>
          <TextInput
            style={styles.textInput}
            value={occupation}
            onChangeText={handleOccupationChange}
            placeholder="What do you do?"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I enjoy</Text>
          <Text style={styles.sectionSubtitle}>
            Add your interests to find like-minded connections.
          </Text>

          <View style={styles.addInterestContainer}>
            <TextInput
              style={styles.addInterestInput}
              value={newInterest}
              onChangeText={setNewInterest}
              placeholder="Type an interest..."
              onSubmitEditing={handleAddInterest}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddInterest}>
              <Icon name="add-circle" size={32} color="#00BCD4" />
            </TouchableOpacity>
          </View>

          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
                <TouchableOpacity onPress={() => handleRemoveInterest(interest)}>
                  <Icon name="close" size={16} color="#00BCD4" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {hasUnsavedChanges && (
        <View style={styles.saveBar}>
          <View style={styles.saveBarContent}>
            <Icon name="warning" size={20} color="#FF9800" />
            <Text style={styles.saveBarText}>You have unsaved changes</Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressLabel: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0F7FA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BCD4',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  mainPhoto: {
    width: 160,
    height: 200,
    borderRadius: 12,
  },
  photo: {
    width: 100,
    height: 130,
    borderRadius: 12,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00BCD4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainPhotoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: 100,
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  bioInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
  },
  addInterestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  addInterestInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#00BCD4',
  },
  saveBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  saveBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBarText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;