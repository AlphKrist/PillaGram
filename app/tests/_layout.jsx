import { Stack } from 'expo-router';

const TestLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="postTest"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="preTest"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="preTestQuiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="postTestQuiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="read"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default TestLayout;