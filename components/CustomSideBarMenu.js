import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'
import db from '../config'
import {Avatar} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
//import axios from 'axios'

export default class CustomSideBarMenu extends React.Component{
    constructor(){
        super();
        this.state = {
            image:'#',
            name:'',
            userId:firebase.auth().currentUser.email,
            docId:''
        }
    }

    getUserProfile = ()=>{
        db.collection("Users").where("email_id", "==", this.state.userId)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    name:doc.data().first_name+" "+doc.data().last_name,
                    docId:doc.id,
                    image:doc.data().image
                })
            })
        })
    }

    fetchImage = (imageName)=>{
        //to get image from the cloud storage
        var storageRef = firebase.storage().ref().child("user_profiles/"+imageName);

        //get the downloaded url
        storageRef.getDownloadURL().then((url)=>{
            this.setState({
                image:url
            })
        })
        .catch((error)=>{
            this.setState({
                image:"#"
            })
        })
    }

    uploadImage = async (uri, imageName)=>{
        //to upload the image to the cloud storage
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase.storage().ref().child("user_profiles/"+imageName);
        return ref.put(blob).then((response)=>{
            this.fetchImage(imageName)
        })
    }

    selectPicture = async ()=>{
        //using image picker to select the image from phone gallery
        const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!cancelled){
            //setting uri to image in state
            this.setState({
                image:uri
            })
            //passing uri and user id for name of image
            this.uploadImage(uri, this.state.userId)
        }
    }

    componentDidMount(){
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex:0.5, alignItems:'center', backgroundColor:'orange'}}>
                    <Avatar
                    rounded
                    source = {{uri:this.state.image}}
                    size = "medium"
                    onPress = {()=>{
                        this.selectPicture()
                    }}
                    containerStyle = {styles.imageContainer}
                    showEditButton
                    />

                    <Text style = {{fontWeight:"bold", fontSize:20, paddingTop:10}}>
                    {this.state.name}
                    </Text>
                </View>
              <View style = {styles.drawerItemsContainer}>
                  <DrawerItems {...this.props}/>
              </View>
              <View style = {styles.logOutContainer}>
            <TouchableOpacity style = {styles.logOutButton} onPress = {()=>{
                this.props.navigation.navigate('WelcomeScreen')
                firebase.auth().signOut();
            }}>
                <Text>
                    Log Out
                </Text>
            </TouchableOpacity>
              </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({   container: {     flex: 1,   },   drawerItemsContainer: {     flex: 0.8,   },   logOutContainer: {     flex: 0.2,     justifyContent: "flex-end",     paddingBottom: 30,   },   logOutButton: {     height: 30,     width: "100%",     justifyContent: "center",     padding: 10,   },   imageContainer: {     flex: 0.75,     width: "40%",     height: "20%",     marginLeft: 20,     marginTop: 30,     borderRadius: 40,   },   logOutText: {     fontSize: 30,     fontWeight: "bold",   }, });