import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const OnboardingQuiz = ({ onComplete }:any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'What is your primary interest?',
      options: ['Technology', 'Sports', 'Entertainment', 'Education'],
    },
    {
      id: 2,
      question: 'How often do you use mobile apps?',
      options: ['Daily', 'Several times a week', 'Once a week', 'Rarely'],
    },
    {
      id: 3,
      question: 'What is your experience level with React Native?',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    {
      id: 4,
      question: 'What is your preferred learning style?',
      options: ['Videos', 'Articles', 'Interactive', 'Hands-on practice'],
    },
    {
      id: 5,
      question: 'How many hours per week can you dedicate?',
      options: ['Less than 5', '5-10', '10-20', 'More than 20'],
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

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score (simple: correct answer = index 0)
    const calculatedScore = selectedAnswers.filter((ans, idx) => ans === 0).length;
    setScore(calculatedScore);
    setShowResults(true);

    // Optional: Send quiz data to API
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
        <View style={styles.resultsContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.totalText}>of {questions.length}</Text>
          </View>

          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultMessage}>
            {score === questions.length
              ? 'Perfect score! Amazing!'
              : score >= questions.length * 0.7
              ? 'Great job! Keep it up!'
              : 'Good effort! Try again to improve.'}
          </Text>

          <View style={styles.answerSummary}>
            <Text style={styles.summaryTitle}>Your Answers:</Text>
            {questions.map((q, idx) => (
              <View key={q.id} style={styles.summaryItem}>
                <Text style={styles.summaryQuestion}>{q.question}</Text>
                <Text style={styles.summaryAnswer}>
                  {q.options[selectedAnswers[idx]]}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Retake Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
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

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswers[currentQuestion] === index && styles.optionSelected,
                ]}
                onPress={() => handleSelectAnswer(index)}
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
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, currentQuestion === 0 && styles.buttonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
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
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  questionContainer: {
    marginBottom: 40,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  answerSummary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  summaryItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryQuestion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryAnswer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  restartButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  restartButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingQuiz;