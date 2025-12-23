// src/components/plantScan/ScanResultModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

const ScanResultModal = ({ result, onComplete, onRetry }: any) => {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#ff3b30';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Stressed';
    return 'Diseased';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return '✓';
    if (score >= 60) return '⚠️';
    return '🦠';
  };

  const healthColor = getHealthColor(result.healthScore);
  const healthStatus = getHealthStatus(result.healthScore);

  console.log(result.image)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Close Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onComplete}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Analysis</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Plant Image */}
        {result.image && (
          <Image
            source={{ uri: result.image }}
            style={styles.plantImage}
          />
        )}

        {/* 🌿 Plant Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌿</Text>
            <Text style={styles.sectionTitle}>Plant Info</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plant Name</Text>
              <Text style={styles.infoValue}>{result.plantName}</Text>
            </View>

            {result.plantType && (
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{result.plantType}</Text>
              </View>
            )}

            {result.growthStage && (
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>Growth Stage</Text>
                <Text style={styles.infoValue}>{result.growthStage}</Text>
              </View>
            )}

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Confidence</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>92%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ❤️ Health Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>❤️</Text>
            <Text style={styles.sectionTitle}>Health Status</Text>
          </View>

          <View style={[styles.healthCard, { borderLeftColor: healthColor }]}>
            <View style={styles.healthTop}>
              <View style={styles.healthBadge}>
                <Text style={styles.healthBadgeIcon}>{getHealthIcon(result.healthScore)}</Text>
                <Text style={[styles.healthBadgeText, { color: healthColor }]}>
                  {healthStatus}
                </Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{result.healthScore}</Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
            </View>

            {/* Health Score Bar */}
            <View style={styles.scoreBarContainer}>
              <View
                style={[
                  styles.scoreBar,
                  {
                    width: `${result.healthScore}%`,
                    backgroundColor: healthColor,
                  },
                ]}
              />
            </View>

            <Text style={styles.healthMessage}>
              {result.healthScore >= 80
                ? 'Your plant is thriving! Keep up the good care.'
                : result.healthScore >= 60
                ? 'Your plant needs attention. Review recommendations below.'
                : 'Your plant needs urgent care. Follow the remedies provided.'}
            </Text>
          </View>
        </View>

        {/* 🦠 Issue Details Section */}
        {result.issues && result.issues.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🦠</Text>
              <Text style={styles.sectionTitle}>Issue Details</Text>
            </View>

            <View style={styles.issuesContainer}>
              {result.issues.map((issue: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.issueCard}
                  onPress={() =>
                    setExpandedIssue(expandedIssue === index ? null : index)
                  }
                >
                  {/* Issue Header */}
                  <View style={styles.issueHeader}>
                    <View style={styles.issueLeft}>
                      <View
                        style={[
                          styles.severityBadge,
                          {
                            backgroundColor:
                              issue.severity === 'high'
                                ? '#ff3b30'
                                : issue.severity === 'medium'
                                ? '#FF9500'
                                : '#34C759',
                          },
                        ]}
                      >
                        <Text style={styles.severityText}>
                          {issue.severity.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.issueName}>{issue.name}</Text>
                        <Text style={styles.issueType}>
                          {issue.severity} severity
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.expandIcon}>
                      {expandedIssue === index ? '−' : '+'}
                    </Text>
                  </View>

                  {/* Issue Details (Expandable) */}
                  {expandedIssue === index && (
                    <View style={styles.issueDetails}>
                      <Text style={styles.detailsLabel}>Symptoms</Text>
                      <Text style={styles.detailsText}>{issue.description}</Text>

                      {issue.possibleCauses && issue.possibleCauses.length > 0 && (
                        <>
                          <Text style={[styles.detailsLabel, styles.detailsLabelMargin]}>
                            Possible Causes
                          </Text>
                          {issue.possibleCauses.map((cause: string, i: number) => (
                            <View key={i} style={styles.causeItem}>
                              <Text style={styles.causeBullet}>•</Text>
                              <Text style={styles.causeText}>{cause}</Text>
                            </View>
                          ))}
                        </>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.noIssuesCard}>
              <Text style={styles.noIssuesIcon}>✓</Text>
              <Text style={styles.noIssuesTitle}>No Issues Found</Text>
              <Text style={styles.noIssuesText}>
                Your plant looks healthy! Continue with regular care.
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onRetry}>
            <Text style={styles.secondaryButtonText}>Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
            <Text style={styles.primaryButtonText}>View Care Tips</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  plantImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#e0e0e0',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#34C759',
    fontWeight: '700',
    fontSize: 13,
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  healthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthBadgeIcon: {
    fontSize: 20,
  },
  healthBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scoreCircle: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  scoreBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
  healthMessage: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  issuesContainer: {
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  severityBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  issueName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  issueType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  issueDetails: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  detailsLabelMargin: {
    marginTop: 12,
  },
  detailsText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  causeItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  causeBullet: {
    color: '#999',
    fontWeight: 'bold',
  },
  causeText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  noIssuesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  noIssuesIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noIssuesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 8,
  },
  noIssuesText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ScanResultModal;