
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants'; // Ensure designs object contains your image paths
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const StoryLesson2 = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'storyCourse';
  const lessonId = 'storyLesson2';
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
    <SafeAreaView style={styles.wrapper}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.row}>
          <Image
            source={designs.bookpink} // Replace with your specific image path
            style={styles.icon}
          />
          <Text style={styles.title}>The Unexpected Journey</Text>
        </View>

        <View style={styles.storyContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.paragraph}>
              One rainy afternoon, Emily was sitting in her room, staring out the window.{"\n\n"}
              The raindrops danced down the glass, creating a blur of the world outside.{"\n\n"}
            Feeling restless, she decided to take a walk to clear her mind. 
            </Text>
      
            <Text style={styles.paragraph}>
            She pulled on her boots and grabbed her umbrella, hoping the rain would let up. 
            </Text>

            <Text style={styles.paragraph}>
            As she walked through the park, the sky began to darken even more, and a rumble of thunder echoed in the distance.  
            </Text>

            <Text style={styles.paragraph}>
            Just as she was about to turn back, she noticed something shiny near the old oak tree. Curiosity piqued.
            </Text>

            <Text style={styles.paragraph}>
            Emily walked over to investigate. To her surprise, she found a small, ornate key lying in the mud.
            </Text>     

            <Text style={styles.paragraph}>
            Intrigued, she picked it up and examined it closely.
            </Text>

            <Text style={styles.paragraph}>
            It was unlike any key she had ever seen, with intricate designs carved into its surface. Without thinking, she decided to look for what the key might unlock.
            </Text>

            <Text style={styles.paragraph}>
            As she wandered deeper into the park, she stumbled upon a hidden gate covered in vines. The gate looked ancient, and Emily's heart raced with excitement.
            </Text>

            <Text style={styles.paragraph}>
            With trembling hands, she inserted the key into the lock.
            </Text>

            <Text style={styles.paragraph}>
            To her amazement, it turned smoothly, and the gate creaked open
            </Text>

            <Text style={styles.paragraph}>
            Beyond it lay a beautiful, enchanted garden filled with vibrant flowers and glowing lights. 
            </Text>

            <Text style={styles.paragraph}>
            Emily stepped through the gate, feeling as though she had entered a different world. 
            </Text>

            <Text style={styles.paragraph}>
            Little did she know, this unexpected journey would change her life forever.
            </Text>

            <Link href="/storyCourse/storyBeforeQuiz2" style={styles.nextButton}>
              <View style={styles.nextButtonContent}>
                <Text style={styles.nextButtonText}>Take Quiz</Text>
                <Icon name="send" size={15} color="#fff" style={styles.nextButtonIcon} />
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
    color: '#c67b88',
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
  // Custom positions for images
  customImagePosition1: {
    marginLeft: 40, 
    marginTop: 30,  
    resizeMode: 'contain',
    width: 100,
    height: 70,
  },
  customImagePosition2: {
    marginRight: 20, 
    marginBottom: 15,
    marginLeft: 20,
    marginTop: 40,
    resizeMode: 'contain', 
    width: 50,
    height: 50,
  },
  customImagePosition3: {
    resizeMode: 'contain', 
    width: 80,
    height: 80,
    marginRight: 30,
  },
  customImagePosition4: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  customImagePosition5: {
    marginLeft: 20, // Move left image slightly
    marginTop: 10,
  },
  customImagePosition6: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  customImagePosition7: {
    marginRight: 20, // Move right image slightly
    marginTop: 10,
    resizeMode: 'contain',
    width: 80,
    height: 80,
    bottom: 40,
  },
  customImagePosition8: {
    marginLeft: 20, // Move left image slightly
    marginTop: 10,
    resizeMode: 'contain',
    left: 10,
  },
  customImagePosition9: {
    marginLeft: 20, // Move left image slightly
    marginTop: 60,
    resizeMode: 'contain',
    width: 60,
    height: 60,
  },
  customImagePosition10: {
    marginRight: 10, // Move right image slightly
    marginTop: 10,
    resizeMode: 'contain',
    width: 120,
    height: 120,
  },
  customImagePosition11: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: -20,
    width: 150,
    height: 150,
  },
  customImagePosition12: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: -30,
    marginRight: 20,
    width: 120,
    height: 120,
  },
  customImagePosition13: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 60,
    right: 20,
    top: 20,
    width: 80,
    height: 80,
  },
  customImagePosition14: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 20,
    width: 150,
    height: 150,
  },
  customImagePosition15: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 20,
    width: 250,
    height: 250,
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: 200,
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

export default StoryLesson2;
