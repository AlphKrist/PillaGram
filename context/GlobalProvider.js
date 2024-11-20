import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreTestCompleted, setIsPreTestCompleted] = useState(false);
  const [isPostTestCompleted, setIsPostTestCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [learningTime, setLearningTime] = useState(0);
  const [isImageContainerLocked, setIsImageContainerLocked] = useState(true);
  const [isCoursesLocked, setIsCoursesLocked] = useState(true);
  const [isPostTestLocked, setIsPostTestLocked] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      setIsLogged(!!res);
      setUser(res);
      
      const storedProgress = await AsyncStorage.getItem('progress');
      const preTestCompleted = res?.completedPreTest || false;
      const postTestCompleted = res?.completedPostTest || false;

      setIsPreTestCompleted(preTestCompleted);
      setIsPostTestCompleted(postTestCompleted);
      setProgress(parseFloat(storedProgress) || 0);
      setIsCoursesLocked(!preTestCompleted); // Unlock courses if pre-test is completed
      setIsImageContainerLocked(!postTestCompleted); // Unlock image container if post-test is completed
      setIsPostTestLocked(!postTestCompleted);

    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (progress === 100) {
      setIsPostTestLocked(false);
    }
  }, [progress]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        darkMode,
        setDarkMode,
        isPreTestCompleted,
        setIsPreTestCompleted,
        isPostTestCompleted,
        setIsPostTestCompleted,
        isImageContainerLocked,
        setIsImageContainerLocked,
        isCoursesLocked,
        setIsCoursesLocked,
        isPostTestLocked,
        setIsPostTestLocked,
        fetchUserData,
        progress,
        setProgress,
        learningTime,
        setLearningTime,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
