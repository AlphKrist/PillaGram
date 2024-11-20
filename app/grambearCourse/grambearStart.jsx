
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; // Using React Navigation for screen navigation
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const GrambearStart = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'grambearCourse';
  const lessonId = 'grambearStart';
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

  const handleNext = () => {
    navigation.navigate('grambearLesson'); // Navigates to the LessonScreen
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back button positioned at the top left of the screen */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content container */}
      <View style={styles.container}>
        {/* Row for image and "Lecture for Grammar" */}
        <View style={styles.row}>
          <Image
            source={designs.grambearpink} // Replace with actual bear image path
            style={styles.image}
          />
          <Text style={styles.title}>Lecture for Grammar</Text>
        </View>

        <Text style={styles.part}>Part 1</Text>
        <Text style={styles.subtext}>Verbs in the{"\n"}Past Tense</Text>
        <Link href="/grambearCourse/grambearLesson" style={styles.nextButton}>    
          <Text style={styles.nextButtonText}>Next</Text>
          </Link>
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
    backgroundColor: '#fff7f9',
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
    marginRight: 20,
    resizeMode: 'contain', // Space between image and text
  },
  title: {
    fontSize: 42,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c88276',
  },
  part: {
    fontSize: 80,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c88276',
    marginVertical: 5,
    marginTop: 80,
  },
  subtext: {
    fontSize: 32,
    fontFamily: 'BarlowSemiCondensed-Regular',
    color: '#c88276',
    marginBottom: 100,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 15,
    borderRadius: 40,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  nextButtonText: {
    fontSize: 48,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#FFFFFF',
  },
});

export default GrambearStart;
