import { Stack } from 'expo-router';

const MothGramLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="mothgramStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mothgramQuiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mothgramResult"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mothgramLesson"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mothgramCongrats"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default MothGramLayout;