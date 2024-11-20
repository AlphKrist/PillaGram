import React, { useState, useEffect, useRef } from 'react';
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
import { Link, useRouter, router } from 'expo-router';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';

const TaletimeQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizInProgressModal, setQuizInProgressModal] = useState(false);
  const [score, setScore] = useState(0); // To store the quiz score
  const courseId = 'taletimeCourse';
  const lessonId = 'taletimeQuiz';
  const startTimeRef = useRef(null);

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
            const progressIncrement = isNewLesson ? 10 : 0; // Increment by 10% if this is a new lesson
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


  const handleNextLesson = () => {
    setModalVisible(false); // Hide the modal
    router.push("/taletimeCourse/taletimeb4read2"); // Navigate to the next lesson
  };
  
  useEffect(() => {
    return () => {
      setModalVisible(false);
    };
  }, []);

  // Sample questions and options
  const questions = [
    {
      id: 1,
      text: 'What does "dense" mean in the context of the phrase "the dense forest"?',
      options: [
        { id: 1, text: 'Clear and open', correct: false },
        { id: 2, text: 'Thick and crowded', correct: true },
        { id: 3, text: 'Dark and gloomy', correct: false },
        { id: 4, text: 'Bright and colorful', correct: false },
      ],
    },
    {
      id: 2,
      text: 'In the sentence "the trees were tall and ancient," what does "ancient" imply?',
      options: [
        { id: 1, text: 'Very young', correct: false },
        { id: 2, text: 'Very old', correct: true },
        { id: 3, text: 'Recently planted', correct: false },
        { id: 4, text: 'Small', correct: false },
      ],
    },
    {
      id: 3,
      text: "What does \"entranced\" suggest about Mia's feelings toward the fountain?",
      options: [
        { id: 1, text: 'She was confused', correct: false },
        { id: 2, text: 'She was bored', correct: false },
        { id: 3, text: 'She was fascinated', correct: true },
        { id: 4, text: 'She was scared', correct: false },
      ],
    },
    {
      id: 4,
      text: "What does \"cascading\" describe about the water in the fountain?",
      options: [
        { id: 1, text: 'Flowing rapidly', correct: true },
        { id: 2, text: 'Dripping slowly', correct: false },
        { id: 3, text: 'Standing still', correct: false },
        { id: 4, text: 'Bubbling fiercely', correct: false },
      ],
    },
    {
      id: 5,
      text: "What is implied by the phrase \"not all secrets are meant to be uncovered\"?",
      options: [
        { id: 1, text: 'Some secrets can be harmful', correct: true },
        { id: 2, text: 'All secrets should be known', correct: false },
        { id: 3, text: 'Secrets are always good', correct: false },
        { id: 4, text: 'Secrets should be ignored', correct: false },
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
      await saveQuizScore(user.$id, 'taletimeCourse', 'taletimeQuiz1', quizScore, questions.length);
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
      <View style={styles.container}>
      <View style={styles.row}>
          <Image
            source={designs.dolphin} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={styles.title}>The Mysterious Forest</Text>
        </View>

        <View style={styles.questionContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.quizText}>
            <Text style={styles.quizSubHeading}>Vocabulary Questions</Text>
            {"\n"}Directions: Choose the correct answer.
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
              pathname: '/taletimeCourse/taletimeResult',
              params: {
                score,
                questions: JSON.stringify(questions),
                selectedOptions: JSON.stringify(selectedOptions),
              },
            }} onPress={() => setModalVisible(false)}
            style={styles.seeAnswersButton}>
              <Text style={styles.seeAnswersButtonText}>See Answers</Text>
            </Link>

            <TouchableOpacity onPress={handleNextLesson} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Next</Text>
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
    backgroundColor: '#ffeff7',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    marginTop: 50,
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
    justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 1,
    paddingHorizontal: 42,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#eac2cf',
    right: -10,
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
    backgroundColor: '#eac2cf',
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
    backgroundColor: '#5C6898',
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

export default TaletimeQuiz