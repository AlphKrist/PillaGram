import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { designs } from '../constants';
import { CustomButton, Loader } from '../components';
import { useGlobalContext } from "../context/GlobalProvider";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />
      <ScrollView 
        contentContainerStyle={{
          height: '100%'
        }}>

        <View 
        className="w-full justify-center items-center min-h-[85vh] px-5"
        style={styles.container}>
            
            <Text
            className="text-white font-bblack text-center"
            style={{
              fontSize:75,
              lineHeight: 70,
            }}
            >
            {"\n"}
            PillaGram
            </Text>

            <Text className="text-secondary font-tultrabold"
            style={{
              fontSize: 18,
              paddingVertical: 0,
            }}>
              Thinking Everything
            </Text>
            
            <Image
              source={designs.design1}
              className="w-[220px] h-[300px]"
              resizeMode='contain'
              style={{
                right: -30,
              }}
             />
        
            <Image
              source={designs.design20}
              style={{
                position: 'absolute',
                width: 700,
                height: 700,
                top: 300,
                left: -110, // Adjust spacing as needed   
                resizeMode: "contain",
              }}
            />

            <Text
            className="text-secondary font-bblack text-center"
            style={{
              fontSize: 50,
            }}
            >WELCOME!
            </Text>

            <Text className="text-secondary font-bregular text-center">
            "The roots of education are bitter,{"\n"}
            but the fruit is sweet" -Aristotle
            </Text>

            <CustomButton
            title="Continue with Login"
            handlePress={() => router.push('sign-in')}
            containerStyles="w-[300px] mt-7"  
             />    
        </View>

        <View style={styles.container}>
           
           <Image
            source={designs.design5} // top left corner
            tintColor="#5C6898"
            className="w-[150px] h-[150px]"
            style={{
              position: 'absolute',
              top: -780,
              left: -50, 
              transform: [{rotate: '10deg'}],
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design2} // right top corner
            className="w-[300px] h-[300px]"
            style={{
              position: 'absolute',
              top: -850, 
              right: -140, 
              transform: [{rotate: '-3deg'}],
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design22} // left star design
            className="w-[220px] h-[220px]"
            style={{
              position: 'absolute',
              top: -595, 
              left: -40, 
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design3} // right star design
            className="w-[220px] h-[220px]"
            style={{
              position: 'absolute',
              top: -595, 
              right: -40, 
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design4} // right plant
            className="w-[250px] h-[250px]"
            style={{
              position: 'absolute',
              top: -475, 
              right: -115, 
              resizeMode: "contain",
            }}
           />
           
           <Image
            source={designs.design4} // next to right plant
            className="w-[150px] h-[150px]"
            style={{
              position: 'absolute',
              top: -380, 
              right: -8, 
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design21} // left plant
            className="w-[250px] h-[250px]"
            style={{
              position: 'absolute',
              top: -475, 
              left: -115, 
              resizeMode: "contain",
            }}
           />

           <Image
            source={designs.design21}
            className="w-[210px] h-[210px]"
            style={{
              position: 'absolute',
              top: -405, 
              left: -35, 
              resizeMode: "contain",
            }}
           />

        </View>  
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
