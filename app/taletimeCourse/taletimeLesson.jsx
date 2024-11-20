import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite'; // import necessary functions
import { useGlobalContext } from '../../context/GlobalProvider'; // assuming you have a global state to access user data
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const TaletimeLesson = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const courseId = 'taletimeCourse';
  const lessonId = 'taletimeLesson';
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
    navigation.navigate('taletimeb4read'); // Navigates to the quiz screen
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
            source={designs.dolphin} // Replace with the bear image path
            style={styles.image}
          />
          <Text style={styles.title}>Context Clues</Text>
        </View>

        {/* Scrollable lesson content */}
        <View style={styles.lessonContainer}>
          <ScrollView style={styles.scrollContainer}>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}></Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>CONTEXT CLUES</Text> are hints or information within a text that help readers understand the meaning of unfamiliar words or phrases.{"\n\n"}
                In narrative texts, context clues play a crucial role in enhancing comprehension and enriching the reading experience
              </Text>
            </View>

            {/* Bullet Point 2 */}
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}></Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Types of Context Clues</Text>
              </Text>
            </View>

            {/* Nested Bullet */}
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Synonyms</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              A word or phrase with a similar meaning is used in the sentence, helping to clarify the unfamiliar word.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Example: “The puppy was frightened, or scared, by the loud noise.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Antonyms</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              A word or phrase with the opposite meaning can provide insight into the unfamiliar term.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Example: “Unlike her timid brother, Mia was quite bold in exploring the forest.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Definitions</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              The unfamiliar word is explained directly within the sentence.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Example: “The enchantment (a magical spell) in the forest captivated everyone who entered.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Examples</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Specific examples can help clarify the meaning of a word.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Example: “The forest was home to many creatures, such as deer, rabbits, and foxes.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.highlight}>Inferences</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Readers can deduce meanings based on their understanding of the overall context and their own experiences.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
              <Text style={styles.bullet}>○</Text>
              <Text style={styles.bulletText}>
              Example: “After the storm, the streets were covered in debris, and the townspeople mourned for the damage done.” (Here, “mourned” implies sadness.)
              </Text>
            </View>

            <Link href="/taletimeCourse/taletimeb4read" style={styles.nextButton}>
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
  title: {
    fontSize: 36,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',

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

export default TaletimeLesson;
