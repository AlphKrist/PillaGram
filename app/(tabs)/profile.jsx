import { FlatList, View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Modal, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentUser, signOut, fetchAchievementsForUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import React, { useState, useEffect } from 'react';
import { designs } from '../../constants';
import { Link, router } from 'expo-router';
import useAppwrite from "../../lib/useAppwrite";

const Profile = () => {
  const { user: globalUser, setUser, setIsLogged, darkMode, setDarkMode } = useGlobalContext();
  const [userXP, setUserXP] = useState(0);
  const [user, setUserLocal] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { data: userData, loading, refetch } = useAppwrite(() => {
    return globalUser;
  });

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserLocal(currentUser);

        // Fetch achievements and XP in a single call
        const { achievements: userAchievements, userXP: xp } = await fetchAchievementsForUser(currentUser.accountId);

        setUserXP(xp);
        setAchievements(userAchievements);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const currentUser = await getCurrentUser();
      // Fetch updated achievements and XP
      const { achievements: updatedAchievements, userXP: updatedXP } = await fetchAchievementsForUser(currentUser.accountId);

      setUserXP(updatedXP);
      setAchievements(updatedAchievements);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = () => {
    setShowModal(true);
  };

  const renderAchievement = ({ item }) => (
    <View style={darkMode ? styles.achievementCardDark : styles.achievementCard}>
      <Image source={{ uri: item.imageURL }} style={styles.achievementIcon} />
      
      <View style={styles.achievementRow}>
        <View style={styles.achievementDetails}>
          <Text style={darkMode ? styles.achievementTextDark : styles.achievementText}>{item.title || "Untitled Achievement"}</Text>
          <Text style={darkMode ? styles.achievementXPDark : styles.achievementXP}>{item.description || "No description available"}</Text>
      
          {/* Progress Bar */}
          <View style={darkMode ? styles.progressBarContainerDark : styles.progressBarContainer}>
            <View style={[darkMode ? styles.progressBarDark : styles.progressBar, { width: `${item.progress}%` }]} />
          </View>
        </View>
  
        {/* Show Check Icon if Achievement is Complete */}
        {item.isComplete && (
          <Icon name="checkmark-circle" size={60} color={darkMode ? "#5c6898" : "#c67b88"}  style={styles.checkIcon} />
        )}
      </View>
    </View>
  );
  
  

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      <Image source={designs.design1} style={styles.profileImage} />
      <Text adjustsFontSizeToFit numberOfLines={1} style={darkMode ? styles.usernameDark : styles.username}>{globalUser?.username}</Text>
      <Text style={darkMode ? styles.userEmailDark : styles.userEmail}>{user.email}</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={darkMode ? styles.xpButtonDark : styles.xpButton}>
            <Image source={darkMode ? designs.flower1 : designs.flower2} style={styles.statIcon} />
            <Text style={darkMode ? styles.statValueDark : styles.statValue}>{userXP}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={darkMode ? styles.editButtonDark : styles.editButton}>
            <Link href="/profile/editProfile">
              <Text style={styles.editText}>Edit Profile</Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={darkMode ? styles.darkModeButtonDark : styles.darkModeButton} onPress={() => setDarkMode(!darkMode)}>
            <Icon name={darkMode ? 'sunny' : 'moon'} size={24} color={darkMode ? "#FFD700" : "#FFF"} />
            <Text style={darkMode ? styles.darkModeTextDark : styles.darkModeText}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut} style={darkMode ? styles.signOutButtonDark : styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={darkMode ? styles.containerDark : styles.container}>
  {/* Background images */}
  <Image source={designs.star5} style={darkMode ? styles.star5Dark : styles.star5} />
  <Image source={darkMode ? designs.upstars3 : designs.upstars2} style={styles.leftcurve} />

  {/* Static Profile Header Section */}
  {renderHeader()}

  {/* Achievements Title */}
  <Text style={darkMode ? styles.achievementTitleDark : styles.achievementTitle}>
    Achievements
  </Text>

 
  <FlatList
    contentContainerStyle={styles.achievementListContainer}
    data={achievements}
    renderItem={renderAchievement}
    keyExtractor={(item) => item.$id}
    ListEmptyComponent={() => (
      <Text style={darkMode ? styles.noAchievementsTextDark : styles.noAchievementsText}>
        No achievements yet.
      </Text>
    )}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }
  />

  {/* Logout Modal */}
  <Modal
    transparent={true}
    visible={showModal}
    animationType="fade"
    onRequestClose={() => setShowModal(false)}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Confirm</Text>
        <Text style={styles.modalMessage}>Are you sure you want to sign out?</Text>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmButton} onPress={logout}>
            <Text style={styles.confirmButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeff7',
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#2e375b',
  },
  scrollView: {
    alignItems: "center",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    marginTop: 20,
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  username: {
    fontSize: 40,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#c67b88",
    maxWidth: "50%",
  },
  usernameDark: {
    fontSize: 40,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#e3e3ff",
    maxWidth: "50%",
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-Medium',
    color: "#c67b88",
    marginBottom: 10,
  },
  userEmailDark: {
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-Medium',
    color: "#e3e3ff",
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 30,
    width: '100%',
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  xpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAC2CF",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    marginHorizontal: 5,
  },
  xpButtonDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5c6898",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#FFF",
    marginLeft: 10,
  },
  statValueDark: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#fff",
    marginLeft: 10,
  },
  statIcon: {
    width: 30,
    height: 30,
  },
  editButton: {
    backgroundColor: "#EAC2CF",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 5,
  },
  editButtonDark: {
    backgroundColor: "#5c6898",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 5,
  },
  editText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  signOutButton: {
    backgroundColor: "#EAC2CF",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  signOutButtonDark: {
    backgroundColor: "#5c6898",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  signOutText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  darkModeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e375b",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    height: 50,
  },
  darkModeButtonDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    height: 50,
  },
  darkModeText: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#FFF",
    marginRight: 10,
    marginLeft: 10,
  },
  darkModeTextDark: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#5c6898",
    marginRight: 10,
    marginLeft: 10,
  },
  achievementContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementTitle: {
    fontSize: 30,
    marginBottom: 10,
    marginTop: -50,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#c67b88",
    textAlign: "center",
    
  },
  achievementTitleDark: {
    fontSize: 30,
    marginTop: -50,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#e3e3ff",
    marginBottom: 10,
    textAlign: "center",
  },
  noAchievementsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  noAchievementsTextDark: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCardDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3e3ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  achievementIconDark: {
    width: 60,
    height: 60,
    marginRight: 15,
    tintColor: "#5C6898",
  },
  achievementDetails: {
    flex: 1,
  },
  achievementText: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#c67b88", 
  },
  achievementTextDark: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: "#5C6898", 
  },
  achievementXP: {
    fontSize: 14,
    fontFamily: 'BarlowSemiCondensed-Medium',
    color: "#c67b88",
  },
  achievementXPDark: {
    fontSize: 14,
    fontFamily: 'BarlowSemiCondensed-Medium',
    color: "#5C6898",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  star5: {
    width: 100,
    height: 100,
    marginLeft: 10,
    marginTop: 50,
    resizeMode: 'contain',
    position: 'absolute',
    tintColor: '#fdb3ca',
  },
  star5Dark: {
    width: 100,
    height: 100,
    marginLeft: 10,
    marginTop: 50,
    resizeMode: 'contain',
    position: 'absolute',
    tintColor: '#5C6898',
  },
  leftcurve: {
    width: 100,
    height: 100,
    marginLeft: 260,
    marginTop: 70,
    resizeMode: 'contain',
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#5C6898',
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#5C6898',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'BarlowSemiCondensed-Medium',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EAC2CF',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'BarlowSemiCondensed-Regular',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#5C6898',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'BarlowSemiCondensed-Regular',
  },
  progressBarContainer: {
    height: 15,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBarContainerDark: {
    height: 15,
    width: '100%',
    backgroundColor: '#dcf9fa',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#c67b88',
  },
  progressBarDark: {
    height: '100%',
    backgroundColor: '#5C6898',
  },
  achievementRow: {
    flexDirection: "row",      // Place items horizontally
    alignItems: "center",      // Align vertically in the center
    justifyContent: "space-between",  // Add space between text and check icon
    flex: 1,                   // Take up available space
  },
  checkIcon: {
    marginLeft: 10,            // Add some margin to the left of the icon
  },
  achievementListContainer: {
    paddingBottom: 20,
    flexGrow: 1,
},
});

export default Profile;
