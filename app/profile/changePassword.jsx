import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { updatePassword, signOut } from '../../lib/appwrite';  // Import the updated updatePassword function
import { useGlobalContext } from '../../context/GlobalProvider';
import { useNavigation } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link, router } from 'expo-router';

const ChangePassword = () => {
  const { setUser, setIsLogged, darkMode } = useGlobalContext();  // Assuming you have a dark mode context
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };
  const handleBackPress = () => {
    navigation.goBack();  // Navigate back to the previous screen
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Update password with the old and new password
      await updatePassword(newPassword, oldPassword);
  
      // Show success message and delete the session
      Alert.alert("Success", "Password updated successfully! Please sign in again.");
  
      // Clear the current session after successful password update
      await logout(); // Redirect using `replace` to avoid navigating back
  
    } catch (error) {
      Alert.alert("Error", `Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#d1d5fa" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={darkMode ? styles.headerTextDark : styles.headerText}>Change Password</Text>

        <View style={styles.inputGroup}>
          <Text style={darkMode ? styles.labelDark : styles.label}>Old Password</Text>
          <TextInput
            style={darkMode ? styles.inputDark : styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
            placeholder="Enter old password"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={darkMode ? styles.labelDark : styles.label}>New Password</Text>
          <TextInput
            style={darkMode ? styles.inputDark : styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
            placeholder="Enter new password"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={darkMode ? styles.buttonDark : styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update Password"}
          </Text>
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
  headerText: {
    fontSize: 30,
    color: '#c67b88',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerTextDark: {
    fontSize: 30,
    color: '#ececec',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    marginTop: 10,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#c67b88',
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'BarlowSemiCondensed-Regular',
  },
  labelDark: {
    color: '#d1d5fa',
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'BarlowSemiCondensed-Regular',
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
  },
  button: {
    backgroundColor: '#c67b88',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDark: {
    backgroundColor: '#5c6898',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
});

export default ChangePassword;
