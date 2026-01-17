// src/pages/RemediesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  BackHandler,
} from 'react-native';

const RemediesScreen = ({ issue, onBack }: any) => {
  const [activeTab, setActiveTab] = useState<'home' | 'organic' | 'chemical'>('home');
  useEffect(() => {
  const backAction = () => {
    onBack?.();  // ✅ go back inside app
    return true; // ✅ prevent app from closing
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);
  // Sample remedies data
  const remedies = {
    home: [
      {
        id: 1,
        name: 'Neem Oil Spray',
        frequency: 'Every 5 days',
        ingredients: ['Neem oil', 'Water', 'Dish soap'],
        instructions: [
          'Mix 1 tablespoon neem oil with 1 liter of water',
          'Add 2-3 drops of dish soap as emulsifier',
          'Shake well before each use',
          'Spray on affected leaves (top and bottom surfaces)',
          'Apply in early morning or evening',
          'Avoid spraying during peak sunlight',
        ],
        safetyTips: [
          'Wear gloves while handling',
          'Test on a small leaf area first',
          'Not safe for pets - keep away from animals',
          'Avoid contact with eyes and skin',
        ],
        effectiveness: 'High',
        timeToResult: '7-10 days',
      },
      {
        id: 2,
        name: 'Baking Soda Mix',
        frequency: 'Once a week',
        ingredients: ['Baking soda', 'Water', 'Oil', 'Dish soap'],
        instructions: [
          'Mix 1 tablespoon baking soda in 1 liter water',
          'Add 1 tablespoon vegetable oil',
          'Add 1 teaspoon dish soap',
          'Spray on all affected plant parts',
          'Repeat weekly for best results',
        ],
        safetyTips: [
          'Safe for pets and humans',
          'May affect soil pH with excessive use',
          'Test on sensitive plants first',
          'Avoid spraying flowers directly',
        ],
        effectiveness: 'Medium',
        timeToResult: '10-14 days',
      },
      {
        id: 3,
        name: 'Soap Water Solution',
        frequency: 'Every 3-4 days',
        ingredients: ['Insecticidal soap', 'Water'],
        instructions: [
          'Dissolve 2 tablespoons insecticidal soap in 1 liter water',
          'Mix thoroughly',
          'Spray directly on affected areas',
          'Ensure leaf coverage on both sides',
          'Repeat every 3-4 days as needed',
        ],
        safetyTips: [
          'Keep away from beneficial insects',
          'Do not use during flowering',
          'Safe for most plants',
          'Rinse plant after 1-2 hours if heavily applied',
        ],
        effectiveness: 'Medium-High',
        timeToResult: '5-7 days',
      },
    ],
    organic: [
      {
        id: 4,
        name: 'Garlic Extract Spray',
        frequency: 'Every 7 days',
        ingredients: ['Garlic cloves', 'Water', 'Chili peppers'],
        instructions: [
          'Blend 5-6 garlic cloves with 1 liter water',
          'Strain through fine mesh',
          'Add 2 crushed chili peppers (optional)',
          'Let mixture sit for 24 hours',
          'Spray on plant daily for 3-4 days',
        ],
        safetyTips: [
          'Natural and organic',
          'Safe for pets and humans',
          'May have strong odor',
          'Test on small area first',
        ],
        effectiveness: 'Medium',
        timeToResult: '10-14 days',
      },
      {
        id: 5,
        name: 'Milk Solution',
        frequency: 'Weekly',
        ingredients: ['Milk (any type)', 'Water'],
        instructions: [
          'Mix 1 part milk with 9 parts water',
          'Spray on plant leaves evenly',
          'Apply in morning for best results',
          'Repeat weekly',
        ],
        safetyTips: [
          'Completely safe and non-toxic',
          'Good for powdery mildew',
          'May attract ants - use caution',
          'Works best in warm weather',
        ],
        effectiveness: 'Medium',
        timeToResult: '7-10 days',
      },
      {
        id: 6,
        name: 'Compost Tea',
        frequency: 'Every 10 days',
        ingredients: ['Compost', 'Water', 'Aeration pump (optional)'],
        instructions: [
          'Fill bucket with water',
          'Add 1-2 cups quality compost',
          'Let steep for 24-48 hours',
          'Strain through cloth',
          'Spray on leaves and soil',
        ],
        safetyTips: [
          'Boosts immunity naturally',
          'Safe for all plants and animals',
          'Use fresh compost only',
          'Do not store - use immediately',
        ],
        effectiveness: 'High',
        timeToResult: '14-21 days',
      },
    ],
    chemical: [
      {
        id: 7,
        name: 'Premium Chemical Fungicide',
        frequency: 'Every 7 days',
        ingredients: ['Chemical compound', 'Water'],
        instructions: [
          'Follow manufacturer instructions carefully',
          'Dilute according to label',
          'Apply in dry conditions',
          'Avoid contact with skin',
          'Reapply after rain',
        ],
        safetyTips: [
          '⚠️ Requires careful handling',
          'Keep away from children and pets',
          'Wear protective equipment',
          'Read all warnings on label',
          'Follow local regulations',
        ],
        effectiveness: 'Very High',
        timeToResult: '3-5 days',
        isPremium: true,
      },
    ],
  };

  const tabData = remedies[activeTab];

  const renderRemedyCard = ({ item }: any) => (
    <View style={styles.remedyCard}>
      {item.isPremium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>⭐ Premium</Text>
        </View>
      )}

      {/* Remedy Title */}
      <View style={styles.remedyHeader}>
        <View>
          <Text style={styles.remedyName}>{item.name}</Text>
          <Text style={styles.remedyFrequency}>🔄 {item.frequency}</Text>
        </View>
        <View style={styles.effectivenessTag}>
          <Text style={styles.effectivenessText}>{item.effectiveness}</Text>
        </View>
      </View>

      {/* Quick Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Time to Result</Text>
          <Text style={styles.infoValue}>{item.timeToResult}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Difficulty</Text>
          <Text style={styles.infoValue}>Easy</Text>
        </View>
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Ingredients</Text>
        <View style={styles.ingredientsList}>
          {item.ingredients.map((ingredient: string, idx: number) => (
            <View key={idx} style={styles.ingredientItem}>
              <Text style={styles.ingredientBullet}>✓</Text>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👉 Step-by-Step Instructions</Text>
        <View style={styles.instructionsList}>
          {item.instructions.map((instruction: string, idx: number) => (
            <View key={idx} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Safety Tips</Text>
        <View style={styles.safetyList}>
          {item.safetyTips.map((tip: string, idx: number) => (
            <View key={idx} style={styles.safetyItem}>
              <Text style={styles.safetyDot}>•</Text>
              <Text style={styles.safetyText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Start This Remedy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remedies</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Issue Info */}
      <View style={styles.issueInfo}>
        <Text style={styles.issueTitle}>🦠 {issue?.name || 'Plant Issue'}</Text>
        <Text style={styles.issueDescription}>
          {issue?.description || 'Select a remedy to treat your plant'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'home' && styles.tabActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
            🏠 Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'organic' && styles.tabActive]}
          onPress={() => setActiveTab('organic')}
        >
          <Text style={[styles.tabText, activeTab === 'organic' && styles.tabTextActive]}>
            🌱 Organic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, styles.tabLocked]}
          disabled={true}
        >
          <Text style={styles.tabTextLocked}>🔒 Chemical</Text>
        </TouchableOpacity>
      </View>

      {/* Remedies List */}
      <FlatList
        data={tabData}
        renderItem={renderRemedyCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  issueInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  issueDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabLocked: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextLocked: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  remedyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  premiumText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '700',
  },
  remedyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  remedyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  remedyFrequency: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  effectivenessTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  effectivenessText: {
    color: '#34C759',
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ingredientBullet: {
    color: '#34C759',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ingredientText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
    paddingTop: 2,
  },
  safetyList: {
    gap: 8,
  },
  safetyItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  safetyDot: {
    color: '#FF9500',
    fontWeight: 'bold',
    fontSize: 16,
  },
  safetyText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
    paddingTop: 2,
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RemediesScreen;