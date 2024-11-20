import { Stack } from 'expo-router';

const StoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="storyStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyStart2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyQuiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyQuiz2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyBeforeQuiz2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyResult"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyResult2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storyLesson"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
          name="storyLesson2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="storyCongrats"
          options={{
            headerShown: false,
          }}
        />
    </Stack>
  );
};

export default StoryLayout;