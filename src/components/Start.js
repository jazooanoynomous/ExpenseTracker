// import { StyleSheet, Alert, View, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Image, Platform, KeyboardAvoidingView } from 'react-native';
// import { useState } from 'react';
// import { getAuth, signInAnonymously } from "firebase/auth";

// const Start = ({ navigation }) => {
//     const [name, setName] = useState('');
//     const [color, setColor] = useState('');

//     // returns the authentication handle of Firebase
//     const auth = getAuth();

//     const signInUser = () => {
//         signInAnonymously(auth)
//             // information object -> represented by results 
//             .then(result => {
//                 // once user has signed in, the app navigates to the Chat screen while passing result.user.uid and other props

//                 navigation.navigate('Chat', { name: name, color: color, userID: result.user.uid })
//                 Alert.alert("Signed in Successfully!");
//             })
//             .catch((error) => {
//                 Alert.alert("Unable to sign in, try later again.");
//                 console.error(error)
//             })
//     }

//     return (
//         <ScrollView contentContainerStyle={{ flex: 1 }}>
//             <ImageBackground source={require('../assets/BackgroundImage.png')} resizeMode="cover" style={styles.image}>
//                 <Text style={[styles.text, { fontSize: 45, height: '35%', marginTop: '15%' }]}>Chat App</Text>
//                 <View style={styles.containerWhite}>
//                     <View style={styles.containerName}>
//                         <Image source={require('../assets/iconName.png')} style={styles.icon} />
//                         <TextInput
//                             style={styles.textInput}
//                             value={name}
//                             onChangeText={setName}
//                             placeholder='Your name'
//                             accessible={true}
//                             accessibilityLabel="Enter your name"
//                             accessibilityHint="Type your name here, this name will be visible to others in the chat"
//                             accessibilityRole="text"
//                         />
//                     </View>
//                     <View style={styles.containerColor}>
//                         <Text style={styles.textColor}>Choose Background color:</Text>
//                         <View style={styles.colorOptions}>
//                             <TouchableOpacity
//                                 style={[styles.colorOption, { backgroundColor: '#090C08' }, color === '#090C08' && { borderColor: '#B9C6AE' }]}
//                                 onPress={() => setColor('#090C08')}
//                             />
//                             <TouchableOpacity
//                                 style={[styles.colorOption, { backgroundColor: '#474056' }, color === '#474056' && { borderColor: '#090C08' }]}
//                                 onPress={() => setColor('#474056')}
//                             />
//                             <TouchableOpacity
//                                 style={[styles.colorOption, { backgroundColor: '#8A95A5' }, color === '#8A95A5' && { borderColor: '#474056' }]}
//                                 onPress={() => setColor('#8A95A5')}
//                             />
//                             <TouchableOpacity
//                                 style={[styles.colorOption, { backgroundColor: '#B9C6AE' }, color === '#B9C6AE' && { borderColor: '#8A95A5' }]}
//                                 onPress={() => setColor('#B9C6AE')}
//                             />
//                         </View>
//                     </View>
//                     <TouchableOpacity style={styles.startButton}
//                         onPress={signInUser}
//                         accessible={true}
//                         accessibilityLabel="Enter the chat"
//                         accessibilityHint="Press the button to open a new window and start chatting with others"
//                         accessibilityRole="button">
//                         <Text style={[styles.text, { fontSize: 16 }]}>Start chatting</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ImageBackground>
//             {/* makes sure keyboard will not cover everything on Iphone */}
//             {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     image: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//     },
//     containerWhite: {
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         backgroundColor: 'white',
//         height: '44%',
//         width: '88%',
//     },
//     containerName: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderRadius: 3,
//         color: '#757083',
//         opacity: 0.5,
//         width: "88%",
//         height: '22%',
//         position: 'fixed'
//     },
//     icon: {
//         width: 25,
//         height: 25,
//         padding: 2,
//         marginLeft: 20,
//         marginRight: 10,
//         resizeMode: 'contain',
//     },
//     textInput: {
//         width: "78%",
//         marginTop: 15,
//         marginBottom: 15,
//         borderRadius: 3,
//         fontSize: 16,
//         fontWeight: '300',

//     },
//     containerColor: {
//         alignItems: 'flex-start',
//         width: '88%',
//         position: 'fixed'
//     },
//     textColor: {
//         color: '#757083',
//         fontSize: 16
//     },
//     colorOptions: {
//         justifyContent: 'space-between',
//         flexDirection: 'row',
//     },
//     colorOption: {
//         borderRadius: 50,
//         padding: 20,
//         margin: 5,
//         borderWidth: 3,
//         borderColor: 'transparent',
//         width: 50, // Set the total size of the touchable area
//         height: 50,
//     },
//     startButton: {
//         width: "88%",
//         padding: 50,
//         backgroundColor: '#757083',
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//         position: 'fixed'
//     },
//     text: {
//         fontWeight: '600',
//         color: '#FFFFFF'
//     }
// });

// export default Start;