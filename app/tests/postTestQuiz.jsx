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


const PostTestQuiz = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setIsPostTestCompleted, fetchUserData, setIsImageContainerLocked } = useGlobalContext();
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
      text: '1. What is the correct past tense form of "go"?',
      options: [
        { id: 1, text: 'Going', correct: false },
        { id: 2, text: 'Went', correct: true },
        { id: 3, text: 'Gone', correct: false },
        { id: 4, text: 'Goes', correct: false },
      ],
    },
    {
      id: 2,
      text: '2. Which of these sentences uses the past tense incorrectly?',
      options: [
        { id: 1, text: 'He watched a movie last night.', correct: false },
        { id: 2, text: 'They played soccer yesterday.', correct: false },
        { id: 3, text: 'He walked to school this morning.', correct: false },
        { id: 4, text: 'She gone to the store yesterday.', correct: true },
      ],
    },
    {
      id: 3,
      text: '3. What is the past tense of "drive"?',
      options: [
        { id: 1, text: 'Drove', correct: true },
        { id: 2, text: 'Driven', correct: false },
        { id: 3, text: 'Driving', correct: false },
        { id: 4, text: 'Drives', correct: false },
      ],
    },
    {
      id: 4,
      text: '4. Which of the following verbs is regular in the past tense?',
      options: [
        { id: 1, text: 'Write', correct: false },
        { id: 2, text: 'Speak', correct: false },
        { id: 3, text: 'Talk', correct: true },
        { id: 4, text: 'Swim', correct: false },
      ],
    },
    {
      id: 5,
      text: "5. Choose the sentence with the correct past tense:",
      options: [
        { id: 1, text: 'She running fast.', correct: false },
        { id: 2, text: 'He danced at the party.', correct: true },
        { id: 3, text: 'They goes to school every day.', correct: false },
        { id: 4, text: 'I will eat breakfast.', correct: false },
      ],
    },
    {
      id: 6,
      text: "6. In a narrative, which part includes a series of events that build tension and develop the conflict?",
      options: [
        { id: 1, text: 'Setting', correct: false },
        { id: 2, text: 'Conclusion', correct: false },
        { id: 3, text: 'Rising Action', correct: true },
        { id: 4, text: 'Exposition', correct: false },
      ],
    },
    {
      id: 7,
      text: "7. Which of the following is an element of a narrative text?",
      options: [
        { id: 1, text: 'Instructions', correct: false },
        { id: 2, text: 'Setting and plot', correct: true },
        { id: 3, text: 'Graphs and data', correct: false },
        { id: 4, text: 'Definitions', correct: false },
      ],
    },
    {
      id: 8,
      text: "8. In a narrative, which element usually comes after the climax?",
      options: [
        { id: 1, text: 'Rising Action', correct: false },
        { id: 2, text: 'Exposition', correct: false },
        { id: 3, text: 'Theme', correct: false },
        { id: 4, text: 'Falling action', correct: true },
      ],
    },
    {
      id: 9,
      text: "9. Why is the setting important in a narrative?",
      options: [
        { id: 1, text: 'It introduces the antagonist', correct: false },
        { id: 2, text: 'It provides context and enhances mood, helping readers visualize the story.', correct: true },
        { id: 3, text: 'It determines the main character’s personality', correct: false },
        { id: 4, text: 'It always determines the plot outcome', correct: false },
      ],
    },
    {
      id: 10,
      text: "10. Which is true about narrative texts?",
      options: [
        { id: 1, text: 'They tell a story with a sequence of events.', correct: true },
        { id: 2, text: 'They always provide facts and data.', correct: false },
        { id: 3, text: 'They are used to explain processes.', correct: false },
        { id: 4, text: 'They are lists of information.', correct: false },
      ],
    },
    {
      id: 11,
      text: "11. How do context clues help you understand difficult words in a story?",
      options: [
        { id: 1, text: 'They give hints from the surrounding text.', correct: true },
        { id: 2, text: 'They provide exact definitions.', correct: false },
        { id: 3, text: 'They make you skip difficult words.', correct: false },
        { id: 4, text: 'They list all the unknown words.', correct: false },
      ],
    },
    {
      id: 12,
      text: '12. In the sentence, "After the race, he was fatigued." what does "fatigued" most likely mean based on context clues?',
      options: [
        { id: 1, text: 'Excited', correct: false },
        { id: 2, text: 'Tired', correct: true },
        { id: 3, text: 'Happy', correct: false },
        { id: 4, text: 'Angry', correct: false },
      ],
    },
    {
      id: 13,
      text: '13. Which type of context clue provides similar words to explain a difficult word?',
      options: [
        { id: 1, text: 'Antonym clue', correct: false },
        { id: 2, text: 'Example clue', correct: false },
        { id: 3, text: 'Synonym clue', correct: true },
        { id: 4, text: 'Definition clue', correct: false },
      ],
    },
    {
      id: 14,
      text: '14. In the sentence, "She felt anxious, but her friend was calm." what does "anxious" mean based on context clues?',
      options: [
        { id: 1, text: 'Relaxed', correct: false },
        { id: 2, text: 'Confident', correct: false },
        { id: 3, text: 'Happy', correct: false },
        { id: 4, text: 'Nervous', correct: true },
      ],
    },
    {
      id: 15,
      text: '15. In the sentence, "The book was so engrossing that I couldn’t put it down." what does "engrossing" most likely mean?',
      options: [
        { id: 1, text: 'Exciting', correct: true },
        { id: 2, text: 'Boring', correct: false },
        { id: 3, text: 'Confusing', correct: false },
        { id: 4, text: 'Long', correct: false },
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

      await updateTestScore(user.accountId, 'post', calculatedScore);
      await updateTestCompletionStatus(user.accountId, 'post', true); 

      setIsPostTestCompleted(true);
      setIsImageContainerLocked(false);
      await fetchUserData();
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to save post-test score.', error);
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
          <Text style={styles.title}>Post-Test</Text>
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
            <Text style={styles.modalTitle}>Good Job! Thank you for answering the Post-Test!{"\n\n"}You unlocked 'Readify'!</Text>
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

export default PostTestQuiz;
