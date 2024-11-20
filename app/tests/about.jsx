import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { designs } from '../../constants';
import { Link, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/GlobalProvider';

const About = () => {
  const navigation = useNavigation();
  const { user, darkMode } = useGlobalContext();
  return (
    <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
      <View style={styles.container}>
        <Image source={designs.design1} style={styles.appImage} />
        <Text style={darkMode ? styles.titleDark : styles.title}>PILLAGRAM</Text>
        <Text style={darkMode ? styles.subtitleDark : styles.subtitle}>Capstone Project Members</Text>
        
        <View style={darkMode ? styles.memberCardDark : styles.memberCard}>
          <View style={styles.row}>
            <Image source={designs.allan} style={styles.image} />
            <Text style={styles.memberName}>Allan Joseph Macalindong</Text>
          </View>
        </View>

        <View style={darkMode ? styles.memberCardDark : styles.memberCard}>
          <View style={styles.row}>
            <Image source={designs.shane} style={styles.image} />
            <Text style={styles.memberName}>Erika Shane De Leon</Text>
          </View>
        </View>

        <View style={darkMode ? styles.memberCardDark : styles.memberCard}>
          <View style={styles.row}>
            <Image source={designs.jandi} style={styles.image} />
            <Text style={styles.memberName}>Johndy Malenab</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={darkMode ? styles.backButtonDark : styles.backButton}>
          <Text style={darkMode ? styles.backButtonTextDark : styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffeff7', // Background color for SafeAreaView
  },
  safeAreaDark: {
    flex: 1,
    backgroundColor: '#2e375b', // Background color for SafeAreaView
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    marginBottom: 20,
  },
  titleDark: {
    fontSize: 36,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#d1d5fa',
    marginTop: 20,
  },
  subtitleDark: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#d1d5fa',
    marginBottom: 20,
  },
  membersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  memberCard: {
    backgroundColor: '#c67b88',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  memberCardDark: {
    backgroundColor: '#5c6898',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderColor: '#eac2cf',
    borderWidth: 2,
   
    resizeMode: 'contain',
  },
  memberName: {
    fontSize: 32,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#ffeff7',
  },
  backButton: {
    backgroundColor: '#eac2cf',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  backButtonDark: {
    backgroundColor: '#d1d5fa',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    fontSize: 24,
  },
  backButtonTextDark: {
    color: '#2e375b',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    fontSize: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 180,
   
  },
  appImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    bottom: -10,
  },
});

export default About;
