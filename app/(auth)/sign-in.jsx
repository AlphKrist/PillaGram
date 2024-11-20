import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import { CustomButton, FormField, Background } from '../../components';
import { getCurrentUser, signIn, fetchLearningData } from "../../lib/appwrite";
import { designs } from '../../constants';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const SignIn = () => {
  const { user, setUser, setIsLogged, setProgress, setLearningTime, setIsPostTestCompleted , setIsImageContainerLocked, setIsPostTestLocked } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      const totalLearningTime = await fetchAllLearningData(result.accountId);
      setLearningTime(totalLearningTime.timeSpent);
      setProgress(totalLearningTime.progress);

      setIsPostTestLocked(totalLearningTime.progress < 100);
      setIsPostTestCompleted(result.completedPostTest);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAllLearningData = async (accountId) => {
    try {
      const mothgramData = await fetchLearningData(accountId, 'mothgramCourse');
      const taletimeData = await fetchLearningData(accountId, 'taletimeCourse');
      const storyData = await fetchLearningData(accountId, 'storyCourse');
      const grambearData = await fetchLearningData(accountId, 'grambearCourse');

      const timeSpent = (mothgramData.timeSpent || 0) + (taletimeData.timeSpent || 0) + (storyData.timeSpent || 0) + (grambearData.timeSpent || 0);
      const progress = ((mothgramData.progress || 0) + (taletimeData.progress || 0) + (storyData.progress || 0) + (grambearData.progress || 0)) / 4;

      await AsyncStorage.setItem('learningTime', timeSpent.toString());
      await AsyncStorage.setItem('progress', progress.toString());

      return { timeSpent, progress };
    } catch (error) {
      console.error("Error fetching learning data:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ minHeight: Dimensions.get("window").height }}>

        <View
          className="w-full flex justify-center h-full px-4"
        >
          <Image
            source={designs.design1}
            className="w-[250px] h-[250px]"
            resizeMode='contain'
            style={{
              right: -70,
              marginBottom: -10,
              marginTop: -60,
            }}
          />

          <Image
            source={designs.design20}
            resizeMode='contain'
            className="w-[1000px] h-full"
            style={{
              position: 'absolute',
              top: 150,
              left: -270, // Adjust spacing as needed   
              bottom: 0,
            }}
          />

          <Text
            className="text-2xl text-secondary text-semibold mt-5 font-bblack"
            style={{

              fontSize: 38,
              lineHeight: 38,
            }}>
            Login to PillaGram!
          </Text>
          <Text className="text-secondary font-bregular text-lg">
            Sign-in to continue
          </Text>

          <FormField
            title="Email"
            placeholder={"Email"}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder={"Password"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
            style={{ height: 40 }}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}

          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-bregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-bbold text-secondary"
            >
              Sign-up
            </Link>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;