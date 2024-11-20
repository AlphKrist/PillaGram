import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import { designs } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveQuizScore, addXPToUser } from '../../lib/appwrite'; // Updated for addXPToUser
import { useGlobalContext } from '../../context/GlobalProvider'; // For current user context
import { Link, useRouter } from 'expo-router';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';

const GrambearQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizInProgressModal, setQuizInProgressModal] = useState(false);
  const [score, setScore] = useState(0); // To store the quiz score
  const courseId = 'grambearCourse';
  const lessonId = 'grambearQuiz';
  const startTimeRef = useRef(null);
  const handleContinue = () => {
    router.replace('/grambearCourse/grambearCongrats');
  };
  // Fetch initial learning data and update progress if it's a new lesson
  useFocusEffect(
    React.useCallback(() => {
      // Start time tracking
      startTimeRef.current = Date.now();

      const onBackPress = () => {
        setQuizInProgressModal(true); // Show Modal instead of Alert
        return true; // Prevent default behavior
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      const updateProgressAndTime = async () => {
        if (user?.accountId) {
          const totalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000); // Elapsed time in seconds

          try {
            // Fetch existing learning data
            const data = await fetchLearningData(user.accountId, courseId);

            // Check if this lesson is already completed
            const isNewLesson = !data.completedLessons.includes(lessonId);

            // Calculate time and progress updates
            const newTimeSpent = (data.timeSpent || 0) + totalElapsed;
            const progressIncrement = isNewLesson ? 25 : 0; // Increment by 10% if this is a new lesson
            const newProgress = Math.min((data.progress || 0) + progressIncrement, 100);

            // Update learning data
            await updateLearningData(user.accountId, courseId, totalElapsed, progressIncrement, lessonId);
            console.log(`Updated time: +${totalElapsed}s, Progress: +${progressIncrement}% for lesson: ${lessonId}`);
          } catch (error) {
            console.error('Error updating learning data:', error);
          }
        }
      };

      return () => {
        if (user?.accountId) {
          updateProgressAndTime();
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
      };
    }, [user])
  );
  // Sample questions and options
  const questions = [
    {
      id: 1,
      text: 'Which of the following is the correct simple past form of "go"?',
      options: [
        { id: 1, text: 'Goed', correct: false },
        { id: 2, text: 'Went', correct: true },
        { id: 3, text: 'Gone', correct: false },
        { id: 4, text: 'Go', correct: false },
      ],
    },
    {
      id: 2,
      text: 'The children __________ (play) in the garden when it started to rain.',
      options: [
        { id: 1, text: 'Was playing', correct: false },
        { id: 2, text: 'Were playing', correct: true },
        { id: 3, text: 'Played', correct: false },
        { id: 4, text: 'Is playing', correct: false },
      ],
    },
    {
      id: 3,
      text: "What is the past perfect form of \"eat\"?",
      options: [
        { id: 1, text: 'Eats', correct: false },
        { id: 2, text: 'Ate', correct: false },
        { id: 3, text: 'Eating', correct: false },
        { id: 4, text: 'Had eaten', correct: true },
      ],
    },
    {
      id: 4,
      text: "She __________ (study) for her exams last night.",
      options: [
        { id: 1, text: 'Studied', correct: true },
        { id: 2, text: 'Studies', correct: false },
        { id: 3, text: 'Study', correct: false },
        { id: 4, text: 'Studying', correct: false },
      ],
    },
    {
      id: 5,
      text: "Identify the sentence using the past continuous tense.",
      options: [
        { id: 1, text: 'He walked to the store.', correct: false },
        { id: 2, text: 'They were watching TV when I called.', correct: true },
        { id: 3, text: 'I finished my homework.', correct: false },
        { id: 4, text: 'She has a great time.', correct: false },
      ],
    },
    {
      id: 6,
      text: "Which of the following sentences is in the past perfect tense?",
      options: [
        { id: 1, text: 'They had already left when I arrived.', correct: true },
        { id: 2, text: 'I went to the market.', correct: false },
        { id: 3, text: 'She was reading a book.', correct: false },
        { id: 4, text: 'He plays football every Saturday.', correct: false },
      ],
    },
    {
      id: 7,
      text: "What is the simple past form of \"write\"?",
      options: [
        { id: 1, text: 'Writed', correct: false },
        { id: 2, text: 'Written', correct: false },
        { id: 3, text: 'Wrote', correct: true },
        { id: 4, text: 'Write', correct: false },
      ],
    },
    {
      id: 8,
      text: "After they ____________ (finish) dinner, they went for a walk.",
      options: [
        { id: 1, text: 'Had finished', correct: true },
        { id: 2, text: 'Finishing', correct: false },
        { id: 3, text: 'Finished', correct: false },
        { id: 4, text: 'Has finished', correct: false },
      ],
    },
    {
      id: 9,
      text: "Which verb is in the past tense?",
      options: [
        { id: 1, text: 'Running', correct: false },
        { id: 2, text: 'Ran', correct: true },
        { id: 3, text: 'Runs', correct: false },
        { id: 4, text: 'Run', correct: false },
      ],
    },
    {
      id: 10,
      text: "\"At 5 PM, I _____________ (watch) a movie.\"",
      options: [
        { id: 1, text: 'Was watching', correct: true },
        { id: 2, text: 'Is watching', correct: false },
        { id: 3, text: 'Watched', correct: false },
        { id: 4, text: 'Watching', correct: false },
      ],
    },
    // Add more questions here...
  ];

  // Handle option selection for each question
  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Check if all questions are answered
  const allQuestionsAnswered = Object.keys(selectedOptions).length === questions.length;

  // Handle quiz submission
  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    let quizScore = 0;

    try {
      // Calculate score
      quizScore = questions.reduce((total, question) => {
        const selectedOption = question.options.find((option) => option.id === selectedOptions[question.id]);
        return total + (selectedOption.correct ? 1 : 0);
      }, 0);

      setScore(quizScore); // Update state with score

      // Calculate XP (10 XP per correct answer)
      const xpEarned = quizScore * 10;

      // Save quiz score and update XP
      await saveQuizScore(user.$id, 'grambearCourse', 'grambearQuiz', quizScore, questions.length);
      await addXPToUser(user.accountId, xpEarned);

      setModalVisible(true); // Show modal after successful submission
    } catch (error) {
      console.error('Failed to save quiz score or update XP.', error);
      Alert.alert('Error', 'There was an issue submitting your quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>

      {/* Main content container */}
      <View style={styles.container}>
        <View style={styles.row}>
          <Image source={designs.grambearpink} style={styles.image} />
          <Text style={styles.title}>Understanding{"\n"}Past Tense Verbs</Text>
        </View>

        <View style={styles.questionContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.quizText}>
            <Text style={styles.quizSubHeading}>Quiz - Past Tense Verbs</Text>
            {"\n"}Directions: Select the correct simple past verb.
          </Text>

          {/* Render quiz questions */}
          {questions.map((question) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.question}>{question.text}</Text>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    selectedOptions[question.id] === option.id ? styles.selectedOption : null,
                  ]}
                  onPress={() => handleOptionSelect(question.id, option.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions[question.id] === option.id ? styles.selectedOptionText : null,
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitButton, !allQuestionsAnswered && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.submitButtonText}>Submit</Text>
              {isSubmitting && (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.activityIndicator}
                />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
        </View>

        {/* Result modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Good Job!</Text>
            <Icon name="checkmark-circle-outline" size={80} color="#5C6898" />
            <Text style={styles.modalText}>You scored {score}/{questions.length}</Text>
            <Text style={styles.modalText}>You earned {score * 10} Petals 🌸</Text>

            {/* See Answers button */}
            <Link href={{
              pathname: '/grambearCourse/grambearResult',
              params: {
                score,
                questions: JSON.stringify(questions),
                selectedOptions: JSON.stringify(selectedOptions),
              },
            }} style={styles.seeAnswersButton}>
              <Text style={styles.seeAnswersButtonText}>See Answers</Text>
            </Link>

            {/* Continue button */}
            <TouchableOpacity  style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={quizInProgressModal}>
  <View style={styles.modalContainer}>
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Quiz In Progress</Text>
      <Icon name="warning-outline" size={60} color="#5C6898" />
      <Text style={styles.modalText}>You cannot go back during the quiz.</Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setQuizInProgressModal(false)}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffe8f0',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    padding: 10,
    backgroundColor: '#5C6898',
    borderRadius: 10,
    zIndex: 10, 
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eac2cf',
    borderRadius: 10,
    margin: 20,
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginLeft: -10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    flex: 1,
    textAlign: 'left',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  quizText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 10,
    marginTop: -5,
    margin: 10,
  },
  quizSubHeading: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#c67b88',
    marginTop: 15,
    marginBottom: 5,
    margin: 10,
  },
  questionContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 10,
    marginBottom: 5,
  },
  question: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#c67b88',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#fffff0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#c67b88',
  },
  optionText: {
    fontSize: 16,
    color: '#c67b88',
    fontFamily: 'Quicksand-Bold',
  },
  selectedOptionText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold'
  },
  submitButton: {
    backgroundColor: '#c67b88',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    width: '60%',
  },
  submitButtonText: {
    fontSize: 25,
    color: '#FFFFF0',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#CCC',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5c6898',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-Bold',
    marginBottom: 15,
    color: '#5C6898',
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#5C6898',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  seeAnswersButton: {
    backgroundColor: '#5C6898',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
  seeAnswersButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  continueButton: {
    backgroundColor: '#5c6898',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginLeft: 10,
  },
});

export default GrambearQuiz;
