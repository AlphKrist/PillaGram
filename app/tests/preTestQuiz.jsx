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
  ActivityIndicator
} from 'react-native';
import { designs } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../../context/GlobalProvider'; // For current user context
import { Link, useRouter } from 'expo-router';
import { updateTestScore, updateTestCompletionStatus } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import useAppwrite from '../../lib/useAppwrite';


const PreTestQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setIsPreTestCompleted, fetchUserData, setIsCoursesLocked, setIsImageContainerLocked, setIsPostTestLocked } = useGlobalContext();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0); // To store the quiz score
  const { data, loading, refetch } = useAppwrite(() => {
    // Define the function to fetch the data you need here
  });
  const handleNextLesson = async () => {
    setModalVisible(false); // Hide the modal
    await refetch();
    router.replace("/(tabs)/home"); 
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
      text: '1. Which of the following is the correct past tense of "teach"?',
      options: [
        { id: 1, text: 'Teach', correct: false },
        { id: 2, text: 'Taught', correct: true },
        { id: 3, text: 'Teached', correct: false },
        { id: 4, text: 'Teaching', correct: false },
      ],
    },
    {
      id: 2,
      text: '2. Choose the correct past tense form of the verb "run".',
      options: [
        { id: 1, text: 'Runs', correct: false },
        { id: 2, text: 'Running', correct: false },
        { id: 3, text: 'Runned', correct: false },
        { id: 4, text: 'Ran', correct: true },
      ],
    },
    {
      id: 3,
      text: "3. Which sentence uses the past tense correctly?",
      options: [
        { id: 1, text: 'She was run to school yesterday.', correct: false },
        { id: 2, text: 'She ran to school yesterday.', correct: true },
        { id: 3, text: 'She runs to school every day.', correct: false },
        { id: 4, text: 'She running to school yesterday.', correct: false },
      ],
    },
    {
      id: 4,
      text: '4. What is the past tense of "sing"?',
      options: [
        { id: 1, text: 'Singed', correct: false },
        { id: 2, text: 'Sung', correct: false },
        { id: 3, text: 'Sang', correct: true },
        { id: 4, text: 'Singing', correct: false },
      ],
    },
    {
      id: 5,
      text: "5. Which of these is an irregular past tense verb?",
      options: [
        { id: 1, text: 'Played', correct: false },
        { id: 2, text: 'Went', correct: true },
        { id: 3, text: 'Danced', correct: false },
        { id: 4, text: 'Talked', correct: false },
      ],
    },
    {
      id: 6,
      text: "6. What is the primary purpose of a narrative text?",
      options: [
        { id: 1, text: 'To explain a process', correct: false },
        { id: 2, text: 'To give facts', correct: false },
        { id: 3, text: 'To tell a story', correct: true },
        { id: 4, text: 'To argue a point', correct: false },
      ],
    },
    {
      id: 7,
      text: "7. Which part of a narrative text introduces the main characters and setting?",
      options: [
        { id: 1, text: 'Conclusion', correct: false },
        { id: 2, text: 'Exposition', correct: true },
        { id: 3, text: 'Climax', correct: false },
        { id: 4, text: 'Resolution', correct: false },
      ],
    },
    {
      id: 8,
      text: "8. What is the climax in a narrative text?",
      options: [
        { id: 1, text: 'The beginning of the story', correct: false },
        { id: 2, text: 'The introduction of the main characters', correct: false },
        { id: 3, text: ' The end of the story', correct: false },
        { id: 4, text: 'The most intense or exciting part of the story', correct: true },
      ],
    },
    {
      id: 9,
      text: "9. In a narrative text, what is the resolution?",
      options: [
        { id: 1, text: 'The part where characters are introduced', correct: false },
        { id: 2, text: 'The conclusion where conflicts are resolved', correct: true },
        { id: 3, text: 'The beginning of the plot', correct: false },
        { id: 4, text: 'The climax of the story', correct: false },
      ],
    },
    {
      id: 10,
      text: "10. What is one common feature of a narrative text?",
      options: [
        { id: 1, text: 'It uses a chronological order to tell a story.', correct: true },
        { id: 2, text: 'It explains how to do something.', correct: false },
        { id: 3, text: 'It lists facts and evidence.', correct: false },
        { id: 4, text: 'It compares and contrasts different viewpoints.', correct: false },
      ],
    },
    {
      id: 11,
      text: "11. What are context clues?",
      options: [
        { id: 1, text: 'Words and phrases that help explain the meaning of unfamiliar words', correct: true },
        { id: 2, text: 'Words that tell you what the next chapter is about', correct: false },
        { id: 3, text: 'Numbers that help you calculate an answer', correct: false },
        { id: 4, text: 'Pictures that explain the meaning of the text', correct: false },
      ],
    },
    {
      id: 12,
      text: '12. In the sentence, "The children were jubilant after winning the game," what does "jubilant" most likely mean based on context clues?',
      options: [
        { id: 1, text: 'Sad', correct: false },
        { id: 2, text: 'Excited', correct: true },
        { id: 3, text: 'Tired', correct: false },
        { id: 4, text: 'Hungry', correct: false },
      ],
    },
    {
      id: 13,
      text: '13. Which type of context clue uses words with opposite meanings to explain a difficult word?',
      options: [
        { id: 1, text: 'Synonym clue', correct: false },
        { id: 2, text: 'Example clue', correct: false },
        { id: 3, text: 'Antonym clue', correct: true },
        { id: 4, text: 'Definition clue', correct: false },
      ],
    },
    {
      id: 14,
      text: "14. If you come across a difficult word in a narrative, how can context clues help?",
      options: [
        { id: 1, text: 'They provide the dictionary definition.', correct: false },
        { id: 2, text: 'They explain how to pronounce the word.', correct: false },
        { id: 3, text: 'They skip over the word.', correct: false },
        { id: 4, text: 'They give hints from the surrounding words to understand the meaning.', correct: true },
      ],
    },
    {
      id: 15,
      text: '15. In the sentence, "After a long hike, they were exhausted," what does "exhausted" most likely mean?',
      options: [
        { id: 1, text: 'Very tired', correct: true },
        { id: 2, text: 'Full of energy', correct: false },
        { id: 3, text: 'Angry', correct: false },
        { id: 4, text: 'Hungry', correct: false },
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
    try {
      const calculatedScore = questions.reduce((total, question) => {
        const selectedOption = question.options.find(
          (option) => option.id === selectedOptions[question.id]
        );
        return total + (selectedOption?.correct ? 1 : 0);
      }, 0);

      setScore(calculatedScore);

      await updateTestScore(user.accountId, 'pre', calculatedScore);
      await updateTestCompletionStatus(user.accountId, 'pre', true); 

      setIsPreTestCompleted(true);
      setIsCoursesLocked(false);
      setIsImageContainerLocked(true);
      setIsPostTestLocked(true);
      await fetchUserData();
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to save pre-test score.', error);
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
          <Text style={styles.title}>Pre-Test</Text>
        </View>

        <View style={styles.questionContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.quizText}>
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
            <Text style={styles.modalTitle}>Good Job! Thank you for answering Pre-Test!{"\n\n"}You unlocked 'Courses'!</Text>
            <Icon name="checkmark-circle-outline" size={80} color="#c67b88" />
            <Text style={styles.modalText}>You scored {score}/{questions.length}</Text>

            <TouchableOpacity onPress={handleNextLesson} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Next</Text>
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
    marginTop:60,
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
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
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
    marginTop: -20,
    margin: 10,
  },
  quizSubHeading: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#5C6898',
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
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#ffeff7',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#c67b88',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-Bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#c67b88',
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  continueButton: {
    backgroundColor: '#c67b88',
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

export default PreTestQuiz;
