import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler
} from 'react-native';
import { designs } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link } from 'expo-router';

const MothgramResult = () => {
  const { user, darkMode } = useGlobalContext();
  const router = useRouter();
  const navigation = useNavigation();
  const { score, shuffledQuestions: questionsStr, selectedOptions: selectedOptionsStr } = useLocalSearchParams();

  // Parse the JSON strings into objects
  const shuffledQuestions = JSON.parse(questionsStr);
  const selectedOptions = JSON.parse(selectedOptionsStr);
  useEffect(() => {
    const handleBackPress = () => {
      return true; // Block the back button
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <SafeAreaView style={darkMode ? styles.wrapperDark : styles.wrapper}>

      {/* Main content container */}
      <View style={darkMode ? styles.containerDark : styles.container}>
        <View style={styles.row}>
          <Image source={darkMode ? designs.mothgram : designs.mothgrampink} style={styles.image} />
          <View style={styles.titleContainer}>
            <Text style={darkMode ? styles.titleDark : styles.title}>Quiz Results</Text>
            <Text style={darkMode ? styles.quizTextDark : styles.quizText}>
              <Text style={darkMode ? styles.quizSubHeadingDark : styles.quizSubHeading}>Results Summary</Text>
              {"\n"}Your score: {score}/{shuffledQuestions.length}
            </Text>
          </View>
        </View>

        <View style={darkMode ? styles.questionContainerDark : styles.questionContainer}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          

          {/* Render quiz questions with results */}
          {shuffledQuestions.map((question) => {
            const selectedOptionId = selectedOptions[question.id];
            return (
              <View key={question.id} style={darkMode ? styles.questionContainerDark : styles.questionContainer}>
                <Text style={darkMode ? styles.questionDark : styles.question}>{question.text}</Text>

                {question.options.map((option) => {
                  const isCorrect = option.correct;
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <View
                      key={option.id}
                      style={[
                        styles.option,
                        isSelected && !isCorrect ? styles.incorrectOption : null, // Mark selected incorrect answers
                        isCorrect ? styles.correctOption : null, // Mark correct answers
                      ]}
                    >
                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            darkMode  ? styles.optionTextDark : styles.optionText,
                            isSelected && !isCorrect ? styles.incorrectOptionText : null,
                            isCorrect ? styles.correctOptionText : null,
                          ]}
                          numberOfLines={3}
                        >
                          {option.text}
                        </Text>

                        {/* Display Ionicons for correct/incorrect answers */}
                        {isSelected && isCorrect && (
                          <Icon
                            name="checkmark-circle"
                            size={20}
                            color="#fff"
                            style={styles.icon}
                          />
                        )}
                        {isSelected && !isCorrect && (
                          <Icon
                            name="close-circle"
                            size={20}
                            color="#fff"
                            style={styles.icon}
                          />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        </View>

          <TouchableOpacity style={darkMode ? styles.continueButtonDark : styles.continueButton}>
            <Link href="/mothgramCourse/mothgramCongrats">
              <Text style={darkMode ? styles.continueButtonTextDark : styles.continueButtonText}>Next</Text>
            </Link>
          </TouchableOpacity>
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
    marginTop: 60,
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
    marginBottom: 10,
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
  questionContainerDark: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#d1d5fa',
    padding: 10,
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    textAlign: 'left',
  },
  titleDark: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#d1d5fa',
    textAlign: 'left',
  },

  
  quizText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 10,
  },
  quizSubHeading: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#c67b88',
  },
  question: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#c67b88',
    marginBottom: 10,
  },
  quizTextDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#d1d5fa',
    marginBottom: 10,
  },
  quizSubHeadingDark: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#d1d5fa',
  },
  questionDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#5C6898',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#fffff0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Push icon to the right
    alignItems: 'center',

  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#c67b88',
    flexShrink: 1,
  },
  optionTextDark: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#5C6898',
    flexShrink: 1,
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
  },
  correctOptionText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
  },
  incorrectOptionText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
  },
  icon: {
    marginLeft: 10,
    flexShrink: 0,
  },
  continueButton: {
    backgroundColor: '#c67b88',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  continueButtonDark: {
    backgroundColor: '#d1d5fa',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#ffeff7',
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  continueButtonTextDark: {
    color: '#5C6898',
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  titleContainer: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  
});

export default MothgramResult
