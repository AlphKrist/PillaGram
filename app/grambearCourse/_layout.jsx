import { Stack } from 'expo-router';

const GramBearLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="grambearStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="grambearLesson"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="grambearQuiz"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="grambearResult"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="grambearCongrats"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default GramBearLayout;
