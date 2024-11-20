import { Stack } from 'expo-router';

const TaleTimeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="taletimeStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeb4quiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeb4quiz2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeb4read"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeb4read2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeLesson"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeLesson2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeLesson3"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeQuiz"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeQuiz2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeResult"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeResult2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="taletimeCongrats"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default TaleTimeLayout;