import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '../store/useStore';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const FiltersScreen = () => {
  const navigation = useNavigation();
  const filters = useStore((state) => state.filters);
  const updateFilters = useStore((state) => state.updateFilters);
  const applyFilters = useStore((state) => state.applyFilters);
  const clearFilters = useStore((state) => state.clearFilters);

  const [selectedGender, setSelectedGender] = useState<string[]>(filters.gender);
  const [minAge, setMinAge] = useState(filters.ageRange[0]);
  const [maxAge, setMaxAge] = useState(filters.ageRange[1]);
  const [distance, setDistance] = useState(filters.distance);
  const [showNearby, setShowNearby] = useState(filters.showNearbyWhenEmpty);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(filters.languages);

  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];

  const toggleGender = (gender: string) => {
    if (selectedGender.includes(gender)) {
      const updated = selectedGender.filter(g => g !== gender);
      setSelectedGender(updated);
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleApply = () => {
    if (selectedGender.length === 0) {
      Alert.alert('Select Gender', 'Please select at least one gender preference');
      return;
    }

    if (minAge >= maxAge) {
      Alert.alert('Invalid Age Range', 'Minimum age must be less than maximum age');
      return;
    }

    updateFilters({
      gender: selectedGender,
      ageRange: [minAge, maxAge],
      distance,
      showNearbyWhenEmpty: showNearby,
      languages: selectedLanguages,
    });
    
    applyFilters();
    
    Alert.alert('Filters Applied', 'Your preferences have been saved', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Filters',
      'Are you sure you want to reset all filters to default?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          onPress: () => {
            clearFilters();
            setSelectedGender(['Female']);
            setMinAge(18);
            setMaxAge(80);
            setDistance(50);
            setShowNearby(true);
            setSelectedLanguages([]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is your preferred gender?</Text>

          {['Male', 'Female', 'Nonbinary'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={styles.checkboxRow}
              onPress={() => toggleGender(gender)}>
              <Text style={styles.checkboxLabel}>{gender}</Text>
              <View style={[styles.checkbox, selectedGender.includes(gender) && styles.checkboxChecked]}>
                {selectedGender.includes(gender) && (
                  <Icon name="checkmark" size={20} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age range: {minAge} - {maxAge}</Text>
          
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Min: {minAge}</Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={79}
              step={1}
              value={minAge}
              onValueChange={setMinAge}
              minimumTrackTintColor="#00BCD4"
              maximumTrackTintColor="#E0F7FA"
              thumbTintColor="#00BCD4"
            />
          </View>

          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Max: {maxAge}</Text>
            <Slider
              style={styles.slider}
              minimumValue={19}
              maximumValue={80}
              step={1}
              value={maxAge}
              onValueChange={setMaxAge}
              minimumTrackTintColor="#00BCD4"
              maximumTrackTintColor="#E0F7FA"
              thumbTintColor="#00BCD4"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance: {distance} km</Text>
          <Slider
            style={styles.fullSlider}
            minimumValue={5}
            maximumValue={100}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#00BCD4"
            maximumTrackTintColor="#E0F7FA"
            thumbTintColor="#00BCD4"
          />
          <View style={styles.distanceLabels}>
            <Text style={styles.distanceLabel}>5 km</Text>
            <Text style={styles.distanceLabel}>100 km</Text>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              Show profiles within a 15-km range when run out of matches.
            </Text>
            <Switch
              value={showNearby}
              onValueChange={setShowNearby}
              trackColor={{false: '#ccc', true: '#00BCD4'}}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages:</Text>
          
          <View style={styles.languagesGrid}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageChip,
                  selectedLanguages.includes(lang) && styles.languageChipSelected,
                ]}
                onPress={() => toggleLanguage(lang)}>
                <Text
                  style={[
                    styles.languageChipText,
                    selectedLanguages.includes(lang) && styles.languageChipTextSelected,
                  ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear all</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply filters</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00BCD4',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00BCD4',
  },
  sliderRow: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  fullSlider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  distanceLabel: {
    fontSize: 12,
    color: '#999',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageChipSelected: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  languageChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  languageChipTextSelected: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FiltersScreen;