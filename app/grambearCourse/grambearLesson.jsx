import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite'; // Your Appwrite functions
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const GrambearLesson = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'grambearCourse';
  const lessonId = 'grambearLesson';
  const startTimeRef = useRef(null);

  // Fetch initial learning data and update progress if it's a new lesson
  useFocusEffect(
    React.useCallback(() => {
      // Start time tracking
      startTimeRef.current = Date.now();

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
        }
      };
    }, [user])
  );

  const handleNext = async () => {
    navigation.navigate('grambearQuiz'); // Navigates to the Quiz screen
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back button positioned at the top left of the screen */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content container */}
      <View style={styles.container}>
        {/* Row for image and "Understanding Past Tense Verbs" */}
        <View style={styles.row}>
          <Image
            source={designs.grambearpink} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={styles.title}>Understanding{"\n"}Past Tense Verbs</Text>
        </View>

        {/* Scrollable lesson content */}
        <View style={styles.lessonContainer}>
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.lessonText}>
                The <Text style={styles.highlight}>past tense</Text> is crucial for storytelling and recounting events that have already occurred.{"\n\n"}
                It allows us to convey actions that are completed, providing context and clarity.{"\n\n"}
                Here, we will explore the different forms of past tense verbs in more detail, with examples.{"\n\n"}
                <Text style={styles.lessonSubHeading}>1. Simple Past Tense</Text>{"\n\n"}
                The simple past tense describes actions that were completed at a specific time in the past. The structure is typically the base verb + -ed for regular verbs.{"\n\n"}
                <Text style={styles.highlight}>Regular Verbs:{"\n\n"}</Text>
                <Text style={styles.highlight}>Walk</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Walked: "She walked to the park yesterday."{"\n\n"}
                <Text style={styles.highlight}>Play</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Played: "They played soccer last weekend."{"\n\n"}
                <Text style={styles.highlight}>Irregular Verbs:{"\n\n"}</Text>
                <Text style={styles.highlight}>Go</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Went: "He went to the store."{"\n\n"}
                <Text style={styles.highlight}>Ate</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Ate: "We ate dinner at 7PM."{"\n\n"}
                <Text style={styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • Use the <Text style={styles.highlight}>simple past</Text> for <Text style={styles.highlight}>specific past events</Text>. 
                It's often accompanied by time expressions like yesterday, last week, or in 2010.{"\n\n"}
                <Text style={styles.lessonSubHeading}>2. Past Continuous Tense</Text>{"\n\n"}
                The past continuous tense indicates actions that were <Text style={styles.highlight}>ongoing</Text> at
                a specific time in the past. It is formed using <Text style={styles.highlight}>"was/were"</Text> 
                + the present participle (<Text style={styles.highlight}>-ing</Text> form
                of the verb).{"\n\n"}
                <Text style={styles.highlight}>Examples:</Text>{"\n\n"}
                "She was <Text style={styles.underline}>studying</Text> when I called her."{"\n\n"}
                "They were <Text style={styles.underline}>watching</Text> a movie at 8 PM."{"\n\n"}
                <Text style={styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • This tense is useful for setting the scene or describing background actions that were happening while another action occurred.{"\n\n"}
                <Text style={styles.lessonSubHeading}>3. Past Perfect Tense</Text>{"\n\n"}
                The past perfect tense is used to show that an action was <Text style={styles.highlight}>completed</Text> before 
                another action took place in the past. It is formed using <Text style={styles.highlight}>"had" + past participle.</Text>{"\n\n"}
                <Text style={styles.highlight}>Examples:</Text>{"\n\n"}
                "They <Text style={styles.underline}>had left</Text> the party before it started to rain."{"\n\n"}
                "She <Text style={styles.underline}>had finished</Text> her homework before going out."{"\n\n"}
                <Text style={styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • This tense helps clarify the sequence of events and is often used when discussing multiple actions in the past.{"\n\n"}
                <Text style={styles.summaryTitle}>Summary of Past Tense Forms</Text>
          </Text>

          <View style={styles.summaryContainer}>      
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryCellHeading}>Tense</Text>
                  <Text style={styles.summaryCellHeading}>Structure</Text>
                  <Text style={[styles.summaryCellHeading, styles.lastCell]}>Example</Text>
                </View>
                </View>
                <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryCell}>Simple Past</Text>
                  <Text style={styles.summaryCell}>Verb + -ed (or irregular)</Text>
                  <Text style={[styles.summaryCellHeading, styles.lastCell]}>"He ran to the store."</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryCell}>Past Continuous</Text>
                  <Text style={styles.summaryCell}>Was/Were + Verb-ing</Text>
                  <Text style={[styles.summaryCellHeading, styles.lastCell]}>"They were playing in the park."</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryCell}>Past Perfect</Text>
                  <Text style={styles.summaryCell}>Had + Past Participle</Text>
                  <Text style={[styles.summaryCellHeading, styles.lastCell]}>"She had seen that movie before."</Text>
                </View>
            </View>

        {/* Using Link to navigate to QuizScreen */}
        <Link href="/grambearCourse/grambearQuiz" style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Take Quiz</Text>
        </Link>
        </ScrollView>
      </View>
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
    backgroundColor: '#eac2cf',
    borderRadius: 10,
    zIndex: 10, // Ensure it's above the content
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
    marginTop: 100,
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
  lessonContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  lessonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 10,
    marginTop: -5,
    margin: 10,
  },
  highlight: {
    fontFamily: 'Quicksand-Bold',
  },
  underline: {
    fontFamily: 'Quicksand-Regular',
    textDecorationLine: 'underline',
  },
  lessonSubHeading: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#c67b88',
    marginTop: 15,
    marginBottom: 5,
    margin: 10,
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  nextButtonContent: {
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center', // Vertically center them
  },
  nextButtonText: {
    fontSize: 25,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#fff',
  },
  nextButtonIcon: {
    marginLeft: 10, // Add some space between the text and the icon
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#eac2cf',
    padding: 10,
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    flex: 1,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#ffe8f0',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#5C6898',
  },
  summaryFirstRow: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#e7feff',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#5C6898',
    borderWidth: 1,
  },
  summarySecondRow: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#ffe8f0',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#5C6898',
    borderWidth: 1,
  },
  summaryThirdRow: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#fff2d5',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#5C6898',
    borderWidth: 1,
  },
  summaryCellHeading: {
    flex: 1,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    textAlign: 'center',
    color: '#c67b88',
    height: "125%",
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#c67b88',
    paddingVertical: 5,
    textAlignVertical: 'center',
  },
  summaryCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'BarlowSemiCondensed-Medium',
    color: '#c67b88',
    height: "115%",
    borderRightWidth: 1,
    borderRightColor: '#c67b88',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'center',
  },
  lastCell: {
    borderRightWidth: 0, // No border on the last cell
  },
});

export default GrambearLesson;
