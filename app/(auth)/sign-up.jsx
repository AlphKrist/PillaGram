import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { CustomButton, FormField, Background } from '../../components';
import { createUser } from "../../lib/appwrite";
import { designs } from '../../constants';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Link, router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5c6898',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#5c6898',
  },
  closeButton: {
    backgroundColor: '#5c6898',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    username: true,
    email: true,
    password: true,
  });

  const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility
  const [modalMessage, setModalMessage] = useState("");

  // Function to validate email domain
  const validateEmail = (email) => {
    const domainPattern = /@spcba\.edu\.ph$/;
    const startPattern = /^(23|24)/;
    const thirdCharPattern = /^.{2}1/;
    const sPositionPattern = /^.{3}s/;
    const localPart = email.split('@')[0];
    const lastFourPattern = /\d{4}$/;
  
    if (!domainPattern.test(email)) {
      return "Please use an email from the spcba.edu.ph domain.";
    }
    if (!startPattern.test(email)) {
      return "Email must start with either '23' or '24'.";
    }
    if (!sPositionPattern.test(email)) {
      return "Invalid email.";
    }
    if (!thirdCharPattern.test(email)) {
      return "Invalid email.";
    }
    if (localPart[4] !== '0') {
      return "Invalid email.";
    }
    if (localPart.length !== 8) {
      return "Invalid email.";
    }
    if (!lastFourPattern.test(localPart.slice(-4))) {
      return "Invalid email.";
    }
    
    return "";
  };

  const submit = async () => {
    const isUsernameValid = form.username !== "";
    const isEmailValid = form.email !== "";
    const isPasswordValid = form.password !== "";

    // Set validation states
    setValidation({
      username: isUsernameValid,
      email: isEmailValid,
      password: isPasswordValid,
    });

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      setModalMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }

    // Validate email domain
    const emailErrorMessage = validateEmail(form.email);
  if (emailErrorMessage) {
    setModalMessage(emailErrorMessage);
    setModalVisible(true);
    return;
  }


    setSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      setModalMessage("Account created successfully!");
      setModalVisible(true);
      router.replace("/sign-in");
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ minHeight: Dimensions.get("window").height }}>
        <View className="w-full flex justify-center h-full px-4">
          <Image
            source={designs.design1}
            className="w-[250px] h-[200px]"
            resizeMode='contain'
            style={{ right: -60, marginBottom: -10, marginTop: -60 }}
          />

          <Image
            source={designs.design20}
            resizeMode='contain'
            className="w-[1000px] h-full"
            style={{ position: 'absolute', top: 90, left: -270, bottom: 0 }}
          />

          <Text className="text-2xl text-secondary text-semibold mt-5 font-bblack" style={{ fontSize: 34, lineHeight: 38 }}>
            Let's Get Started!
          </Text>
          <Text className="text-secondary font-bregular text-lg">Sign-up to PillaGram</Text>

          <FormField
            title="Username"
            placeholder={"Username"}
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-5"   // Conditionally apply red border
            customStyle={!validation.username ? styles.errorBorder : null}
          />

          <FormField
            title="Email"
            placeholder={"Email"}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"  // Conditionally apply red border
            customStyle={!validation.email ? styles.errorBorder : null} 
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder={"Password"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"   // Conditionally apply red border
            customStyle={!validation.password ? styles.errorBorder : null}
            style={{ height: 40 }}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-bregular">Have an account already?</Text>
            <Link href="/sign-in" className="text-lg font-bbold text-secondary">Login</Link>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignUp;
