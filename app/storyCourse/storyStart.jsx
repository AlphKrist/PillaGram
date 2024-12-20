
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { designs } from '../../constants';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';


const StoryStart = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'storyCourse';
  const lessonId = 'storyStart';
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

  const handleNext = () => {
    navigation.navigate('storyLesson'); // Navigate to the lesson screen
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back button positioned at the top left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.container}>
        {/* Icon and Lecture Title */}
        <Image source={designs.bookpink} style={styles.icon} />
        <Text style={styles.title}>Lecture on{"\n"}Narrative Text</Text>

        {/* Description */}
        <Text style={styles.description}>
          <Text style={styles.highlight}>Narrative Text</Text> is a form of writing that tells a story. It can be fictional or non-fictional and is characterized by 
          a <Text style={styles.highlight}>structured plot</Text>, characters, and a specific setting.{"\n\n"}Narratives are powerful tools in communication, allowing writers 
          to <Text style={styles.highlight}>engage</Text> readers by presenting experiences in 
          an <Text style={styles.highlight}>entertaining</Text> and <Text style={styles.highlight}>relatable</Text> way.
        </Text>

        {/* Next button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
    zIndex: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 100,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#fff7f9',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c88276',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    fontFamily: 'Quicksand-Regular',
    color: '#c88276',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 20,
  },
  highlight: {
    fontFamily: 'Quicksand-Bold',
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 5,
    borderRadius: 15,
    width: 150,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#FFFFFF',
  },
});

export default StoryStart;
