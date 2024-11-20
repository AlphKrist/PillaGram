import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { designs } from '../../constants'; // Assuming you have the designs
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';

const TaletimeStart = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'taletimeCourse';
  const lessonId = 'taletimeStart';
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
            const progressIncrement = isNewLesson ? 10 : 0; // Increment by 10% if this is a new lesson
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
    navigation.navigate('taletimeLesson'); // Navigate to the lesson screen
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back button positioned at the top left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.container}>
        {/* Lecture title */}
        <Text style={styles.title}>Lecture for Grammar</Text>

        {/* Whale icon */}
        <Image source={designs.dolphin} style={styles.icon} />

        {/* Description */}
        <Text style={styles.description}>
          Short Lecture on{"\n"}
          Context Clues in{"\n"}Reading Narrative Texts
        </Text>

        {/* Cloud icons */}
        <View style={styles.cloudContainer}>
          <Image source={designs.divider} style={styles.cloudIcon} />
        </View>

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
    backgroundColor: '#FFE6F2', // Light pink background
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
    
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    top: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c88276',
    textAlign: 'center',
    marginBottom: 10,
    top: 50,
  },
  description: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c88276',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 30,
    top: 90,
  },
  highlight: {
    fontFamily: 'Quicksand-Bold',
  },
  cloudContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cloudIcon: {
    width: 200,
    height: 50,
    top: 100,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 10,
    borderRadius: 15,
    top: 150,
    width: 200,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
  nextButtonText: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#FFFFFF',
  },
});

export default TaletimeStart;
