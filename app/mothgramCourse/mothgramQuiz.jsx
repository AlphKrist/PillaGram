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
import { Link, useRouter } from 'expo-router';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';

const shuffleArray = (array) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      delete item.sort;
      return item;
    });
};

const MothgramQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, darkMode } = useGlobalContext();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizInProgressModal, setQuizInProgressModal] = useState(false);
  const [score, setScore] = useState(0); // To store the quiz score
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const courseId = 'mothgramCourse';
  const lessonId = 'mothgramQuiz';
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
  const handleNextLesson = () => {
    setModalVisible(false); // Hide the modal
    router.replace("/mothgramCourse/mothgramCongrats"); // Navigate to the next lesson
  };
  
  useEffect(() => {
    return () => {
      setModalVisible(false);
    };
  }, []);

  useEffect(() => {
  const questions = [
    {
      id: 1,
      text: "Last Saturday, Lily \_\_\_\_ [discover] a small puppy wandering alone in her neighborhood.",
      options: [
        { id: 1, text: 'discover', correct: false },
        { id: 2, text: 'discovered', correct: true },
        { id: 3, text: 'discovering', correct: false },
        { id: 4, text: 'saw', correct: false },
      ],
    },
    {
      id: 2,
      text: "The puppy looked scared and hungry, so she \_\_\_\_ [decide] to take it home",
      options: [
        { id: 1, text: 'decide', correct: false },
        { id: 2, text: 'decided', correct: true },
        { id: 3, text: 'deciding', correct: false },
        { id: 4, text: 'do decide', correct: false },
      ],
    },
    {
      id: 3,
      text: "Lily \_\_\_\_ [name] the puppy Max",
      options: [
        { id: 1, text: 'put a name', correct: false },
        { id: 2, text: 'naming', correct: false },
        { id: 3, text: 'named', correct: true },
        { id: 4, text: 'name', correct: false },
      ],
    },
    {
      id: 4,
      text: "Lily \_\_\_\_ [give] Max some food and water.",
      options: [
        { id: 1, text: 'gave', correct: true },
        { id: 2, text: 'gives', correct: false },
        { id: 3, text: 'given', correct: false },
        { id: 4, text: 'had give', correct: false },
      ],
    },
    {
      id: 5,
      text: "After feeding him, she \_\_\_\_ [realize] that Max \_\_\_\_ [be] lost.",
      options: [
        { id: 1, text: 'realized, has been', correct: false },
        { id: 2, text: 'had realized, had been', correct: false },
        { id: 3, text: 'realized, was', correct: true },
        { id: 4, text: 'has realized, was been', correct: false },
      ],
    },
    {
      id: 6,
      text: "She \_\_\_\_ [ask] her neighbors if they \_\_\_\_ [see] him before",
      options: [
        { id: 1, text: 'asked, saw', correct: true },
        { id: 2, text: 'did ask, seen', correct: false },
        { id: 3, text: 'has asked, saw', correct: false },
        { id: 4, text: 'asked, seen', correct: false },
      ],
    },
    {
      id: 7,
      text: "No one \_\_\_\_ [know] where he came from, but they all \_\_\_\_ [offer] to help her look for his owner.",
      options: [
        { id: 1, text: 'knew, offered', correct: true },
        { id: 2, text: 'have known, offered', correct: false },
        { id: 3, text: 'has know, had offered', correct: false },
        { id: 4, text: 'knew, had offer', correct: false },
      ],
    },
    {
      id: 8,
      text: "As they \_\_\_\_ [search] the neighborhood, Lily \_\_\_\_ [feel] a sense of hope.",
      options: [
        { id: 1, text: 'searches, feels', correct: false },
        { id: 2, text: 'searched, felt', correct: true },
        { id: 3, text: 'searched, had felt', correct: false },
        { id: 4, text: 'had searched, felt', correct: false },
      ],
    },
    {
      id: 9,
      text: "Finally, they \_\_\_\_ [find] a little boy who \_\_\_\_ [call] out for Max.",
      options: [
        { id: 1, text: 'have find, calls', correct: false },
        { id: 2, text: 'found, had call', correct: false },
        { id: 3, text: 'found, called', correct: true },
        { id: 4, text: 'founded, called', correct: false },
      ],
    },
    {
      id: 10,
      text: "The boy \_\_\_\_ [be] overjoyed to be reunited with his puppy, and Lily \_\_\_\_ [feel] happy knowing she \_\_\_\_ [help] bring them back together.",
      options: [
        { id: 1, text: 'had been, felt, have helped', correct: true },
        { id: 2, text: 'has been, had felt, had help', correct: false },
        { id: 3, text: 'was, had felt, helped', correct: false },
        { id: 4, text: 'was, felt, helped', correct: false },
      ],
    },
  ];

  setShuffledQuestions(shuffleArray(questions));
  }, []);

  // Handle option selection for each question
  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Check if all questions are answered
  const allQuestionsAnswered = Object.keys(selectedOptions).length === shuffledQuestions.length;

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
      quizScore = shuffledQuestions.reduce((total, question) => {
        const selectedOption = question.options.find((option) => option.id === selectedOptions[question.id]);
        return total + (selectedOption.correct ? 1 : 0);
      }, 0);

      setScore(quizScore); // Update state with score

      // Calculate XP (10 XP per correct answer)
      const xpEarned = quizScore * 10;

      // Save quiz score and update XP
      await saveQuizScore(user.$id, 'mothgramCourse', 'mothgramQuiz', quizScore, shuffledQuestions.length);
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
    <SafeAreaView style={darkMode ? styles.wrapperDark : styles.wrapper}>
      <View style={darkMode ? styles.containerDark : styles.container}>
      <View style={styles.row}>
          <Image
            source={darkMode ? designs.mothgram : designs.mothgrampink} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={darkMode ? styles.titleDark : styles.title}>MothGram</Text>
        </View>

        <View style={darkMode ? styles.questionContainerDark : styles.questionContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={darkMode ? styles.quizTextDark : styles.quizText}>
            Directions: Choose the correct answer.
          </Text>

          {/* Render quiz questions */}
          {shuffledQuestions.map((question) => (
            <View key={question.id} style={darkMode ? styles.questionContainerDark : styles.questionContainer}>
              <Text style={darkMode ? styles.questionDark : styles.question}>{question.text}</Text>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    selectedOptions[question.id] === option.id ? darkMode ? styles.selectedOptionDark : styles.selectedOption : null,
                  ]}
                  onPress={() => handleOptionSelect(question.id, option.id)}
                >
                  <Text
                    style={[
                      darkMode ? styles.optionTextDark : styles.optionText,
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
            style={[darkMode ? styles.submitButtonDark : styles.submitButton, !allQuestionsAnswered && styles.disabledButton]}
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

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Good Job!</Text>
            <Icon name="checkmark-circle-outline" size={80} color="#5C6898" />
            <Text style={styles.modalText}>You scored {score}/{shuffledQuestions.length}</Text>
            <Text style={styles.modalText}>You earned {score * 10} Petals 🌸</Text>

            <Link
            href={{
            pathname: '/mothgramCourse/mothgramResult',
            params: {
              score,
              shuffledQuestions: JSON.stringify(shuffledQuestions),
              selectedOptions: JSON.stringify(selectedOptions),
            },
            }}
            onPress={() => setModalVisible(false)}
            style={styles.seeAnswersButton}
            >
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
  wrapperDark: {
    flex: 1,
    backgroundColor: '#2e375b',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eac2cf',
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
  containerDark: {
    flex: 1,
    padding: 20,
    backgroundColor: '#5C6898',
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
    color: '#c67b88',
  },
  titleDark: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#d1d5fa',
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
    backgroundColor: '#ffe8f0',
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
  quizTextDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#5C6898',
    marginBottom: 10,
    marginTop: -5,
    margin: 10,
  },
  quizSubHeadingDark: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#5C6898',
    marginTop: 15,
    marginBottom: 5,
    margin: 10,
  },
  questionContainerDark: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#d1d5fa',
    padding: 10,
    marginBottom: 5,
  },
  questionDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#5C6898',
    marginBottom: 10,
  },
  selectedOptionDark: {
    backgroundColor: '#5C6898',
  },
  optionTextDark: {
    fontSize: 16,
    color: '#5C6898',
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
  submitButtonDark: {
    backgroundColor: '#5C6898',
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
  activityIndicator: {
    marginLeft: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MothgramQuiz