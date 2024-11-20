import { SplashScreen , Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from "react";
import GlobalProvider from "../context/GlobalProvider";
import "react-native-url-polyfill/auto";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "PPTelegraf-Regular": require("../assets/fonts/PPTelegraf-Regular.otf"),
    "PPTelegraf-UltraBold": require("../assets/fonts/PPTelegraf-UltraBold.otf"),
    "PPTelegraf-UltraLight": require("../assets/fonts/PPTelegraf-UltraLight.otf"),
    "BarlowSemiCondensed-Black": require("../assets/fonts/BarlowSemiCondensed-Black.ttf"),
    "BarlowSemiCondensed-BlackItalic": require("../assets/fonts/BarlowSemiCondensed-BlackItalic.ttf"),
    "BarlowSemiCondensed-Bold": require("../assets/fonts/BarlowSemiCondensed-Bold.ttf"),
    "BarlowSemiCondensed-BoldItalic": require("../assets/fonts/BarlowSemiCondensed-BoldItalic.ttf"),
    "BarlowSemiCondensed-ExtraBold": require("../assets/fonts/BarlowSemiCondensed-ExtraBold.ttf"),
    "BarlowSemiCondensed-ExtraBoldItalic": require("../assets/fonts/BarlowSemiCondensed-ExtraBoldItalic.ttf"),
    "BarlowSemiCondensed-ExtraLight": require("../assets/fonts/BarlowSemiCondensed-ExtraLight.ttf"),
    "BarlowSemiCondensed-ExtraLightItalic": require("../assets/fonts/BarlowSemiCondensed-ExtraLightItalic.ttf"),
    "BarlowSemiCondensed-Italic": require("../assets/fonts/BarlowSemiCondensed-Italic.ttf"),
    "BarlowSemiCondensed-Light": require("../assets/fonts/BarlowSemiCondensed-Light.ttf"),
    "BarlowSemiCondensed-LightItalic": require("../assets/fonts/BarlowSemiCondensed-LightItalic.ttf"),
    "BarlowSemiCondensed-Medium": require("../assets/fonts/BarlowSemiCondensed-Medium.ttf"),
    "BarlowSemiCondensed-MediumItalic": require("../assets/fonts/BarlowSemiCondensed-MediumItalic.ttf"),
    "BarlowSemiCondensed-Regular": require("../assets/fonts/BarlowSemiCondensed-Regular.ttf"),
    "BarlowSemiCondensed-SemiBold": require("../assets/fonts/BarlowSemiCondensed-SemiBold.ttf"),
    "BarlowSemiCondensed-SemiBoldItalic": require("../assets/fonts/BarlowSemiCondensed-SemiBoldItalic.ttf"),
    "BarlowSemiCondensed-Thin": require("../assets/fonts/BarlowSemiCondensed-Thin.ttf"),
    "BarlowSemiCondensed-ThinItalic": require("../assets/fonts/BarlowSemiCondensed-ThinItalic.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen
            name="index"
            options={{ headerShown: false }} />
            <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="times" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="profile" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="mothgramCourse" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="taletimeCourse" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="storyCourse" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="grambearCourse" 
            options={{ headerShown: false }} />
            <Stack.Screen 
            name="tests" 
            options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
    
  ) 
}

export default RootLayout