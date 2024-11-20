import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, FlatList, Animated, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef } from "react";
import { designs } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from "../../lib/useAppwrite";
import { fetchLearningData } from "../../lib/appwrite";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const Courses = () => {
    const { user, darkMode, isPreTestCompleted,isCoursesLocked, isImageContainerLocked, setIsImageContainerLocked, isPostTestLocked, setIsPostTestLocked  } = useGlobalContext();
    const [mothgramData, setMothgramData] = useState({});
    const [taletimeData, setTaletimeData] = useState({});
    const [storyData, setStoryData] = useState({});
    const [grambearData, setGrambearData] = useState({});
    const navigation = useNavigation();
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
    }, [isImageContainerLocked]);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (user?.accountId) {
                try {
                    setMothgramData(await fetchLearningData(user.accountId, 'mothgramCourse'));
                    setTaletimeData(await fetchLearningData(user.accountId, 'taletimeCourse'));
                    setStoryData(await fetchLearningData(user.accountId, 'storyCourse'));
                    setGrambearData(await fetchLearningData(user.accountId, 'grambearCourse'));
                } catch (error) {
                    console.error("Error fetching course data:", error);
                }
            }
        };

        fetchCourseData();
    }, [user?.accountId]);

    const handleCoursePress = (course) => {
        if (!isPreTestCompleted) {
            return;
        }
        const courseLinks = {
            MothGram: '/mothgramCourse/mothgramStart',
            TaleTime: '/taletimeCourse/taletimeStart',
            GramBear: '/grambearCourse/grambearStart',
            Story: '/storyCourse/storyStart',
        };

        const link = courseLinks[course];
        if (link) {
            router.push(link);
        }
    };


    const handleBackPress = () => {
        navigation.goBack();
    };

    if (!mothgramData || !taletimeData || !storyData || !grambearData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5C6898" />
            </View>
        );
    }

    return (
        <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={30} color="#d1d5fa" />
            </TouchableOpacity>
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.container}>
                        <View style={styles.coursesHeader}>
                            <Text style={darkMode ? styles.sectionTitleDark : styles.sectionTitle}>My Courses</Text>
                        </View>

                        <View style={styles.coursesContainer}>
                            {/* Course Card 1: MothGram */}
                            <TouchableOpacity onPress={() => handleCoursePress('MothGram')} style={styles.courseCardWrapper} disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.mothgramCardDark : styles.mothgramCard}>
                                    <View style={styles.courseImageContainer}>
                                        <Image source={designs.mothgram} style={styles.courseIcon} />
                                    </View>
                                    <Text style={styles.courseTitle}>MothGram</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarFill(mothgramData.progress || 0)} />
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
                            <TouchableOpacity onPress={() => handleCoursePress('TaleTime')} style={styles.courseCardWrapper} disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.taletimeCardDark : styles.taletimeCard}>
                                    <View style={styles.courseImageContainer}>
                                        <Image source={designs.taletime} style={styles.courseIcon} />
                                    </View>
                                    <Text style={styles.courseTitle}>TaleTime</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarFill(taletimeData.progress || 0)} />
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

                            {/* Course Card 3: GramBear */}
                            <TouchableOpacity onPress={() => handleCoursePress('GramBear')} style={styles.courseCardWrapper} disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.grambearCardDark : styles.grambearCard}>
                                    <View style={styles.courseImageContainer}>
                                        <Image source={designs.design10} style={styles.grambearIcon} />
                                    </View>
                                    <Text style={styles.courseTitle}>GramBear</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarFill(grambearData.progress || 0)} />
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

                            {/* Course Card 4: Story */}
                            <TouchableOpacity onPress={() => handleCoursePress('Story')} style={styles.courseCardWrapper} disabled={!isPreTestCompleted}>
                                <View style={darkMode ? styles.storyCardDark : styles.storyCard}>
                                    <View style={styles.courseImageContainer}>
                                        <Image source={designs.taletime} style={styles.courseIcon} />
                                    </View>
                                    <Text style={styles.courseTitle}>Story</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarFill(storyData.progress || 0)} />
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
                contentContainerStyle={styles.flatListContainer}
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
        justifyContent: 'center',
        marginBottom: 10,
    },
    container: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        flexGrow: 1, // Make sure the content expands to fill the screen
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center',
        
    },
    backButton: {
        position: 'absolute',
        top: 45,  // Adjust as needed to position within the SafeAreaView
        left: 15,
        zIndex: 10,  // Make sure the back button appears above other content
    },
    backButtonText: {
        fontSize: 20,
        color: '#5C6898',
        fontFamily: 'PPTelegraf-Regular',
    },
    coursesHeader: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 48,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#5C6898',
    },
    sectionTitleDark: {
        fontSize: 48,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#d1d5fa',
    },
    coursesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    courseCardWrapper: {
        width: '48%', // Ensures two cards fit in one row
        marginBottom: 16,
    },
    mothgramCard: {
        backgroundColor: '#dcf9fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    mothgramCardDark: {
        backgroundColor: '#d1d5fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    taletimeCard: {
        backgroundColor: '#FFFFF0',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    taletimeCardDark: {
        backgroundColor: '#d1d5fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    grambearCard: {
        backgroundColor: '#FFE7C5',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    grambearCardDark: {
        backgroundColor: '#d1d5fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    storyCard: {
        backgroundColor: '#EAC2CF',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    storyCardDark: {
        backgroundColor: '#d1d5fa',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#5C6898',
        alignItems: 'center',
    },
    courseImageContainer: {
        width: '125%',
        borderBottomWidth: 2,  // This will now create the bottom border
        borderBottomColor: '#5C6898',  // Adjust the color as needed
        marginBottom: 10,
        alignItems: 'center',
    },
    courseIcon: {
        width: '80%',
        height: 170,
        resizeMode: 'contain',
    },
    grambearIcon: {
        resizeMode: 'contain',
        width: '60%',
        height: 170,   
    },
    courseTitle: {
        fontSize: 30,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        color: '#5C6898',
        textAlign: 'center',
        marginBottom: 10,
    },
    courseLevel: {
        fontSize: 14,
        fontFamily: 'PPTelegraf-Regular',
        color: '#979caf',
        marginBottom: 10,
        textAlign: 'center',
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
        backgroundColor: '#5C6898',
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
        borderRadius: 13,
    },
});

export default Courses;
