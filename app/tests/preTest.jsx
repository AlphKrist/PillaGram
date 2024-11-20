import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { Link, router} from 'expo-router';
import { useNavigation } from '@react-navigation/native';
const PreTest = () => {
    const navigation = useNavigation();
    const handleNextPress = () => {
      router.push('/tests/preTestQuiz');
  };
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>

        <View style={styles.lessonContainer}>
        <View style={styles.row}>
        <Text style={styles.title}>Welcome to Pillagram!</Text>
          <Image
            source={designs.pretest} // Replace with actual bear image path
            style={styles.image}
          />
        </View>
        <Text style={styles.lessonText}>
        Before we get started, we would like to introduce our pre-test assessment.{"\n\n"}
        This short quiz is designed to help us understand what you already know about today's topic and guide us in making the session more meaningful for you.{"\n\n"}
        Don't worry—this is just a warm-up and won't affect your final score. So, relax and do your best!{"\n"}
          </Text>
          <Text style={styles.title2}>Let's dive in and get started!</Text>
          <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
            <View style={styles.nextButtonContent}>
              <Text style={styles.nextButtonText}>Next</Text>
            </View>
          </TouchableOpacity>       
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
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    marginLeft: 10,
    bottom: 5,
    resizeMode: 'contain',
  },

  lessonContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 20,
    margin: 10,
    alignItems: 'center',
   
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
  lessonText: {
    fontSize: 19,
    fontFamily: 'Quicksand-Bold',
    color: '#c88276',
    marginBottom: 10,
    marginTop: -5,
    margin: 10,
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
    width: 220,
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
    textAlign: 'left',
    marginBottom: 20,
  },
  title2: {
    fontSize: 22,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    textAlign: 'center',
    bottom: 10,
  },
});

export default PreTest

