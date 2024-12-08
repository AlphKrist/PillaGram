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
import { updateTestScore, updateTestCompletionStatus, saveQuizScore, fetchQuizScore } from '../../lib/appwrite';
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
  const [categoryScores, setCategoryScores] = useState({});
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const { data, loading, refetch } = useAppwrite(() => {
    // Define the function to fetch the data you need here
  });

  const categories = {
    mothgram: { count: 4},
    grambear: { count: 4 },
    taletime: { count: 4 },
    story: { count: 3 },
  };

  const questionsPool = {
    mothgram: [
      {
        id: 1,
        text: "Last Friday, Emma \_\_\_\_ [discover] an old photo album in her attic.",
        options: [
          { id: 1, text: 'discover', correct: false },
          { id: 2, text: 'discovered', correct: true },
          { id: 3, text: 'discovering', correct: false },
          { id: 4, text: 'saw', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 2,
        text: "The album was full of memories, so she \_\_\_\_ [decide] to show it to her family.",
        options: [
          { id: 1, text: 'decide', correct: false },
          { id: 2, text: 'decided', correct: true },
          { id: 3, text: 'deciding', correct: false },
          { id: 4, text: 'do decide', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 3,
        text: "Emma \_\_\_\_ [name] the album 'A Walk Down Memory Lane.'",
        options: [
          { id: 1, text: 'put a name', correct: false },
          { id: 2, text: 'naming', correct: false },
          { id: 3, text: 'named', correct: true },
          { id: 4, text: 'name', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 4,
        text: "She \_\_\_\_ [give] her siblings the chance to pick their favorite photos.",
        options: [
          { id: 1, text: 'gave', correct: true },
          { id: 2, text: 'gives', correct: false },
          { id: 3, text: 'given', correct: false },
          { id: 4, text: 'had give', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 5,
        text: "While looking through the photos, she \_\_\_\_ [realize] that some of them \_\_\_\_ [be] from her grandparents' wedding.",
        options: [
          { id: 1, text: 'realized, has been', correct: false },
          { id: 2, text: 'had realized, had been', correct: false },
          { id: 3, text: 'realized, was', correct: true },
          { id: 4, text: 'has realized, was been', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 6,
        text: "She \_\_\_\_ [ask] her parents if they \_\_\_\_ [see] these pictures before.",
        options: [
          { id: 1, text: 'asked, saw', correct: true },
          { id: 2, text: 'did ask, seen', correct: false },
          { id: 3, text: 'has asked, saw', correct: false },
          { id: 4, text: 'asked, seen', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 7,
        text: "Her parents \_\_\_\_ [know] some stories about the photos and \_\_\_\_ [offer] to share them.",
        options: [
          { id: 1, text: 'knew, offered', correct: true },
          { id: 2, text: 'have known, offered', correct: false },
          { id: 3, text: 'has know, had offered', correct: false },
          { id: 4, text: 'knew, had offer', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 8,
        text: "As the family \_\_\_\_ [look] at the pictures, Emma \_\_\_\_ [feel] closer to her roots.",
        options: [
          { id: 1, text: 'searches, feels', correct: false },
          { id: 2, text: 'searched, felt', correct: true },
          { id: 3, text: 'searched, had felt', correct: false },
          { id: 4, text: 'had searched, felt', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 9,
        text: "Finally, they \_\_\_\_ [find] a photo of Emma's mother as a child, and she \_\_\_\_ [call] it her favorite.",
        options: [
          { id: 1, text: 'have find, calls', correct: false },
          { id: 2, text: 'found, had call', correct: false },
          { id: 3, text: 'found, called', correct: true },
          { id: 4, text: 'founded, called', correct: false },
        ],
        category: 'mothgram',
      },
      {
        id: 10,
        text: "The family \_\_\_\_ [be] grateful for the album, and Emma \_\_\_\_ [feel] proud that she \_\_\_\_ [help] preserve these memories.",
        options: [
          { id: 1, text: 'had been, felt, have helped', correct: true },
          { id: 2, text: 'has been, had felt, had help', correct: false },
          { id: 3, text: 'was, had felt, helped', correct: false },
          { id: 4, text: 'was, felt, helped', correct: false },
        ],
        category: 'mothgram',
      },
    ],

    grambear: [
      {
        id: 1,
        text: 'Which of the following completes the sentence correctly: "Yesterday, I \_\_\_\_ to the school"?',
        options: [
          { id: 1, text: 'Goed', correct: false },
          { id: 2, text: 'Went', correct: true },
          { id: 3, text: 'Gone', correct: false },
          { id: 4, text: 'Go', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 2,
        text: 'The sentence "The kids \_\_\_\_ in the yard when the storm started." is completed with which form of "play"?',
        options: [
          { id: 1, text: 'Was playing', correct: false },
          { id: 2, text: 'Were playing', correct: true },
          { id: 3, text: 'Played', correct: false },
          { id: 4, text: 'Is playing', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 3,
        text: 'Which option completes this sentence: "By the time we arrived, they \_\_\_\_ lunch"?',
        options: [
          { id: 1, text: 'Eats', correct: false },
          { id: 2, text: 'Ate', correct: false },
          { id: 3, text: 'Eating', correct: false },
          { id: 4, text: 'Had eaten', correct: true },
        ],
        category: 'grambear',
      },
      {
        id: 4,
        text: 'How should this sentence be completed: "Shane \_\_\_\_ hard for her final exam."?',
        options: [
          { id: 1, text: 'Studied', correct: true },
          { id: 2, text: 'Studies', correct: false },
          { id: 3, text: 'Study', correct: false },
          { id: 4, text: 'Studying', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 5,
        text: 'Which sentence is an example of the past continuous tense?',
        options: [
          { id: 1, text: 'He walked to the store.', correct: false },
          { id: 2, text: 'They were watching TV when I called.', correct: true },
          { id: 3, text: 'I finished my homework.', correct: false },
          { id: 4, text: 'She has a great time.', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 6,
        text: 'Which sentence illustrates the past perfect tense?',
        options: [
          { id: 1, text: 'They had already left when I arrived.', correct: true },
          { id: 2, text: 'I went to the market.', correct: false },
          { id: 3, text: 'She was reading a book.', correct: false },
          { id: 4, text: 'He plays football every Saturday.', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 7,
        text: 'What is the correct simple past form of "write" in the sentence "Sarah \_\_\_\_ a letter to her friend."?',
        options: [
          { id: 1, text: 'Writed', correct: false },
          { id: 2, text: 'Written', correct: false },
          { id: 3, text: 'Wrote', correct: true },
          { id: 4, text: 'Write', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 8,
        text: 'Choose the correct form to complete: "After they \_\_\_\_ dinner, they went for a walk."',
        options: [
          { id: 1, text: 'Had finished', correct: true },
          { id: 2, text: 'Finishing', correct: false },
          { id: 3, text: 'Finished', correct: false },
          { id: 4, text: 'Has finished', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 9,
        text: 'Which verb form is in the past tense in this sentence: "She \_\_\_\_ quickly to catch the bus"?',
        options: [
          { id: 1, text: 'Running', correct: false },
          { id: 2, text: 'Ran', correct: true },
          { id: 3, text: 'Runs', correct: false },
          { id: 4, text: 'Run', correct: false },
        ],
        category: 'grambear',
      },
      {
        id: 10,
        text: '"At 7 PM, I \_\_\_\_ my favorite show." Which is the correct form of "watch"?',
        options: [
          { id: 1, text: 'Was watching', correct: true },
          { id: 2, text: 'Is watching', correct: false },
          { id: 3, text: 'Watched', correct: false },
          { id: 4, text: 'Watching', correct: false },
        ],
        category: 'grambear',
      },
    ],

    taletime: [
      {
        id: 1,
        text: 'In the sentence "The dense jungle made it hard to see the path," what does "dense" describe about the jungle?',
        options: [
            { id: 1, text: 'Clear and open', correct: false },
            { id: 2, text: 'Thick and crowded', correct: true },
            { id: 3, text: 'Dark and gloomy', correct: false },
            { id: 4, text: 'Bright and colorful', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 2,
        text: 'What does "ancient" suggest in the phrase "The ancient ruins were covered in moss"?',
        options: [
            { id: 1, text: 'Very young', correct: false },
            { id: 2, text: 'Very old', correct: true },
            { id: 3, text: 'Recently built', correct: false },
            { id: 4, text: 'Small', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 3,
        text: "In the story, Mia was 'entranced' by the sparkling lights of the carnival. What does 'entranced' reveal about her reaction?",
        options: [
            { id: 1, text: 'She was confused', correct: false },
            { id: 2, text: 'She was bored', correct: false },
            { id: 3, text: 'She was fascinated', correct: true },
            { id: 4, text: 'She was scared', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 4,
        text: "The narrator described the waterfall as 'cascading down the rocks.' What does 'cascading' tell us about the water?",
        options: [
            { id: 1, text: 'Flowing rapidly', correct: true },
            { id: 2, text: 'Dripping slowly', correct: false },
            { id: 3, text: 'Standing still', correct: false },
            { id: 4, text: 'Bubbling fiercely', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 5,
        text: 'In the tale, the old man said, "Some truths are better left untold." What does this phrase mean?',
        options: [
            { id: 1, text: 'Some secrets can be harmful', correct: true },
            { id: 2, text: 'All secrets should be known', correct: false },
            { id: 3, text: 'Secrets are always good', correct: false },
            { id: 4, text: 'Secrets should be ignored', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 6,
        text: 'The story mentions an "overgrown garden." What does "overgrown" suggest about the garden?',
        options: [
            { id: 1, text: 'It is well-maintained.', correct: false },
            { id: 2, text: 'It is filled with thick plants and weeds.', correct: true },
            { id: 3, text: 'It is empty and barren.', correct: false },
            { id: 4, text: 'It is freshly planted.', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 7,
        text: 'In the diary entry, "A sense of nostalgia washed over me as I saw my childhood home." What does "nostalgia" mean here?',
        options: [
            { id: 1, text: 'A feeling of happiness', correct: false },
            { id: 2, text: 'A feeling of sadness', correct: false },
            { id: 3, text: 'A longing for the past', correct: true },
            { id: 4, text: 'A fear of the future', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 8,
        text: 'The poem described the flowers as "vivid blossoms." What does "vivid" imply about the flowers?',
        options: [
            { id: 1, text: 'They are dull and lifeless.', correct: false },
            { id: 2, text: 'They are bright and colorful.', correct: true },
            { id: 3, text: 'They are wilted and dry.', correct: false },
            { id: 4, text: 'They are small and insignificant.', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 9,
        text: 'The description says, "The fountain sparkled in the sunlight." What does "sparkled" indicate about the fountain?',
        options: [
            { id: 1, text: 'It is dirty and neglected.', correct: false },
            { id: 2, text: 'It reflects light beautifully.', correct: true },
            { id: 3, text: 'It is leaking water.', correct: false },
            { id: 4, text: 'It is broken and silent.', correct: false },
        ],
        category: 'taletime',
    },
    {
        id: 10,
        text: 'The story referred to the garden as a "treasure trove of memories." What does this phrase suggest about the garden?',
        options: [
            { id: 1, text: 'It is a place filled with physical treasures.', correct: false },
            { id: 2, text: 'It holds valuable and meaningful family memories.', correct: true },
            { id: 3, text: 'It is a place for finding money.', correct: false },
            { id: 4, text: 'It is an unimportant location.', correct: false },
        ],
        category: 'taletime',
    },
    ],
    
    story: [
      {
        id: 1,
        text: 'What is the main purpose of a story, like one about a boy finding treasure?',
        options: [
            { id: 1, text: 'To inform', correct: false },
            { id: 2, text: 'To persuade', correct: false },
            { id: 3, text: 'To tell a story', correct: true },
            { id: 4, text: 'To describe', correct: false },
        ],
        category: 'story',
    },
    {
        id: 2,
        text: 'In a story about a castle on a hill, what describes the time and place?',
        options: [
            { id: 1, text: 'Theme', correct: false },
            { id: 2, text: 'Character', correct: false },
            { id: 3, text: 'Plot', correct: false },
            { id: 4, text: 'Setting', correct: true },
        ],
        category: 'story',
    },
    {
        id: 3,
        text: 'In a story about a hero saving a village, what is the hero called?',
        options: [
            { id: 1, text: 'Antagonist', correct: false },
            { id: 2, text: 'Protagonist', correct: true },
            { id: 3, text: 'Narrator', correct: false },
            { id: 4, text: 'Supporting Character', correct: false },
        ],
        category: 'story',
    },
    {
        id: 4,
        text: 'What are the exciting events that happen before the big moment in a story?',
        options: [
            { id: 1, text: 'Resolution', correct: false },
            { id: 2, text: 'Exposition', correct: false },
            { id: 3, text: 'Rising Action', correct: true },
            { id: 4, text: 'Falling Action', correct: false },
        ],
        category: 'story',
    },
    {
        id: 5,
        text: 'What type of conflict is it when a person has to choose between two schools?',
        options: [
            { id: 1, text: 'A character fighting against a monster', correct: false },
            { id: 2, text: 'A character deciding between two job offers', correct: true },
            { id: 3, text: 'A character running from a storm', correct: false },
            { id: 4, text: 'A character navigating a maze', correct: false },
        ],
        category: 'story',
    },
    {
        id: 6,
        text: 'In a story about being kind, what is the main message called?',
        options: [
            { id: 1, text: 'Plot', correct: false },
            { id: 2, text: 'Conflict', correct: false },
            { id: 3, text: 'Theme', correct: true },
            { id: 4, text: 'Setting', correct: false },
        ],
        category: 'story',
    },
    {
        id: 7,
        text: 'What does "show, don’t tell" mean when describing a sunny day?',
        options: [
            { id: 1, text: 'Using simple language', correct: false },
            { id: 2, text: 'Providing sensory details to create imagery', correct: true },
            { id: 3, text: 'Summarizing the plot', correct: false },
            { id: 4, text: 'Writing in first person', correct: false },
        ],
        category: 'story',
    },
    {
        id: 8,
        text: 'If a story starts with "I saw a rainbow," what point of view is used?',
        options: [
            { id: 1, text: 'Third Person Limited', correct: false },
            { id: 2, text: 'Second Person', correct: false },
            { id: 3, text: 'Third Person Omniscient', correct: false },
            { id: 4, text: 'First Person', correct: true },
        ],
        category: 'story',
    },
    {
        id: 9,
        text: 'At the beginning of a story, what part introduces the characters and setting?',
        options: [
            { id: 1, text: 'Climax', correct: false },
            { id: 2, text: 'Exposition', correct: true },
            { id: 3, text: 'Rising Action', correct: false },
            { id: 4, text: 'Resolution', correct: false },
        ],
        category: 'story',
    },
    {
        id: 10,
        text: 'When two characters talk in a story, what does their dialogue do?',
        options: [
            { id: 1, text: 'It summarizes the story.', correct: false },
            { id: 2, text: 'It reveals character traits and advances the plot.', correct: true },
            { id: 3, text: 'It describes the setting in detail.', correct: false },
            { id: 4, text: 'It is used to create conflict.', correct: false },
        ],
        category: 'story',
    },
    ],
  };

  const randomizeQuestions = () => {
    const randomized = [];
    Object.keys(categories).forEach((category) => {
      const shuffled = [...questionsPool[category]].sort(() => 0.5 - Math.random());
      randomized.push(
        ...shuffled.slice(0, categories[category].count).map((q, index) => ({
          ...q,
          id: `${category}-${q.id}-${index}`,
          category,
        }))
      );
    });
    setRandomizedQuestions(randomized);
  };
  
  useEffect(() => {
    randomizeQuestions();
  }, []);

  const calculateOverallPercentage = async () => {
    try {
      const quizData = [
        { courseId: 'mothgramCourse', quizId: 'mothgramQuiz' },
        { courseId: 'grambearCourse', quizId: 'grambearQuiz' },
        { courseId: 'taletimeCourse', quizId: 'taletimeQuiz' },
        { courseId: 'taletimeCourse', quizId: 'taletimeQuiz2' },
        { courseId: 'storyCourse', quizId: 'storyQuiz' },
        { courseId: 'storyCourse', quizId: 'storyQuiz2' },
      ];
  
      let totalScore = 0;
      let totalItems = 0;
  
      for (const { courseId, quizId } of quizData) {
        const savedScore = await fetchQuizScore(user.$id, courseId, quizId); // Fetch existing score
  
        // Validate savedScore to ensure it has valid data
        if (savedScore && typeof savedScore.score === 'number' && typeof savedScore.total_items === 'number') {
          totalScore += savedScore.score;
          totalItems += savedScore.total_items;
        }
      }
  
      // Avoid division by zero
      const percentage = totalItems > 0 ? (totalScore / totalItems) * 100 : 0;
      setOverallPercentage(percentage);
    } catch (error) {
      console.error('Error calculating overall percentage:', error);
    }
  };
  
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

  

  // Handle option selection for each question
  const handleOptionSelect = (uniqueQuestionId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [uniqueQuestionId]: optionId }));
  };


  // Handle quiz submission
  const handleSubmit = async () => {
    if (Object.keys(selectedOptions).length !== randomizedQuestions.length) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      let totalScore = 0;

      randomizedQuestions.forEach((question) => {
        const selectedOption = question.options.find(
          (option) => option.id === selectedOptions[question.id]
        );
        if (selectedOption?.correct) {
          totalScore++;
        }
      });

      setScore(totalScore);
      await updateTestScore(user.accountId, 'post', totalScore);
      await updateTestCompletionStatus(user.accountId, 'post', true);
      await calculateOverallPercentage();

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

          {Object.keys(categories).map((category) => (
              <View key={category}>
                {randomizedQuestions
                  .filter((q) => q.category === category)
                  .map((question) => (
                    <View key={`${question.category}-${question.id}`} style={styles.questionContainer}>
                      <Text style={styles.question}>{question.text}</Text>
                      {question.options.map((option) => (
                        <TouchableOpacity
                          key={`${question.category}-${question.id}-${option.id}`}
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
              </View>
            ))}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
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
            <Text style={styles.modalText}>You scored {score}/{randomizedQuestions.length}</Text>
            <Text style={styles.modalOverallText}>You scored <Text style={styles.modalOverallBoldText}>{overallPercentage.toFixed(2)}%</Text> to your overall performance answering all the courses!</Text>
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
    marginTop: 10,
  },
  modalOverallBoldText: {
    fontFamily: 'Quicksand-Bold',
  },
  modalOverallText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 20,
    textAlign: 'center',
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
  categoryTitle: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
    color: '#c67b88',
  },
});

export default PostTestQuiz;
