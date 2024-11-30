import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.pg.pillagram',
    projectId: '66cf43a8001efc1e99d8',
    databaseId: '66cf451800000276ccdf', 
    userCollectionId: '66cf454e0023e8bb7526',
    storageId: '66cf46530027f9692f00',
    learningDataId: '66d945cb000f0eabe4ad',
    leaderboardCollectionId: '66dbbc55002a6e15866c',
    badgeCollectionId: '66dbc9450006b99771ff',
    badgeStorageId: '66dbca7c0009fd8621ca',
    achievementsCollectionId: '66e79a1f003679686a3f',
    quizScoreCollectionId: '67080c6600084042cff5',
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 
;

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        userXP: 0,
        preTestScore: 0,
        postTestScore: 0,
        completedPreTest: false,
        completedPostTest: false,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}
// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
  
  
  // Get Account
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser || currentUser.documents.length === 0) {
        console.log("No user document found for accountId:", currentAccount.$id);
        console.log("Returned Data:", currentUser);  // Log the returned data for debugging
        return null;
      }
  
      return currentUser.documents[0];
    } catch (error) {
      console.log("Error fetching current user:", error.message);
      return null;
    }
  }
  

  export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  

  export async function addXPToUser(accountId, xpEarned) {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', accountId)]
      );
  
      if (result.documents.length === 0) {
        throw new Error('User document not found');
      }
  
      const userDocument = result.documents[0];
      const documentId = userDocument.$id;
      const currentXP = userDocument.userXP || 0;
  
      const updatedXP = currentXP + xpEarned;
  
      // Update XP
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        documentId,
        { userXP: updatedXP }
      );
  
      console.log(`XP updated successfully. New XP: ${updatedXP}`);
      return updatedXP;
    } catch (error) {
      console.error("Error updating user XP:", error);
      throw error;
    }
  }
  
  // Example: Call this function when a course is completed
  // addXPToUser(accountId, 100);  // Adds 100 XP
  
  // Fetch leaderboard data
  export const fetchLeaderboard = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
          Query.orderDesc("userXP"), // Sort users by XP in descending order
          Query.limit(100) // Set the limit to 100 users
        ]
      );
  
      return response.documents;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  };


  export const fetchAchievementsForUser = async (accountId) => {
    try {
      // Fetch user document from Users collection by accountId
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', accountId)]
      );
  
      if (result.documents.length === 0) {
        throw new Error("User document not found");
      }
  
      const userDocument = result.documents[0];
      const userXP = userDocument.userXP || 0; // Fetch the userXP from the document
  
      // Fetch all achievements
      const achievementsResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.achievementsCollectionId
      );
  
      const achievements = achievementsResult.documents.map((achievement) => ({
        ...achievement,
        isComplete: userXP >= achievement.xpThreshold, // Check if user XP is enough for this achievement
        progress: Math.min((userXP / achievement.xpThreshold) * 100, 100), // Calculate progress for progress bar
      }));
  
      return { achievements, userXP };
    } catch (error) {
      console.error("Error fetching achievements or user XP:", error);
      throw error;
    }
  };
  

// Update User Profile
export const updateProfile = async (accountId, newProfileData) => {
  try {
    const currentAccount = await getAccount();
    // Step 1: Fetch user document by accountId
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (result.documents.length === 0) {
      throw new Error("Document with the requested accountId could not be found");
    }

    const userDocument = result.documents[0];
    const documentId = userDocument.$id; // Extract document ID

    const updatedProfileData = {
      ...newProfileData, // Copy all other new profile data

      // If no displayName exists (new user), set it, otherwise update it
      displayName: newProfileData.displayName || userDocument.displayName || "User"
    };

    // Update the document in the Appwrite database
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      documentId,
      updatedProfileData
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updatePassword = async (newPassword, oldPassword) => {
  try {
    // Update password using the new password and the old password
    await account.updatePassword(newPassword, oldPassword);

    // At this point, if the password update was successful, 
    // we don't need to recreate the session if it is already active.

  } catch (error) {
    console.error("Failed to update password:", error.message);
    throw error;
  }
};

export async function saveQuizScore(userId, courseId, quizId, score, totalItems) {
  try {
    // Create a new document in the QuizScores collection
    const newScore = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizScoreCollectionId, // Ensure this is set in your config
      ID.unique(),
      {
        user_id: userId,        // Reference to the user taking the quiz
        course_id: courseId,    // Reference to the course (TaleTime, MothGram, etc.)
        quiz_id: quizId,        // Reference to the specific quiz
        score: score,           // User's quiz score
        total_items: totalItems // Total number of items in the quiz (10 or 17)
      }
    );

    // Return the newly created score document
    return newScore;
  } catch (error) {
    console.error("Error saving quiz score:", error);
    throw new Error("Failed to save quiz score.");
  }
}
// Updates learning data with time spent, progress, and completed lessons.
export async function updateLearningData(userId, courseId, timeSpent = 0, progress = 0, lessonId) {
  try {
    if (!userId || !courseId || !lessonId) {
      throw new Error('Invalid userId, courseId, or lessonId.');
    }

    // Fetch current learning data for this user and course
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.learningDataId,
      [Query.equal('userId', userId), Query.equal('courseId', courseId)]
    );

    let currentTimeSpent = 0;
    let currentProgress = 0;
    let completedLessons = [];

    if (result.documents.length > 0) {
      const document = result.documents[0];
      currentTimeSpent = document.timeSpent || 0;
      currentProgress = document.progress || 0;
      completedLessons = Array.isArray(document.completedLessons) ? document.completedLessons : [];
    }

    // Check if the lesson is new (hasn't been completed)
    const isNewLesson = !completedLessons.includes(lessonId);

    // If it's a new lesson, increment progress by the given progress value
    const updatedProgress = isNewLesson ? Math.min(currentProgress + progress, 100) : currentProgress;
    
    // Add lesson to completed lessons if it's a new lesson
    const updatedLessons = isNewLesson ? [...completedLessons, lessonId] : completedLessons;

    // Accumulate total time spent
    const totalUpdatedTimeSpent = currentTimeSpent + timeSpent;

    if (result.documents.length > 0) {
      // Update existing document
      const documentId = result.documents[0].$id;
      const updatedData = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.learningDataId,
        documentId,
        {
          timeSpent: totalUpdatedTimeSpent,
          progress: updatedProgress,
          completedLessons: updatedLessons,
        }
      );

      console.log('Updated learning data in database:', updatedData);
      return updatedData;
    } else {
      // Create a new document if none exists
      const newData = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.learningDataId,
        ID.unique(),
        {
          userId,
          courseId,
          timeSpent: totalUpdatedTimeSpent,
          progress: updatedProgress,
          completedLessons: [lessonId],
        }
      );

      console.log('Created new learning data in database:', newData);
      return newData;
    }
  } catch (error) {
    console.error('Error updating learning data:', error);
    throw error;
  }
}

// Fetch learning data for a specific user and course
export async function fetchLearningData(userId, courseId) {
  try {
    if (!userId || !courseId) {
      throw new Error('Invalid userId or courseId.');
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.learningDataId,
      [Query.equal('userId', userId), Query.equal('courseId', courseId)]
    );

    if (response.documents.length === 0) {
      console.log('No learning data found for this user and course.');
      return { timeSpent: 0, progress: 0, completedLessons: [] };
    }

    return response.documents[0];
  } catch (error) {
    console.error('Error fetching learning data:', error);
    throw error;
  }
}


// Function to log time spent on a course
export async function logTimeSpentOnCourse(userId, courseId, timeSpent, progress) {
  try {
    // Validate userId and courseId
    if (!userId || !courseId) {
      throw new Error("Invalid userId or courseId.");
    }

    // Fetch the existing learning data for the user 
    const learningData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.learningDataId,
      [Query.equal('userId', userId), Query.equal('courseId', courseId)]
    );

    // If there's no existing data for the course, create a new document
    if (learningData.documents.length === 0) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.learningDataId,
        ID.unique(),
        {
          userId: userId,
          courseId: courseId,
          timeSpent: timeSpent, // Initial time spent
          progress: progress || 0 // Default progress if not provided
        }
      );
    } else {
      // If data exists, update the time spent and ensure progress is still included
      const documentId = learningData.documents[0].$id;
      const currentTimeSpent = learningData.documents[0].timeSpent || 0;
      const currentProgress = learningData.documents[0].progress || 0; // Default if missing

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.learningDataId,
        documentId,
        {
          timeSpent: currentTimeSpent + timeSpent, // Accumulate the total time
          progress: Math.max(currentProgress, progress || 0) // Update progress if greater
        }
      );
    }

    console.log(`Time logged successfully for course ${courseId}.`);
  } catch (error) {
    console.error("Error logging time spent on course:", error);
    throw error;
  }
}

export async function updateTestScore(accountId, scoreType, score) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", accountId)]
    );

    if (result.documents.length === 0) {
      throw new Error("User document not found");
    }

    const userDocument = result.documents[0];
    const documentId = userDocument.$id;

    // Include both scores in the update, using existing values if not updating
    const updateData = {
      preTestScore: scoreType === "pre" ? score : userDocument.preTestScore,
      postTestScore: scoreType === "post" ? score : userDocument.postTestScore,
    };

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      documentId,
      updateData
    );

    console.log(`${scoreType}TestScore updated to ${score}`);
  } catch (error) {
    console.error("Error updating test score:", error);
    throw error;
  }
}

export async function updateTestCompletionStatus(accountId, testType, isCompleted) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", accountId)]
    );

    if (result.documents.length === 0) {
      throw new Error("User document not found");
    }

    const userDocument = result.documents[0];
    const documentId = userDocument.$id;

    // Prepare data to update only the relevant test completion status
    const updateData = {
      completedPreTest: testType === "pre" ? isCompleted : userDocument.completedPreTest,
      completedPostTest: testType === "post" ? isCompleted : userDocument.completedPostTest,
    };

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      documentId,
      updateData
    );

    console.log(`${testType} test completion status updated to ${isCompleted}`);
  } catch (error) {
    console.error("Error updating test completion status:", error);
    throw error;
  }
}











