import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants'; // Ensure designs object contains your image paths
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';

const TaletimeLesson3 = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'taletimeCourse';
  const lessonId = 'taletimeLesson3';
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

  
  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.row}>
          <Image
            source={designs.dolphin} // Replace with your specific image path
            style={styles.icon}
          />
          <Text style={styles.title}>The Forgotten Garden</Text>
        </View>

        <View style={styles.storyContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.paragraph}>
            Emily had always heard stories about her grandmother’s garden, a place filled with flowers that bloomed in every color imaginable.{"\n\n"}
            One sunny afternoon, she decided to explore the overgrown yard behind her grandmother’s old house. {"\n\n"}
            As she pushed aside the tangled vines and tall weeds, a sense of nostalgia washed over her.{"\n\n"}
            Suddenly, she stumbled upon a small gate, barely visible beneath the thick foliage. Curious, she opened it and stepped inside. {"\n\n"}
            To her amazement, the garden was more beautiful than she had ever imagined. Vivid blossoms danced in the gentle breeze, and the sweet fragrance of jasmine filled the air.{"\n\n"}
            In the center, an ancient fountain sparkled in the sunlight, its water trickling melodiously.{"\n\n"}
            Emily felt a surge of happiness as she wandered through the garden, discovering hidden paths and secret nooks.{"\n\n"}
            It was as if she had uncovered a treasure trove of memories, each flower whispering stories of her family’s past.{"\n\n"}
            She knew that this magical place was a piece of her heritage, waiting to be cherished once more.{"\n"}
            </Text>

            <Link href="/taletimeCourse/taletimeb4quiz2" style={styles.nextButton}>
              <View style={styles.nextButtonContent}>
                <Text style={styles.nextButtonText}>Next</Text>
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
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  storyContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 20,
    marginBottom: 5,
   
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#eac2cf',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  paragraph: {
    fontSize: 22,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    textAlign: 'left',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  storyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: 200,
    bottom: 10,
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#fff',
  },
  nextButtonIcon: {
    marginLeft: 10,
  },
});
export default TaletimeLesson3
