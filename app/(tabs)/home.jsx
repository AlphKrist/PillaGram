import { StyleSheet, ScrollView, View, Text, RefreshControl, TouchableOpacity, Image, FlatList, Animated, ImageBackground } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { designs } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Link, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { updateTestCompletionStatus } from '../../lib/appwrite';
import Pinkstar2SVG from "../../assets/designs/pinkStar2SVG.svg";
import Star2SVG from "../../assets/designs/star2SVG.svg";
import { Svg, Mask, Rect } from 'react-native-svg';

const Home = () => {
  const { 
    user: globalUser, darkMode, 
    isPreTestCompleted, setIsPreTestCompleted, 
    isPostTestCompleted, setIsPostTestCompleted, 
    isImageContainerLocked, setIsImageContainerLocked, 
    isPostTestLocked, setIsPostTestLocked, 
    progress, setProgress,
    fetchUserData 
  } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const { data: userData, loading, refetch } = useAppwrite(async () => globalUser);

  const postTestLockOpacity = useRef(new Animated.Value(progress === 100 ? 0 : 1)).current;
  const imageContainerLockOpacity = useRef(new Animated.Value(isPostTestCompleted ? 0 : 1)).current;

  const animateLockUnlock = (opacityRef, isCompleted) => {
    Animated.timing(opacityRef, {
      toValue: isCompleted ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchUserData(); 
  }, []);

  useEffect(() => {
    const isCompleted = progress === 100 || isPostTestCompleted;
    setIsPostTestLocked(!isCompleted); 
    animateLockUnlock(postTestLockOpacity, isCompleted);
  }, [progress, isPostTestCompleted]);

  useEffect(() => {
    if (isPostTestCompleted) {
      setIsPostTestLocked(true);
      setIsImageContainerLocked(false);
    }
    animateLockUnlock(postTestLockOpacity, isPostTestCompleted || progress === 100);
    animateLockUnlock(imageContainerLockOpacity, isPostTestCompleted);
  }, [isPostTestCompleted]);


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (!isPostTestCompleted) {
        refetch();
      }
    }, [isPostTestCompleted])
  );

  return (
    <SafeAreaView className="h-full" style={darkMode ? {backgroundColor: "#2e375b"} : {backgroundColor: "#ffeff7"}}>
      <FlatList
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <View className="flex flex-row items-center mb-6">
              <Image source={designs.design1} className="w-14 h-14 mr-3" resizeMode="contain" />
              <View>
                <Text className="font-bbold text-2xl" style={darkMode ? {color: "#d1d5fa"} : {color: "#c67b88"}}>
                  Welcome,
                </Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={darkMode ? styles.usernameDark : styles.username}>
                  {globalUser?.username}!
                </Text>
              </View>
            </View>

            <Animated.View style={[darkMode ? styles.imageContainerDark : styles.imageContainer]}>
              <View style={styles.leftContainer}>
                <Text style={darkMode ? styles.readifyTextDark : styles.readifyText}>Readify</Text>
                <TouchableOpacity style={darkMode ? styles.pdfButtonDark : styles.pdfButton} onPress={() => router.push('/tests/read')}>
                  <Text style={darkMode ? styles.pdfButtonTextDark : styles.pdfButtonText}>READ</Text>
                </TouchableOpacity>
              </View>
              
              <Image source={darkMode ? designs.bookdark : designs.booklight} style={styles.image} resizeMode="contain" />
              
              {isImageContainerLocked && (
              <Animated.View style={styles.lockOverlay}>
              <Icon name="lock-closed" size={40} color={darkMode ? "#d1d5fa" : "#ffeff7"} />
              </Animated.View>
              )}
            </Animated.View>

            <View style={styles.starsContainer}>
              <TouchableOpacity
                style={[styles.starButton, styles.star1Container]}
                onPress={() => router.push('/tests/preTest')}
                disabled={isPreTestCompleted}
              >
                <Image source={darkMode ? designs.star1 : designs.pinkstar1} style={styles.star1} />
                {isPreTestCompleted ? (
                  <Icon name="checkmark" size={64} color={darkMode ? "#2e375b" : "#ffe8f0"} style={styles.checkIcon} />
                ) : (
                  <Text style={darkMode ? styles.star1TextDark : styles.star1Text}>Pre-Test</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.starButton, styles.star2Container]}
                onPress={() => router.push('/tests/postTest')}
                disabled={isPostTestCompleted || isPostTestLocked || progress !== 100}
              >
                {darkMode ? <Star2SVG style={styles.starImage} /> : <Pinkstar2SVG style={styles.starImage} />}
                {isPostTestCompleted ? (
                  <Icon name="checkmark" size={64} color={darkMode ? "#2e375b" : "#ffe8f0"} style={styles.checkPostIcon} />
                ) : (
                  <>
                    {progress < 100 && (
                      <Svg style={styles.lockOverlayContent}>
                        <Mask id="starMask">
                          {darkMode ? <Star2SVG /> : <Pinkstar2SVG />}
                        </Mask>
                        <Rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.5)" mask="url(#starMask)" />
                      </Svg>
                    )}
                    <Text style={darkMode ? styles.star2TextDark : styles.star2Text}>Post-Test</Text>
                    <Animated.View style={[styles.lockOverlayContent, { opacity: postTestLockOpacity }]}>
                      {isPostTestLocked && (
                        <View style={styles.lockIconPostContainer}>
                          <Icon name="lock-closed" size={40} color={darkMode ? "#d1d5fa" : "#ffeff7"} />
                        </View>
                      )}
                    </Animated.View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.starButton, styles.star3Container]}
                onPress={() => router.push('/tests/about')}
              >
                <Image source={darkMode ? designs.aboutdark : designs.pinkstar3} style={styles.star3} />
                <Text style={darkMode ? styles.star3TextDark : styles.star3Text}>About</Text>
              </TouchableOpacity>
              <Image
            source={designs.sticks1}
            style={darkMode ? styles.sticks1Dark : styles.sticks1}
          />

          <Image
            source={designs.sticks2}
            style={darkMode ? styles.sticks2Dark : styles.sticks2}
          />

          <Image
            source={darkMode ? designs.upstars : designs.upstars1}
            style={styles.upstars}
          />
          <Image
            source={darkMode ? designs.downstars : designs.downstars1}
            style={styles.downstars}
          />
          <Image
            source={darkMode ? designs.twinkle : designs.twinkle1}
            style={styles.twinkle}
          />
          <Image
          source={designs.design5}
          style={darkMode ? styles.bubblesDark : styles.bubbles}
          />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#c67b88',
    borderRadius: 10,
    flexDirection: 'row', // Use flexbox to arrange items horizontally
    justifyContent: 'space-between', // Distribute items evenly with spacing
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
    // Adjust spacing as needed
  },

  imageContainerDark: {
    backgroundColor: '#5c6898',
    borderRadius: 10,
    flexDirection: 'row', // Use flexbox to arrange items horizontally
    justifyContent: 'space-between', // Distribute items evenly with spacing
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
    // Adjust spacing as needed
  },
  leftContainer: {
    alignItems: 'left', // Center items vertically
  },
  username: {
    fontSize: 40,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#c67b88",
    maxWidth: "80%",
  },
  usernameDark: {
    fontSize: 40,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#e3e3ff",
    maxWidth: "80%",
  },
  image: {
    width: 150, // Adjust image width as needed
    height: 110,
    marginRight: 10, // Adjust image height as needed
     // Adjust spacing as needed
  },
  pdfButton: {
    backgroundColor: '#ffe8f0', // Replace with your desired button color
    borderRadius: 10,
    padding: 5,
    width: 90,
    height: 50,
    alignItems: 'center',
    marginTop: 10, // Adjust spacing as needed
  },
  pdfButtonDark: {
    backgroundColor: '#f9e7e5', // Replace with your desired button color
    borderRadius: 10,
    padding: 5,
    width: 90,
    height: 50,
    alignItems: 'center',
    marginTop: 10, // Adjust spacing as needed
  },
  pdfButtonText: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88', // Replace with your desired text color
  },
  pdfButtonTextDark: {
    fontSize: 30,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#5c6898', // Replace with your desired text color
  },
  readifyText: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: -15,
    color: '#ffe8f0',
    fontFamily: 'BarlowSemiCondensed-Bold',
     // Replace with your desired text color
  },
  readifyTextDark: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: -15,
    color: '#ffffff',
    fontFamily: 'BarlowSemiCondensed-Bold',
     // Replace with your desired text color
  },
  readablesText: {
    fontSize: 12,
    fontFamily: 'PPTelegraf-Regular',
    color: '#c67b88', // Replace with your desired text color
  },
  starsContainer: {
    position: 'relative',
    height: 400,
  },
  starButton: {
    position: 'absolute', // Ensures that the button doesn’t affect the image layout
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', 
    position: 'absolute', 
  },
  star1Container: {
    top: 20,
    left: 20,
  },
  star2Container: {
    top: 70,
    left: 190, // Position for the second star
  },
  star3Container: {
    top: 210,
    left: 90,  // Position for the third star
  },
  starImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  starText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#2e375b', // Adjust based on your design
    position: 'absolute',
    top: '40%', // Center text vertically within the button
    width: '100%',
  },
  star1: {
    position: 'absolute', // Keeps the position intact
    top: -10, // Same position as before
    left: -20, // Same position as before
    width: 180,  // Adjust width
    height: 180, // Adjust height
    resizeMode: 'contain',
  },
  star2: {
    position: 'absolute',
    top: 0,  // Same position as before
    left: 0, // Same position as before
    width: 150,  // Adjust width
    height: 150, // Adjust height
    resizeMode: 'contain',
  },
  star3: {
    position: 'absolute',
    top: 10, // Same position as before
    left: 20,  // Same position as before
    width: 150,  // Adjust width
    height: 150, // Adjust height
    resizeMode: 'contain',
  },
  star4: {
    width: 40,
    height: 40,
    marginLeft: 150,
    marginTop: 175,
    resizeMode: 'contain',
    position: 'absolute',
  },
  twinkle: {
    width: 75,
    height: 75,
    marginLeft: 275,
    marginTop: 5,
    resizeMode: 'contain',
    position: 'absolute',
  },
  sticks1: {
    position: 'absolute',
    marginTop: 15,
    marginLeft: 155,
    width: 45,
    height: 45,
    tintColor: '#c67b88',
    resizeMode: 'contain',
  },
  sticks1Dark: {
    position: 'absolute',
    marginTop: 15,
    marginLeft: 155,
    width: 45,
    height: 45,
    tintColor: '#ececec',
    resizeMode: 'contain',
  },
  sticks2: {
    position: 'absolute',
    marginTop: 370,
    marginLeft: 95,
    width: 45,
    height: 45,
    tintColor: '#c67b88',
    resizeMode: 'contain',
  },
  sticks2Dark: {
    position: 'absolute',
    marginTop: 370,
    marginLeft: 95,
    width: 45,
    height: 45,
    tintColor: '#ececec',
    resizeMode: 'contain',
  },
  upstars: {
    position: 'absolute',
    marginTop: 260,
    marginLeft: 280,
    width: 70,
    height: 100,
    resizeMode: 'contain',
    transform: [{ rotate: '-15deg' }],
  },
  downstars: {
    position: 'absolute',
    marginTop: 260,
    marginLeft: 0,
    width: 70,
    height: 100,
    resizeMode: 'contain',
    transform: [{ rotate: '-15deg' }],
  },
  bubbles: {
    position: 'absolute',
    marginTop: -310,
    marginLeft: 290,
    width: 100,
    height: 100,
    tintColor: '#fdb3ca',
    resizeMode: 'contain',
  },
  bubblesDark: {
    position: 'absolute',
    marginTop: -310,
    marginLeft: 290,
    width: 100,
    height: 100,
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
  star1Text: {
    position: 'absolute', // Allows manual positioning
    top: 65, // Adjust the position
    left:40, // Adjust as needed
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88', // Or your desired color
  },
  star2Text: {
    position: 'absolute',
    top: 55,
    left: 35,
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
  },
  star3Text: {
    position: 'absolute',
    top: 70,
    left: 68,
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#ffe8f0',
  },
  star1TextDark: {
    position: 'absolute', // Allows manual positioning
    top: 65, // Adjust the position
    left:40, // Adjust as needed
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#2e375b', // Or your desired color
  },
  star2TextDark: {
    position: 'absolute',
    top: 55,
    left: 35,
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#2e375b',
  },
  star3TextDark: {
    position: 'absolute',
    top: 70,
    left: 68,
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#2e375b',
  },
  checkIcon: {
    position: 'absolute',
    top: 48,
    left: 40,
     // Adjust as needed
  },
  checkPostIcon: {
    position: 'absolute',
    top: 38,
    left: 34,
     // Adjust as needed
  },
  lockIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  lockIconPostContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -30 }],
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  lockOverlayContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default Home