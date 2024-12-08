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

const StoryQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0); // To store the quiz score
  const [quizInProgressModal, setQuizInProgressModal] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const courseId = 'storyCourse';
  const lessonId = 'storyQuiz';
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
            const progressIncrement = isNewLesson ? 14 : 0; // Increment by 10% if this is a new lesson
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
    router.push("/storyCourse/storyStart2"); // Navigate to the next lesson
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
      text: 'What is the main purpose of narrative text?',
      options: [
        { id: 1, text: 'To inform', correct: false },
        { id: 2, text: 'To persuade', correct: false },
        { id: 3, text: 'To tell a story', correct: true },
        { id: 4, text: 'To describe', correct: false },
      ],
    },
    {
      id: 2,
      text: 'Which element of narrative text refers to the time and place where the story occurs?',
      options: [
        { id: 1, text: 'Theme', correct: false },
        { id: 2, text: 'Character', correct: false },
        { id: 3, text: 'Plot', correct: false },
        { id: 4, text: 'Setting', correct: true },
      ],
    },
    {
      id: 3,
      text: "In a story, who is the main character often referred to as?",
      options: [
        { id: 1, text: 'Antagonist', correct: false },
        { id: 2, text: 'Protagonist', correct: true },
        { id: 3, text: 'Narrator', correct: false },
        { id: 4, text: 'Supporting Character', correct: false },
      ],
    },
    {
      id: 4,
      text: "What are the events that lead up to the climax of a story called?",
      options: [
        { id: 1, text: 'Resolution', correct: false },
        { id: 2, text: 'Exposition', correct: false },
        { id: 3, text: 'Rising Action', correct: true },
        { id: 4, text: 'Falling Action', correct: false },
      ],
    },
    {
      id: 5,
      text: "Which of the following is an example of internal conflict?",
      options: [
        { id: 1, text: 'A character fighting against a monster', correct: false },
        { id: 2, text: 'A character deciding between two job offers', correct: true },
        { id: 3, text: 'A character running from a storm', correct: false },
        { id: 4, text: 'A character navigating a maze', correct: false },
      ],
    },
    {
      id: 6,
      text: "What is the term for the message or main idea of a narrative?",
      options: [
        { id: 1, text: 'Plot', correct: false },
        { id: 2, text: 'Conflict', correct: false },
        { id: 3, text: 'Theme', correct: true },
        { id: 4, text: 'Setting', correct: false },
      ],
    },
    {
      id: 7,
      text: "In narrative text, what does \"show, don’t tell\" mean?",
      options: [
        { id: 1, text: 'Using simple language', correct: false },
        { id: 2, text: 'Providing sensory details to create imagery', correct: true },
        { id: 3, text: 'Summarizing the plot', correct: false },
        { id: 4, text: 'Writing in first person', correct: false },
      ],
    },
    {
      id: 8,
      text: "What type of point of view uses \"I\" or \"we\"?",
      options: [
        { id: 1, text: 'Third Person Limited', correct: false },
        { id: 2, text: 'Second Person', correct: false },
        { id: 3, text: 'Third Person Omniscient', correct: false },
        { id: 4, text: 'First Person', correct: true },
      ],
    },
    {
      id: 9,
      text: "Which part of the plot structure introduces the characters and setting?",
      options: [
        { id: 1, text: 'Climax', correct: false },
        { id: 2, text: 'Exposition', correct: true },
        { id: 3, text: 'Rising Action', correct: false },
        { id: 4, text: 'Resolution', correct: false },
      ],
    },
    {
      id: 10,
      text: "What role does dialogue play in a narrative?",
      options: [
        { id: 1, text: 'It summarizes the story.', correct: false },
        { id: 2, text: 'It reveals character traits and advances the plot.', correct: true },
        { id: 3, text: 'It describes the setting in detail.', correct: false },
        { id: 4, text: 'It is used to create conflict.', correct: false },
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
      await saveQuizScore(user.$id, 'storyCourse', 'storyQuiz', quizScore, shuffledQuestions.length);
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
            source={designs.bookpink} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={styles.title}>Story</Text>
        </View>

        <View style={styles.questionContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.quizText}>
            <Text style={styles.quizSubHeading}>Narrative Text Quiz</Text>
            {"\n"}Directions: Choose the correct answer.
          </Text>

          {/* Render quiz questions */}
          {shuffledQuestions.map((question) => (
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
            <Text style={styles.modalText}>You scored {score}/{shuffledQuestions.length}</Text>
            <Text style={styles.modalText}>You earned {score * 10} Petals 🌸</Text>

            {/* See Answers button */}
            <Link href={{
              pathname: '/storyCourse/storyResult',
              params: {
                score,
                shuffledQuestions: JSON.stringify(shuffledQuestions),
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
    justifyContent: 'center',
    flexShrink: 1,
    paddingHorizontal: 45,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 48,
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

export default StoryQuiz;
