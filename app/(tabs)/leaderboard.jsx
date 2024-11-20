import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import useAppwrite from "../../lib/useAppwrite";
import { fetchLeaderboard, getCurrentUser, addXPToUser } from "../../lib/appwrite";
import { designs } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Loader } from '../../components';

const Leaderboard = () => {
  const { data: leaderboard, loading, refetch: refetchLeaderboard } = useAppwrite(fetchLeaderboard);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [userXP, setUserXP] = useState(0);
  const { user: globalUser, darkMode } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch leaderboard data
      await refetchLeaderboard();
      
      // Refetch user data
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setUserXP(user.userXP);  // Update user XP
        setUsername(user.username);  // Update username
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);  // Stop the refreshing animation
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user) {
          setUserXP(user.userXP);  // No need for fetchUserXP, use user.xp directly
          setUsername(user.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const renderLeaderboard = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    if (leaderboard.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No leaderboard data available</Text>
        </View>
      );
    }

    return (
      <ScrollView 
      style={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {leaderboard.map((user, index) => (
          <View key={user.$id} style={styles.itemContainer}>
            <Text style={darkMode ? styles.rankDark : styles.rank}>{index + 1}</Text>
            <Image
              source={designs.design1}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text adjustsFontSizeToFit numberOfLines={1} style={darkMode ? styles.usernameDark : styles.username}>{user.username}</Text>
              <Text style={darkMode ? styles.scoreDark : styles.score}>{user.userXP} Petals</Text> 
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={darkMode ? styles.safeAreaDark : styles.safeArea}>
      <Loader isLoading={loading} />
      <Image source={darkMode ? designs.downstars : designs.downstars1} style={styles.downstars} />
      <Image source={darkMode ? designs.upstars : designs.upstars1} style={styles.upstars} />
      <View style={styles.iconContainer}>
        <Image source={designs.design1} style={styles.icon} resizeMode="contain" />
      </View>

      <View style={styles.userXPContainer}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={darkMode ? styles.usernameTextDark : styles.usernameText}>
          {username} 
        </Text>
        <Text style={darkMode ? styles.userXPTextDark : styles.userXPText}>{userXP} Petals</Text>
      </View>

      <View style={darkMode ? styles.leaderboardTitleContainerDark : styles.leaderboardTitleContainer}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
      </View>

      <View style={darkMode ? styles.containerDark : styles.container}>
        {renderLeaderboard()}
      </View>
      
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffeff7',
  },
  safeAreaDark: {
    flex: 1,
    backgroundColor: '#2e375b',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 10,
  },
  icon: {
    width: 56,
    height: 56,
  },
  userXPContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  userXPText: {
    fontSize: 18,
    marginTop: 5,
    color: '#feb6c3',
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  userXPTextDark: {
    fontSize: 18,
    marginTop: 5,
    color: '#979CAF',
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  usernameText: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    maxWidth: '50%',
  },
  usernameTextDark: {
    fontSize: 28,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#d1d5fa',
    maxWidth: '50%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eac2cf',
    borderRadius: 10,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  containerDark: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d1d5fa',
    borderRadius: 10,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  scrollContainer: {
    
  },
  rank: {
    fontSize: 30,
    textAlign: 'left',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    width: '15%',
  },
  rankDark: {
    fontSize: 30,
    textAlign: 'left',
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#2e375b',
    width: '15%',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 23,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    maxWidth: '60%',
    flexShrink: 1,
  },
  usernameDark: {
    fontSize: 23,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#5c6898',
    maxWidth: '60%',
    flexShrink: 1,
  },
  score: {
    fontSize: 14,
    color: '#c67b88',
    fontFamily: 'BarlowSemiCondensed-SemiBold',
    textAlign: 'right',
  },
  scoreDark: {
    fontSize: 14,
    color: '#979caf',
    fontFamily: 'BarlowSemiCondensed-SemiBold',
    textAlign: 'right',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
  upstars: {
    position: 'absolute',
    marginTop: 70,
    marginLeft: 300,
    width: 70,
    height: 100,
    resizeMode: 'contain',
    transform: [{ rotate: '-15deg' }],
  },
  downstars: {
    position: 'absolute',
    marginTop: 70,
    marginLeft: 10,
    width: 70,
    height: 100,
    resizeMode: 'contain',
    transform: [{ rotate: '-15deg' }],
  },
  leaderboardTitleContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#c67b88',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  leaderboardTitleContainerDark: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#6B6EAA',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  leaderboardTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'BarlowSemiCondensed-Bold',
  },
});

export default Leaderboard;
