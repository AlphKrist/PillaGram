import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, Animated, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import { designs } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";
import { fetchLearningData } from "../../lib/appwrite";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Time = () => {
    const { user, darkMode, 
        isPreTestCompleted, isCoursesLocked, 
        isImageContainerLocked, setIsImageContainerLocked, 
        isPostTestLocked, setIsPostTestLocked, 
        progress, setProgress, 
        learningTime, setLearningTime,
        fetchUserData } = useGlobalContext();
        
    const [mothgramData, setMothgramData] = useState({});
    const [taletimeData, setTaletimeData] = useState({});
    const [storyData, setStoryData] = useState({});
    const [grambearData, setGrambearData] = useState({});
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const [isDataFetched, setIsDataFetched] = useState(false);
    const lastProgressRef = useRef(0);
    const tintColor = darkMode ? "#5c6898" : "#c67b88";
    const LEARNING_TIME_KEY = 'learningTime';
    const PROGRESS_KEY = 'progress';

    const MOTHGRAM_PROGRESS_KEY = 'mothgramProgress';
    const TALETIME_PROGRESS_KEY = 'taletimeProgress';
    const STORY_PROGRESS_KEY = 'storyProgress';
    const GRAMBEAR_PROGRESS_KEY = 'grambearProgress';

    // Load data from Async Storage
    useEffect(() => {
        const loadLocalData = async () => {
        try {
            const savedTime = await AsyncStorage.getItem(LEARNING_TIME_KEY);
            const savedProgress = await AsyncStorage.getItem(PROGRESS_KEY);

            const savedMothgramProgress = await AsyncStorage.getItem(MOTHGRAM_PROGRESS_KEY);
            const savedTaletimeProgress = await AsyncStorage.getItem(TALETIME_PROGRESS_KEY);
            const savedStoryProgress = await AsyncStorage.getItem(STORY_PROGRESS_KEY);
            const savedGrambearProgress = await AsyncStorage.getItem(GRAMBEAR_PROGRESS_KEY);

            if (savedTime !== null) setLearningTime(parseInt(savedTime));
            if (savedProgress !== null) setProgress(parseFloat(savedProgress));

            if (savedMothgramProgress) setMothgramData({ progress: parseFloat(savedMothgramProgress) });
            if (savedTaletimeProgress) setTaletimeData({ progress: parseFloat(savedTaletimeProgress) });
            if (savedStoryProgress) setStoryData({ progress: parseFloat(savedStoryProgress) });
            if (savedGrambearProgress) setGrambearData({ progress: parseFloat(savedGrambearProgress) });
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };
        loadLocalData();
    }, []);

    const animateLockUnlock = (opacityRef, isLocked) => {
        Animated.timing(opacityRef, {
          toValue: isLocked ? 1 : 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      };

    const lockOpacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        animateLockUnlock(lockOpacity, isImageContainerLocked);
        animateLockUnlock(lockOpacity, isPostTestLocked);
    }, [isImageContainerLocked]);

    const fetchData = async () => {
        if (user?.accountId) {
            try {
                const fetchedMothgramData = await fetchLearningData(user.accountId, 'mothgramCourse');
                const fetchedTaletimeData = await fetchLearningData(user.accountId, 'taletimeCourse');
                const fetchedStoryData = await fetchLearningData(user.accountId, 'storyCourse');
                const fetchedGrambearData = await fetchLearningData(user.accountId, 'grambearCourse');

                setMothgramData(fetchedMothgramData);
                setTaletimeData(fetchedTaletimeData);
                setStoryData(fetchedStoryData);
                setGrambearData(fetchedGrambearData);

                const totalLearningTime = 
                    (fetchedMothgramData.timeSpent || 0) +
                    (fetchedTaletimeData.timeSpent || 0) +
                    (fetchedStoryData.timeSpent || 0) +
                    (fetchedGrambearData.timeSpent || 0);

                const totalProgress = 
                    ((fetchedMothgramData.progress || 0) +
                    (fetchedTaletimeData.progress || 0) +
                    (fetchedStoryData.progress || 0) +
                    (fetchedGrambearData.progress || 0)) / 4;

                setLearningTime(totalLearningTime);
                setProgress(totalProgress);
                setIsDataFetched(true);

                await AsyncStorage.setItem(LEARNING_TIME_KEY, totalLearningTime.toString());
                await AsyncStorage.setItem(PROGRESS_KEY, totalProgress.toString());
                console.log("Total cumulative time:", totalLearningTime);
                console.log("Progress:", totalProgress);

            } catch (error) {
                console.error("Error fetching learning data:", error);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [user?.accountId])
    );

    useEffect(() => {
        if (isDataFetched && progress !== lastProgressRef.current) {
            lastProgressRef.current = progress; // Update last progress
            progressAnimation.setValue(0); // Reset the animation progress
            Animated.timing(progressAnimation, {
                toValue: progress,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }   
    }, [isDataFetched, progress]);

    const handleCoursePress = (course) => {
        if (!isPreTestCompleted) {
        return; // Prevent navigation if the pre-test is not completed
    }
        const courseLinks = {
            MothGram: '/mothgramCourse/mothgramStart',
            TaleTime: '/taletimeCourse/taletimeStart',
        };
    
        const link = courseLinks[course];
        if (link) {
            router.push(link);
        }
    };

    return (
        <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
            
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.container}>
                        <View style={styles.iconContainer}>
                            <Image source={designs.design1} style={styles.appIcon} resizeMode='contain' />
                        </View>
                        {/* Learning Time Section */}
                        <View style={darkMode ? styles.learningCardDark : styles.learningCard}>
                            <View style={styles.textContainer}>
                                <Text style={darkMode ? styles.titleDark : styles.title}>This week's learning time</Text>
                                <Text style={darkMode ? styles.timeTextDark : styles.timeText}>
                                    {Math.floor(learningTime / 60)}m {learningTime % 60}s
                                </Text>
                                <Text style={darkMode ? styles.encouragementDark : styles.encouragement}>Keep going!</Text>
                            </View>
                            <View style={styles.progressContainer}>
                                <AnimatedCircularProgress
                                    size={135}
                                    width={15}
                                    fill={progress}
                                    tintColor={tintColor}
                                    backgroundColor="#E2E8F0"
                                    rotation={0}
                                    lineCap="round"
                                >
                                    {() => (
                                        <View style={styles.percentageContainer}>
                                            <Text style={darkMode ? styles.percentageValueDark : styles.percentageValue}>
                                                {Math.round(progress)}%
                                            </Text>
                                            <Text style={darkMode ? styles.percentageLabelDark : styles.percentageLabel}>
                                                progress
                                            </Text>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                            </View>
                        </View>

                        {/* My Courses Section */}
                        <View style={styles.coursesHeader}>
                            <Text style={darkMode ? styles.sectionTitleDark : styles.sectionTitle}>My Courses</Text>
                            <Link href="/times/courses" style={darkMode ? styles.viewAllDark : styles.viewAll}>
                                <Text>View all</Text>
                            </Link>
                        </View>

                        <View style={styles.coursesContainer}>
                            {/* Course Card 1: MothGram */}
                            <TouchableOpacity onPress={() => handleCoursePress('MothGram')} style={styles.courseCardWrapper} disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.courseCardDark : styles.courseCard}>
                                    <View style={darkMode ? styles.courseImageContainerDark : styles.courseImageContainer}>
                                        <Image source={darkMode ? designs.mothgram : designs.mothgrampink} style={styles.courseIcon} />
                                        
                                    </View>
                                    <Text style={darkMode ? styles.courseTitleDark : styles.courseTitle}>MothGram</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={darkMode ? styles.progressBarFillDark(mothgramData.progress || 0) : styles.progressBarFill(mothgramData.progress || 0)} />
                                    </View>
                                    {isPostTestLocked && !isPreTestCompleted && (
                                        <Animated.View style={styles.overlay} />
                                    )}
                                    {isPostTestLocked && !isPreTestCompleted && (
                                            <Animated.View style={styles.lockOverlay}>
                                                <Icon name="lock-closed" size={40} color={darkMode ? "#d1d5fa" : "#ffeff7"} />
                                            </Animated.View>
                                        )}
                                </View>
                            </TouchableOpacity>

                            {/* Course Card 2: TaleTime */}
                            <TouchableOpacity onPress={() => handleCoursePress('TaleTime')} style={styles.courseCardWrapper}  disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.courseCardDark : styles.courseCard}>
                                    <View style={darkMode ? styles.courseImageContainerDark : styles.courseImageContainer}>
                                        <Image source={darkMode ? designs.dolphindark : designs.dolphinpink} style={styles.courseIcon} />
                                        
                                    </View>
                                    <Text style={darkMode ? styles.courseTitleDark : styles.courseTitle}>TaleTime</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={darkMode ? styles.progressBarFillDark(taletimeData.progress || 0) : styles.progressBarFill(taletimeData.progress || 0)} />
                                    </View>
                                    {isPostTestLocked && !isPreTestCompleted && (
                                    <Animated.View style={styles.overlay} />
                                    )}
                                    {isPostTestLocked && !isPreTestCompleted && (
                                            <Animated.View style={styles.lockOverlay}>
                                                <Icon name="lock-closed" size={40} color={darkMode ? "#d1d5fa" : "#ffeff7"} />
                                            </Animated.View>
                                        )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffeff7',
        flex: 1,
        
    },
    safeAreaDark: {
        backgroundColor: '#2e375b',
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    appIcon: {
        width: 80,
        height: 80,
    },
    container: {
        padding: 16,
        justifyContent: 'center',
    },
    learningCard: {
        backgroundColor: '#eac2cf',
        borderColor: '#fdb3ca',
        borderWidth: 3,
        padding: 20,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    learningCardDark: {
        backgroundColor: '#d1d5fa',
        borderColor: '#5c6898',
        borderWidth: 3,
        padding: 20,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        color: '#c67b88',
        marginBottom: 5,
        fontFamily: 'PPTelegraf-Regular',
    },
    titleDark: {
        fontSize: 13,
        color: '#5C6898',
        marginBottom: 5,
        fontFamily: 'PPTelegraf-Regular',
    },
    timeText: {
        fontSize: 36,
        color: '#c67b88',
        marginBottom: 5,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
    },
    timeTextDark: {
        fontSize: 36,
        color: '#5C6898',
        marginBottom: 5,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
    },
    encouragement: {
        fontSize: 14,
        color: '#c67b88',
        marginBottom: 5,
        fontFamily: 'PPTelegraf-Regular',
    },
    encouragementDark: {
        fontSize: 14,
        color: '#979caf',
        marginBottom: 5,
        fontFamily: 'PPTelegraf-Regular',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        width: 120,
        borderRadius: 15,
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#5c6898',
        fontSize: 16,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
    },
    progressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageValue: {
        fontSize: 40,
        color: '#c67b88',
        fontFamily: 'BarlowSemiCondensed-Bold',
        textAlign: 'center',  
    },
    percentageValueDark: {
        fontSize: 40,
        color: '#5C6898',
        fontFamily: 'BarlowSemiCondensed-Bold',
        textAlign: 'center',
    },
    percentageLabel: {
        fontSize: 16,
        color: '#c67b88',
        fontFamily: 'BarlowSemiCondensed-Bold',
        textAlign: 'center',
    },
    percentageLabelDark: {
        fontSize: 16,
        color: '#5C6898',
        fontFamily: 'BarlowSemiCondensed-Bold',
        textAlign: 'center',
    },
    coursesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#c67b88',
    },
    sectionTitleDark: {
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#d1d5fa',
    },
    viewAll: {
        fontSize: 20,
        fontFamily: 'PPTelegraf-Regular',
        color: '#979caf',
    },
    viewAllDark: {
        fontSize: 20,
        fontFamily: 'PPTelegraf-Regular',
        color: '#b0b8d4',
    },
    courseImageContainer: {
        width: '125%',
        borderBottomWidth: 3,  // This will now create the bottom border
        borderBottomColor: '#fdb3ca',  // Adjust the color as needed
        marginBottom: 10,
        alignItems: 'center',  // Add some space between the image and the title
    },
    courseImageContainerDark: {
        width: '125%',
        borderBottomWidth: 3,  // This will now create the bottom border
        borderBottomColor: '#5C6898',  // Adjust the color as needed
        marginBottom: 10,
        alignItems: 'center',  // Add some space between the image and the title
    },
    coursesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: -10,
        marginTop: 10,
    },
    courseCardWrapper: {
        flex: 1,
        marginHorizontal: 8, // Adjust spacing between cards
    },
    courseCard: {
        backgroundColor: '#eac2cf',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fdb3ca',
        alignItems: 'center',
    },
    courseCardDark: {
        backgroundColor: '#d1d5fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    courseIcon: {
        width: 120,
        height: 210,
        resizeMode: 'contain',
    },
    courseTitle: {
        fontSize: 30,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#c67b88',
        marginBottom: 10,
    },
    courseTitleDark: {
        fontSize: 30,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#5C6898',
        marginBottom: 10,
    },
    courseLevel: {
        fontSize: 14,
        fontFamily: 'PPTelegraf-Regular',
        color: '#979caf',
        marginBottom: 10,
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#e2e8f0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: (percentage) => ({
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: '#c67b88',
    }),

    progressBarFillDark: (percentage) => ({
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: '#5c6898',
    }),
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black with 50% transparency
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    confetti: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 34,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#c67b88',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-Regular',
        color: '#c67b88',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#c67b88',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontFamily: 'BarlowSemiCondensed-Bold',
        fontSize: 16,
    },
});

export default Time;
