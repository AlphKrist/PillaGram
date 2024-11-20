import { Stack } from 'expo-router';

const TimesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="courses"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default TimesLayout;
