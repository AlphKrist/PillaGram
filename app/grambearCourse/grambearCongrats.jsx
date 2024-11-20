import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const GrambearCongrats = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'grambearCourse';
  const lessonId = 'grambearCongrats';
  const startTimeRef = useRef(null);
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
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>

        <View style={styles.lessonContainer}>
          
          <Text style={styles.title}>CONGRATS!</Text>
          <Text style={styles.title2}>For completing GramBear!</Text>
          <Image source={designs.grambearpink} style={styles.treeImage} />

            <Link href="/(tabs)/time" style={styles.nextButton}>
              <View style={styles.nextButtonContent}>
                <Text style={styles.nextButtonText}>Back to Home</Text>
              </View>
            </Link>
            
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
    marginTop: 50,
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
    tintColor: "#c67b88",
    resizeMode: 'contain',
  },

  lessonContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 20,
    marginBottom: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 250,
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
  icon: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  treeImage: {
    width: 230,
    height: 230,
    resizeMode: 'contain',
    bottom: 10,
  },
  title: {
    fontSize: 36,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    textAlign: 'center',
    marginBottom: 20,
  },
  title2: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    textAlign: 'center',
    marginBottom: 20,
    bottom: 10,
  },
});

export default GrambearCongrats
