import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import designs from '../../constants/designs';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalContext } from '../../context/GlobalProvider';

const StoryBeforeQuiz2 = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const courseId = 'storyCourse';
  const lessonId = 'storyBeforeQuiz2';
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
            const progressIncrement = isNewLesson ? 12 : 0; // Increment by 10% if this is a new lesson
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Question Mark Image */}
      <Image
        source={designs.bookpink} // Make sure this image matches the uploaded one
        style={styles.image}
      />
      
      {/* Text */}
      <Text style={styles.title}>Questions about the Narrative Text</Text>
      
      {/* Start Button */}
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push("/storyCourse/storyQuiz2")} // Navigate to the quiz screen
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
      
      {/* Not Now Button */}
      <TouchableOpacity 
        style={styles.notNowButton}
        onPress={() => router.push("/storyCourse/storyLesson2")} // Navigate to the lesson screen
      >
        <Text style={styles.buttonText}>Not now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeff7', // Pinkish background
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 42,
    color: '#c67b88', // Pinkish text color
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    textAlign: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#f8adba', // Button color
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
    width: 220,
  },
  notNowButton: {
    backgroundColor: '#f8adba', // Same button color as start
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    width: 220,
  },
  buttonText: {
    fontSize: 34,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#fff', // White text for buttons
    textAlign: 'center',
  },
});

export default StoryBeforeQuiz2;
