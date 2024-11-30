import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const MothgramLesson = () => {
    const navigation = useNavigation();
    const { user, darkMode } = useGlobalContext();
    const courseId = 'mothgramCourse';
    const lessonId = 'mothgramLesson';
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
      navigation.navigate('mothgramQuiz'); // Navigates to the quiz screen
    };
  
    return (
      <SafeAreaView style={darkMode ? styles.wrapperDark : styles.wrapper}>
        {/* Back button positioned at the top left of the screen */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={darkMode ? styles.backButtonDark : styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
  
        {/* Main content container */}
        <View style={darkMode ? styles.containerDark : styles.container}>
          {/* Row for image and "Story" heading */}
          <View style={styles.row}>
            <Image
              source={darkMode ? designs.mothgram : designs.mothgrampink} // Replace with the bear image path
              style={styles.image}
            />
            <Text style={darkMode ? styles.titleDark : styles.title}>MothGram</Text>
          </View>
  
          {/* Scrollable lesson content */}
          <View style={darkMode ? styles.lessonContainerDark : styles.lessonContainer}>
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.bulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}></Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Why Use Past Tense in Narrative Text?</Text>
                </Text>
              </View>

              <View style={styles.bulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>1.</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Temporal Clarity</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Using the past tense provides a clear indication that the events being described are complete and occurred before the present moment. 
                This helps readers understand the timeline of the story.
                </Text>
              </View>
  
              <View style={styles.bulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>2.</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Engagement</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Past tense can evoke a sense of nostalgia and reflection, drawing readers into the story as they visualize events that have already transpired.
                </Text>
              </View>
  
              <View style={styles.bulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>3.</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Character Development</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
                <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
                <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Writing in the past tense allows writers to reveal characters’ histories and backgrounds, providing context for their actions and motivations.
                </Text>
              </View>
  
              <Link href="/mothgramCourse/mothgramQuiz" style={darkMode ? styles.nextButtonDark : styles.nextButton}>
                <View style={styles.nextButtonContent}>
                  <Text style={styles.nextButtonText}>Take Quiz</Text>
                </View>
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
      backgroundColor: '#ffeff7',
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
    containerDark: {
      flex: 1,
      padding: 20,
      backgroundColor: '#5C6898',
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
      justifyContent: 'space-between',
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
      fontSize: 36,
      fontFamily: 'BarlowSemiCondensed-ExtraBold',
      color: '#c67b88',
      textAlign: 'left',
    },
    titleDark: {
      fontSize: 36,
      fontFamily: 'BarlowSemiCondensed-ExtraBold',
      color: '#d1d5fa',
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
    },
    lessonContainerDark: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: '#d1d5fa',
      padding: 20,
      marginBottom: 5,
    },
    scrollContainer: {
      flex: 1,
    },
    lessonSubHeading: {
      fontSize: 20,
      fontFamily: 'BarlowSemiCondensed-Bold',
      color: '#5C6898',
      marginBottom: 5,
      margin: 10,
    },
    lessonSubHeadingDark: {
      fontSize: 20,
      fontFamily: 'BarlowSemiCondensed-Bold',
      color: '#5C6898',
      marginBottom: 5,
      margin: 10,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 5,
    },
    nestedBulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 5,
      paddingLeft: 20, // Add indent for nested bullets
    },
    bullet: {
      fontSize: 18,
      color: '#c88276',
      marginRight: 10, // Space between bullet and text
      marginLeft: 10,
    },
    bulletDark: {
      fontSize: 18,
      color: '#5C6898',
      marginRight: 10, // Space between bullet and text
      marginLeft: 10,
    },
    bulletText: {
      fontSize: 18,
      fontFamily: 'Quicksand-Regular',
      color: '#c88276',
      flexShrink: 1,
      marginBottom: 10,
      marginTop: -3,
      marginRight: 15,
      marginLeft: -5,
    },
    bulletTextDark: {
      fontSize: 18,
      fontFamily: 'Quicksand-Regular',
      color: '#5C6898',
      flexShrink: 1,
      marginBottom: 10,
      marginTop: -3,
      marginRight: 15,
      marginLeft: -5,
    },
    highlight: {
      fontFamily: 'Quicksand-Bold',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    nextButton: {
      backgroundColor: '#eac2cf',
      padding: 10,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 20,
      alignSelf: 'center',
      width: 200,
    },
    nextButtonDark: {
      backgroundColor: '#5C6898',
      padding: 10,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 20,
      alignSelf: 'center',
      width: 200,
    },
    nextButtonContent: {
      alignSelf: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    nextButtonText: {
      fontSize: 24,
      fontFamily: 'BarlowSemiCondensed-ExtraBold',
      color: '#ffeff7',
      alignSelf: 'center',
      textAlign: 'center',
    },
    nextButtonIcon: {
      marginLeft: 10,
    },
  });
export default MothgramLesson