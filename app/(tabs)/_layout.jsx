import { Image, Text, View } from 'react-native';
import { Stack, Tabs, Redirect, Link, router} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { icons } from '../../constants';
import { Loader } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-5 h-5"
      />
    </View>
  );
};

const TabsLayout = () => { 
  const { loading, isLogged, darkMode } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          
          tabBarShowLabel: false,
          tabBarActiveTintColor: darkMode ? "#d1d5fa" : "#c67b88",
          tabBarInactiveTintColor: darkMode ? "#5c6898" : "#feb6c3",
          tabBarStyle: {
            backgroundColor: darkMode ? "#2e375b" : "#ffeff7",
            borderTopWidth: 1,
            borderTopColor: darkMode ? "#5c6898" : "#c67b88",
            height: 40,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="time"
          options={{
            title: 'Time',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.clock}
                color={color}
                name="Time"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.leaderboard}
                color={color}
                name="Leaderboard"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>


      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabsLayout;
