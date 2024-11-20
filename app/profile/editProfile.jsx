import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { getCurrentUser, updateProfile } from '../../lib/appwrite'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link, router } from 'expo-router';
import { designs } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

const EditProfile = () => {
    const { user, setUser } = useGlobalContext();
    const [username, setUsername] = useState(user?.username || "");
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const {darkMode, setDarkMode} = useGlobalContext();
    const navigation = useNavigation();
    const handleBackPress = () => {
        navigation.goBack();  // Navigate back to the previous screen
    };
    useEffect(() => {
        if (user) {
            setUsername(user.username);
          setEmail(user.email);
        }
      }, [user]);

      const handleUpdateProfile = async () => {
        try {
          const updatedUser = await updateProfile(user.$id, {
            username: username,

            email: email,
          });
    
          // Update the global user state with new data
          setUser(updatedUser);
          Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
          console.log("Error updating user profile:", error);
          Alert.alert("Error", `Error updating user profile: ${error.message}`);
        } finally {
            setLoading(false);  // End loading state
        }
      };

    return (
        <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                {/* Replace text with Ionicons vector icon */}
                <Ionicons name="arrow-back" size={30} color="#d1d5fa" />
            </TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image 
                      source={designs.design1} // Replace with your avatar image
                      style={styles.avatar}
                    />
                    <Text style={darkMode ? styles.headerTextDark : styles.headerText}>Edit Profile</Text>
                </View>

                <Text style={darkMode ? styles.headerDark : styles.header}>Account Information</Text>
                
                {/* Username Input */}
                <View style={styles.inputGroup}>
                    <Text style={darkMode ? styles.labelDark : styles.label}>Username</Text>
                    <TextInput
                        style={darkMode ? styles.inputDark : styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                    <Text style={darkMode ? styles.labelDark : styles.label}>Email</Text>
                    <TextInput
                        style={darkMode ? styles.inputDark : styles.input}
                        value={email}
                        editable={false} // Email should not be editable
                    />
                </View>

                {/* Change Password Button */}
                <TouchableOpacity style={darkMode ? styles.changePasswordButtonDark : styles.changePasswordButton}>
                <Link href="/profile/changePassword" style={styles.changePasswordLink}>
                    <Text style={styles.changePasswordButtonText}>Change Password</Text>
                    </Link>
                    <Ionicons name="chevron-forward" size={20} color="#fff" style={styles.arrowIcon} />
                </TouchableOpacity>

                {/* Save Changes Button */}
                <TouchableOpacity style={darkMode ? styles.buttonDark : styles.button} onPress={handleUpdateProfile} disabled={loading}>
                    <Text style={styles.buttonText}>
                    {loading ? "Updating..." : "Save Changes"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffeff7',
    },
    safeAreaDark: {
        flex: 1,
        backgroundColor: '#28325b',
    },
    backButton: {
        position: 'absolute',
        top: 45,  // Adjust as needed to position within the SafeAreaView
        left: 15,
        zIndex: 10,  // Make sure the back button appears above other content
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    avatarContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    header: {
        fontSize: 16,
        color: '#c67b88',
        fontFamily: 'BarlowSemiCondensed-Regular',
        marginBottom: 10,
    },
    headerDark: {
        fontSize: 16,
        color: '#d1d5fa',
        fontFamily: 'BarlowSemiCondensed-Regular',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 30,
        color: '#c67b88',
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        marginTop: 10,
    },
    headerTextDark: {
        fontSize: 30,
        color: '#ececec',
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#c67b88',
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        marginBottom: 5,
    },
    labelDark: {
        color: '#d1d5fa',
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#EAC2CF',
        borderRadius: 10,
        padding: 10,
        color: '#FFFFFF',
        fontFamily: 'BarlowSemiCondensed-Medium',
    },
    inputDark: {
        backgroundColor: '#5c6898',
        borderRadius: 10,
        padding: 10,
        color: '#d1d5fa',
        fontFamily: 'BarlowSemiCondensed-Regular',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#c67b88',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDark: {
        backgroundColor: '#5c6898',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
    },
    changePasswordButton: {
        backgroundColor: '#c67b88', // Light pink for example
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    changePasswordButtonDark: {
        backgroundColor: '#5c6898', // Light pink for example
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'BarlowSemiCondensed-ExtraBold',
    },
    arrowIcon: {
        marginLeft: 10, // Optional styling for the icon
    },
    changePasswordLink: {
        flex: 1, // Ensures the text takes up the available space
        textAlign: 'left', // Align the text to the left
    },
});

export default EditProfile;
