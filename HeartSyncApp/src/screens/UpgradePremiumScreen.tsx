import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const UpgradePremiumScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('6months');

  const plans = [
    {
      id: '1month',
      duration: '1 Month',
      price: '$19.99',
      perMonth: '$19.99/month',
      savings: null,
      popular: false,
    },
    {
      id: '3months',
      duration: '3 Months',
      price: '$44.99',
      perMonth: '$14.99/month',
      savings: 'Save 25%',
      popular: false,
    },
    {
      id: '6months',
      duration: '6 Months',
      price: '$59.99',
      perMonth: '$9.99/month',
      savings: 'Save 50%',
      popular: true,
    },
    {
      id: '12months',
      duration: '12 Months',
      price: '$95.99',
      perMonth: '$7.99/month',
      savings: 'Save 60%',
      popular: false,
    },
  ];

  const features = [
    {
      icon: 'infinite',
      title: 'Unlimited Swipes',
      description: 'Swipe as much as you want, no daily limits',
    },
    {
      icon: 'funnel',
      title: 'Advanced Filters',
      description: 'Find exactly who you are looking for',
    },
    {
      icon: 'eye-off',
      title: 'Remove Ads',
      description: 'Enjoy distraction-free browsing',
    },
    {
      icon: 'arrow-undo',
      title: 'Undo Swipes',
      description: 'Take back accidental left swipes',
    },
    {
      icon: 'trending-up',
      title: 'Boost Profile',
      description: 'Get 10x more profile views',
    },
    {
      icon: 'eye',
      title: 'See Who Likes You',
      description: 'Match instantly with people who liked you',
    },
    {
      icon: 'star',
      title: '5 Super Likes/Day',
      description: 'Stand out and get 3x more matches',
    },
    {
      icon: 'globe',
      title: 'Passport',
      description: 'Swipe anywhere in the world',
    },
    {
      icon: 'shield-checkmark',
      title: 'Priority Support',
      description: '24/7 customer support',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Icon name="star" size={60} color="#FFD700" />
          </View>
          <Text style={styles.heroTitle}>Unlock All Features</Text>
          <Text style={styles.heroSubtitle}>
            Get the most out of HeartSync and find your perfect match faster
          </Text>
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View style={styles.planLeft}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlan === plan.id && styles.radioButtonSelected,
                    ]}>
                    {selectedPlan === plan.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.planDuration}>{plan.duration}</Text>
                    <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
                  </View>
                </View>
                <View style={styles.planRight}>
                  {plan.savings && (
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  )}
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={24} color="#00BCD4" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.guaranteeSection}>
          <Icon name="shield-checkmark" size={40} color="#4CAF50" />
          <Text style={styles.guaranteeTitle}>7-Day Money Back Guarantee</Text>
          <Text style={styles.guaranteeText}>
            Not satisfied? Get a full refund within 7 days, no questions asked.
          </Text>
        </View>

        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Icon name="people" size={32} color="#00BCD4" />
            <Text style={styles.trustNumber}>2M+</Text>
            <Text style={styles.trustLabel}>Premium Users</Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="heart" size={32} color="#FF6B6B" />
            <Text style={styles.trustNumber}>500K+</Text>
            <Text style={styles.trustLabel}>Matches Daily</Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="star" size={32} color="#FFD700" />
            <Text style={styles.trustNumber}>4.8/5</Text>
            <Text style={styles.trustLabel}>User Rating</Text>
          </View>
        </View>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Subscription automatically renews unless auto-renew is turned off at
          least 24 hours before the end of the current period.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>
            Continue with {plans.find(p => p.id === selectedPlan)?.price}
          </Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Cancel anytime</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  plansSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#eee',
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#00BCD4',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00BCD4',
  },
  planDuration: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planPerMonth: {
    fontSize: 14,
    color: '#666',
  },
  planRight: {
    alignItems: 'flex-end',
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  guaranteeSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  guaranteeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  trustItem: {
    alignItems: 'center',
  },
  trustNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  trustLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  termsText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  upgradeButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#00BCD4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default UpgradePremiumScreen;