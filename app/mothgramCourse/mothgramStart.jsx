import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { designs } from '../../constants';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';

const MothgramStart = () => {
  const navigation = useNavigation();
  const { user, darkMode } = useGlobalContext();
  const courseId = 'mothgramCourse';
  const lessonId = 'mothgramStart';
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
    navigation.navigate('mothgramLesson'); // Navigate to the lesson screen
  };

  return (
    <SafeAreaView style={darkMode ? styles.wrapperDark : styles.wrapper}>
      {/* Back button positioned at the top left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={darkMode ? styles.backButtonDark : styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={darkMode ? styles.containerDark : styles.container}>
        {/* Icon and Lecture Title */}
        <Image source={darkMode ? designs.mothgram : designs.mothgrampink} style={styles.icon} />
        <Text style={darkMode ? styles.titleDark : styles.title}>Why do we use Past Tense in Narrative Texts?</Text>

        {/* Description */}
        <Text style={darkMode ? styles.descriptionDark : styles.description}>
        In narrative writing, the past tense is commonly used to tell stories. This allows writers to describe events that have already happened, 
        helping readers engage with the plot and characters. 
        Understanding how to effectively use the past tense is essential for crafting compelling narratives.
        </Text>

        {/* Next button */}
        <TouchableOpacity onPress={handleNext} style={darkMode ? styles.nextButtonDark : styles.nextButton}>
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
  wrapperDark: {
    flex: 1,
    backgroundColor: '#2e375b',
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
  backButtonDark: {
    position: 'absolute',
    top: 45,
    left: 20,
    padding: 10,
    backgroundColor: '#5C6898',
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
    justifyContent: 'center',
  },
  containerDark: {
    flex: 1,
    padding: 20,
    marginTop: 100,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#d1d5fa',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
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
  titleDark: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#5C6898',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionDark: {
    fontSize: 20,
    fontFamily: 'Quicksand-Regular',
    color: '#5C6898',
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
  nextButtonDark: {
    backgroundColor: '#5C6898',
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

export default MothgramStart;
