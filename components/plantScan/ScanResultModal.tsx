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
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ScanResultModal = ({ result, onComplete, onRetry }: any) => {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const getHealthGradient = (score: number) => {
    if (score >= 80) return ['#34C759', '#2DB04C'];
    if (score >= 60) return ['#FF9500', '#E08500'];
    return ['#FF3B30', '#E0342A'];
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

  const getHealthEmoji = (score: number) => {
    if (score >= 80) return '🌿';
    if (score >= 60) return '🌱';
    return '🥀';
  };

  const healthColor = getHealthColor(result.healthScore);
  const healthStatus = getHealthStatus(result.healthScore);
  const healthGradient = getHealthGradient(result.healthScore);

  return (
<SafeAreaView style={styles.container}>
  <View style={styles.plantBackground}>
    <View style={styles.leafOne} />
    <View style={styles.leafTwo} />
    <View style={styles.leafThree} />
    <View style={styles.glowTop} />
    <View style={styles.glowBottom} />

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#7FCC9A', '#5BB885']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onComplete}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Plant Analysis</Text>
            <Text style={styles.headerSubtitle}>Complete Results</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>

        {/* Plant Image with Overlay */}
        {result.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: result.image }}
              style={styles.plantImage}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
              style={styles.imageOverlay}
            />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>📸 Scanned Plant</Text>
            </View>
          </View>
        )}

        {/* Health Score Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={healthGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scoreCard}
          >
            <View style={styles.scoreCardContent}>
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreEmoji}>{getHealthEmoji(result.healthScore)}</Text>
                <View>
                  <Text style={styles.scoreStatus}>{healthStatus}</Text>
                  <Text style={styles.scoreSubtext}>Overall Health</Text>
                </View>
              </View>
              
              <View style={styles.scoreRight}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreValue}>{result.healthScore}</Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${result.healthScore}%` },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.healthMessage}>
              {result.healthScore >= 80
                ? '🎉 Excellent! Your plant is thriving beautifully.'
                : result.healthScore >= 60
                ? '💡 Needs attention. Check recommendations below.'
                : '🚨 Urgent care needed. Follow remedies immediately.'}
            </Text>
          </LinearGradient>
        </View>

        {/* Plant Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionIcon}>🌿</Text>
              <Text style={styles.sectionTitle}>Plant Information</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconBox}>
                  <Text style={styles.infoIcon}>🏷️</Text>
                </View>
                <Text style={styles.infoLabel}>Plant Name</Text>
                <Text style={styles.infoValue}>{result.plantName}</Text>
              </View>

              {result.plantType && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconBox}>
                    <Text style={styles.infoIcon}>🌱</Text>
                  </View>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>{result.plantType}</Text>
                </View>
              )}
            </View>

            {result.growthStage && (
              <View style={styles.growthStageContainer}>
                <Text style={styles.growthStageLabel}>Growth Stage</Text>
                <View style={styles.growthStageBadge}>
                  <Text style={styles.growthStageText}>{result.growthStage}</Text>
                </View>
              </View>
            )}

            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Identification Confidence</Text>
              <View style={styles.confidenceBar}>
                <LinearGradient
                  colors={['#7FCC9A', '#5BB885']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.confidenceFill, { width: '92%' }]}
                />
              </View>
              <Text style={styles.confidenceValue}>92% Confident</Text>
            </View>
          </View>
        </View>

        {/* Issues Section */}
        {result.issues && result.issues.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionIcon}>🔍</Text>
                <Text style={styles.sectionTitle}>Detected Issues</Text>
              </View>
              <View style={styles.issueBadge}>
                <Text style={styles.issueBadgeText}>{result.issues.length}</Text>
              </View>
            </View>

            <View style={styles.issuesContainer}>
              {result.issues.map((issue: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.issueCard}
                  onPress={() =>
                    setExpandedIssue(expandedIssue === index ? null : index)
                  }
                  activeOpacity={0.7}
                >
                  {/* Issue Header */}
                  <View style={styles.issueHeader}>
                    <View style={styles.issueLeft}>
                      <View
                        style={[
                          styles.severityIndicator,
                          {
                            backgroundColor:
                              issue.severity === 'high'
                                ? '#FF3B30'
                                : issue.severity === 'medium'
                                ? '#FF9500'
                                : '#34C759',
                          },
                        ]}
                      >
                        <Text style={styles.severityIcon}>
                          {issue.severity === 'high' ? '🚨' : issue.severity === 'medium' ? '⚠️' : '💡'}
                        </Text>
                      </View>
                      <View style={styles.issueInfo}>
                        <Text style={styles.issueName}>{issue.name}</Text>
                        <View style={styles.issueMetaRow}>
                          <View
                            style={[
                              styles.severityTag,
                              {
                                backgroundColor:
                                  issue.severity === 'high'
                                    ? '#FFE5E5'
                                    : issue.severity === 'medium'
                                    ? '#FFF3E0'
                                    : '#E8F5E9',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.severityTagText,
                                {
                                  color:
                                    issue.severity === 'high'
                                      ? '#FF3B30'
                                      : issue.severity === 'medium'
                                      ? '#FF9500'
                                      : '#34C759',
                                },
                              ]}
                            >
                              {issue.severity.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.expandButton}>
                      <Text style={styles.expandIcon}>
                        {expandedIssue === index ? '−' : '+'}
                      </Text>
                    </View>
                  </View>

                  {/* Issue Details (Expandable) */}
                  {expandedIssue === index && (
                    <View style={styles.issueDetails}>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailsLabel}>📋 Symptoms</Text>
                        <Text style={styles.detailsText}>{issue.description}</Text>
                      </View>

                      {issue.possibleCauses && issue.possibleCauses.length > 0 && (
                        <View style={styles.detailSection}>
                          <Text style={styles.detailsLabel}>🔎 Possible Causes</Text>
                          {issue.possibleCauses.map((cause: string, i: number) => (
                            <View key={i} style={styles.causeItem}>
                              <View style={styles.causeDot} />
                              <Text style={styles.causeText}>{cause}</Text>
                            </View>
                          ))}
                        </View>
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
              <View style={styles.noIssuesIconContainer}>
                <Text style={styles.noIssuesIcon}>✓</Text>
              </View>
              <Text style={styles.noIssuesTitle}>No Issues Detected</Text>
              <Text style={styles.noIssuesText}>
                Your plant looks healthy and vibrant! Continue with regular care and monitoring.
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonIcon}>📸</Text>
            <Text style={styles.secondaryButtonText}>Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButtonWrapper} 
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#7FCC9A', '#5BB885']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonIcon}>💡</Text>
              <Text style={styles.primaryButtonText}>View Care Tips</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1FAE5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    position: 'relative',
  },
  plantImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageLabelText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  heroSection: {
    paddingHorizontal: 20,
    marginTop: -40,
    marginBottom: 20,
  },
  scoreCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreEmoji: {
    fontSize: 48,
  },
  scoreStatus: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  scoreSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  scoreRight: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  healthMessage: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    letterSpacing: -0.5,
  },
  issueBadge: {
    backgroundColor: '#FF3B30',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 28,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
  growthStageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 16,
  },
  growthStageLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  growthStageBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  growthStageText: {
    color: '#34C759',
    fontSize: 13,
    fontWeight: '700',
  },
  confidenceContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confidenceLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 13,
    color: '#5BB885',
    fontWeight: '700',
    textAlign: 'right',
  },
  issuesContainer: {
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  severityIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityIcon: {
    fontSize: 24,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  issueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 20,
    color: '#5BB885',
    fontWeight: '700',
  },
  issueDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  causeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  causeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5BB885',
    marginTop: 8,
  },
  causeText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  noIssuesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  noIssuesIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noIssuesIcon: {
    fontSize: 40,
    color: '#34C759',
  },
  noIssuesTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#34C759',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  noIssuesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#5BB885',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  secondaryButtonIcon: {
    fontSize: 18,
  },
  secondaryButtonText: {
    color: '#5BB885',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  primaryButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  primaryButtonIcon: {
    fontSize: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  plantBackground: {
  flex: 1,
  backgroundColor: '#D1FAE5',
  position: 'relative',
},

glowTop: {
  position: 'absolute',
  top: -120,
  left: -80,
  width: 320,
  height: 320,
  backgroundColor: '#6EE7B7',
  borderRadius: 200,
  opacity: 0.6,
},

glowBottom: {
  position: 'absolute',
  bottom: -140,
  right: -100,
  width: 320,
  height: 320,
  backgroundColor: '#34D399',
  borderRadius: 220,
  opacity: 0.45,
},

leafOne: {
  position: 'absolute',
  top: 120,
  left: -40,
  width: 160,
  height: 280,
  backgroundColor: '#A7F3D0',
  borderTopLeftRadius: 120,
  borderTopRightRadius: 20,
  borderBottomLeftRadius: 80,
  borderBottomRightRadius: 140,
  opacity: 0.3,
  transform: [{ rotate: '-20deg' }],
},

leafTwo: {
  position: 'absolute',
  top: 360,
  right: -60,
  width: 200,
  height: 300,
  backgroundColor: '#6EE7B7',
  borderTopLeftRadius: 140,
  borderTopRightRadius: 60,
  borderBottomLeftRadius: 120,
  borderBottomRightRadius: 180,
  opacity: 0.25,
  transform: [{ rotate: '18deg' }],
},

leafThree: {
  position: 'absolute',
  bottom: -60,
  left: 40,
  width: 240,
  height: 200,
  backgroundColor: '#34D399',
  borderTopLeftRadius: 160,
  borderTopRightRadius: 120,
  borderBottomLeftRadius: 180,
  borderBottomRightRadius: 80,
  opacity: 0.2,
  transform: [{ rotate: '-10deg' }],
},

});

export default ScanResultModal;