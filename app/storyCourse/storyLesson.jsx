
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const StoryLesson = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'storyCourse';
  const lessonId = 'storyLesson';
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
    navigation.navigate('storyQuiz'); // Navigates to the quiz screen
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back button positioned at the top left of the screen */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content container */}
      <View style={styles.container}>
        {/* Row for image and "Story" heading */}
        <View style={styles.row}>
          <Image
            source={designs.bookpink} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={styles.title}>Story</Text>
        </View>

        {/* Scrollable lesson content */}
        <View style={styles.lessonContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.lessonSubHeading}>1. Characters</Text>

            {/* Bullet Point 1 */}
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Characters are the individuals involved in the narrative. They can be people, animals, or even inanimate objects that take on personality traits.
              </Text>
            </View>

            {/* Bullet Point 2 */}
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Types:</Text>
              </Text>
            </View>

            {/* Nested Bullet */}
            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Protagonist </Text>- The main character around <Text style={styles.underline}>whom the story revolves</Text>. 
                Example: Harry Potter in J.K. Rowling's series.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Antagonist </Text>- The character who <Text style={styles.underline}>opposes the protagonist</Text>. 
                Example: Voldemort in J.K. Rowling's series.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Development</Text> - Characters should have depth and evolve throughout the story. 
                Their experiences, challenges, and growth are crucial for reader connection.
              </Text>
            </View>

            <Text style={styles.lessonSubHeading}>2. Setting</Text>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
              The setting refers to the time and place where the story occurs. It 
              provides context and backdrop for the narrative.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Elements:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Time </Text>- When does the story take place? Is 
                it in the past, present, or future? Is it a specific time of year, day, or era?
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Place </Text>- Where does the story happen? This can range 
                from a specific location (e.g., a school, a forest) to broader settings (e.g., a small town, a distant planet).
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Importance</Text> - A well-crafted setting can 
                enhance the mood and help readers visualize the story.
              </Text>
            </View>

            <Text style={styles.lessonSubHeading}>3. Plot</Text>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
              The plot is the sequence of events that make up the story. It 
              typically follows a structured framework.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Structure:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Exposition </Text>- Introduces characters, setting, and background information.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Rising Action </Text>- The series of events that 
                create tension and develop the conflict.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Rising Action </Text>- The series of events that 
                create tension and develop the conflict.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Climax </Text>- The turning point or most intense moment in the story.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Falling Action </Text>- The events following the climax, leading toward resolution.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Resolution </Text>- The conclusion of the story where conflicts are resolved. 
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Example:</Text> In "Cinderella," the plot includes her hardship, the ball, the loss of the glass slipper, 
                and the eventual happy ending.
              </Text>
            </View>

            <Text style={styles.lessonSubHeading}>4. Conflict</Text>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
              Conflict is the struggle between opposing forces, which drives the narrative forward.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Types:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Internal Conflict </Text>- Struggles within a character (e.g., fear, decision-making).
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>External Conflict </Text>- Struggles between a character and external 
                forces (e.g., society, nature, another character).
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Role in Narrative </Text>- Conflict is essential for character development and 
                maintaining reader interest. It creates suspense and engages readers emotionally.
              </Text>
            </View>

            <Text style={styles.lessonSubHeading}>5. Theme</Text>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
              The theme is the central idea or underlying <Text style={styles.highlight}>message</Text> of the <Text style={styles.highlight}>narrative</Text>.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Example:</Text> Common themes include love, friendship, betrayal, courage, and the struggle between good and evil.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Importance</Text> - A strong theme resonates with readers and encourages them to reflect on their own experiences.
              </Text>
            </View>

            <Link href="/storyCourse/storyQuiz" style={styles.nextButton}>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    paddingHorizontal: 45,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 48,
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
  lessonSubHeading: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#c67b88',
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
    color: '#c67b88',
    marginRight: 10, // Space between bullet and text
    marginLeft: 10,
  },
  bulletText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    flexShrink: 1,
    marginBottom: 10,
    marginTop: -3,
    marginRight: 15,
  },
  highlight: {
    fontFamily: 'Quicksand-Bold',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
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

export default StoryLesson;
