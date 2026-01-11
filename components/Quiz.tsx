import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

const OnboardingQuiz = ({ onComplete }: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = new Animated.Value(1);

  const questions = [
    {
      id: 1,
      question: 'How would you describe your plant care experience?',
      options: ['Complete Beginner', 'Some Experience', 'Green Thumb', 'Expert Gardener'],
    },
    {
      id: 2,
      question: 'How much time can you dedicate to plant care daily?',
      options: ['Less than 5 minutes', '5-15 minutes', '15-30 minutes', 'More than 30 minutes'],
    },
    {
      id: 3,
      question: 'What type of space do you have for plants?',
      options: ['Small Indoor Space', 'Large Indoor Space', 'Balcony/Patio', 'Garden/Outdoor'],
    },
    {
      id: 4,
      question: 'What is your main goal with plants?',
      options: ['Decoration', 'Fresh Herbs/Vegetables', 'Air Purification', 'Relaxation/Hobby'],
    },
    {
      id: 5,
      question: 'How much natural light is available?',
      options: ['Low Light', 'Moderate Light', 'Bright Indirect', 'Direct Sunlight'],
    },
  ];

  const handleSelectAnswer = (index: any) => {
    const newAnswers: any = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === undefined) {
      Alert.alert('Please select an answer', 'Choose one option before proceeding.');
      return;
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const calculatedScore = selectedAnswers.filter((ans, idx) => ans === 0).length;
    setScore(calculatedScore);
    setShowResults(true);

    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          score: calculatedScore,
          totalQuestions: questions.length,
        }),
      });
      console.log('Quiz data submitted');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete({ score, totalQuestions: questions.length });
    } else {
      Alert.alert('Quiz Complete', `You scored ${score}/${questions.length}`);
    }
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsScrollContent}>
          {/* Decorative circles */}
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />

          <View style={styles.resultsContainer}>
            {/* Score Circle with Plant Icon */}
            <View style={styles.scoreCircle}>
              <View style={styles.plantIconSmall}>
                <View style={styles.leafSmall1} />
                <View style={styles.leafSmall2} />
                <View style={styles.stemSmall} />
              </View>
              <Text style={styles.scoreText}>{score}</Text>
              <Text style={styles.totalText}>of {questions.length}</Text>
            </View>

            <Text style={styles.resultTitle}>Profile Complete!</Text>
            <Text style={styles.resultMessage}>
              {score === questions.length
                ? 'You\'re a plant expert! 🌿'
                : score >= questions.length * 0.7
                ? 'Great profile! Ready to grow! 🌱'
                : 'Welcome to your plant journey! 🌾'}
            </Text>

            {/* Answer Summary Card */}
            <View style={styles.answerSummary}>
              <Text style={styles.summaryTitle}>Your Plant Profile:</Text>
              {questions.map((q, idx) => (
                <View key={q.id} style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <View style={styles.summaryIcon} />
                  </View>
                  <View style={styles.summaryTextContainer}>
                    <Text style={styles.summaryQuestion}>{q.question}</Text>
                    <Text style={styles.summaryAnswer}>
                      {q.options[selectedAnswers[idx]]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <Text style={styles.restartButtonText}>Retake Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>Start Growing</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Progress */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Build Your Plant Profile</Text>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Question Card */}
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          <View style={styles.questionIconContainer}>
            <View style={styles.questionIcon}>
              <View style={styles.leafIcon} />
            </View>
          </View>

          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswers[currentQuestion] === index && styles.optionSelected,
                ]}
                onPress={() => handleSelectAnswer(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedAnswers[currentQuestion] === index &&
                      styles.radioButtonSelected,
                  ]}
                >
                  {selectedAnswers[currentQuestion] === index && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswers[currentQuestion] === index && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.previousButton,
              currentQuestion === 0 && styles.buttonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10B981',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 80,
    height: 80,
    top: 50,
    right: 20,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 200,
    left: 30,
  },
  circle3: {
    width: 50,
    height: 50,
    bottom: 150,
    right: 40,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  resultsScrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  questionIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    width: 20,
    height: 26,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 25,
    lineHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#10B981',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    backgroundColor: '#fff',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  previousButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingVertical: 40,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  plantIconSmall: {
    position: 'absolute',
    top: 20,
    width: 30,
    height: 30,
  },
  leafSmall1: {
    width: 12,
    height: 16,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotate: '-25deg' }],
  },
  leafSmall2: {
    width: 12,
    height: 16,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 3,
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ rotate: '25deg' }],
  },
  stemSmall: {
    width: 3,
    height: 18,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 0,
    left: 13,
    borderRadius: 1.5,
  },
  scoreText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 10,
  },
  totalText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
  resultTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  answerSummary: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  summaryIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  summaryIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryQuestion: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  summaryAnswer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  restartButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  finishButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingQuiz;