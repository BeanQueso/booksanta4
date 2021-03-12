import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import MyHeader from '../components/MyHeader'
import db from '../config'
import firebase from 'firebase'
export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            firstName:'',
            lastName:'',
            contact:'',
            address:'',
            docId:'',
            emailId:''
        }
    }

    getUserDetails = ()=>{
        var email = firebase.auth().currentUser.email;
        db.collection('Users').where('email_id', '==', email).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var data = doc.data();
                this.setState({
                    emailId:data.email_id,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    contact:data.contact,
                    address:data.address,
                    docId:doc.id
                })
            })
        })
    }

    updateUserDetails = ()=>{
        db.collection('Users').doc(this.state.docId).update({
            "first_name":this.state.firstName,
            "last_name":this.state.lastName,
            "contact":this.state.contact,
            "address":this.state.address,
        })
        alert("profile updated successfully")
    }

    componentDidMount(){
        this.getUserDetails();
    }

    render(){
        return(
            <View style = {styles.container}>
                <MyHeader title = "Settings" navigation = {this.props.navigation}/>
                <View style = {styles.fontContainer}>
                            <TextInput 
                            style = {styles.formTextInput}
                            placeholder = {"first name"}
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    firstName:text
                                })
                            }}
                            />
                            <TextInput 
                            style = {styles.formTextInput}
                            placeholder = {"last name"}
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    lastName:text
                                })
                            }}
                            />
                            <TextInput 
                            style = {styles.formTextInput}
                            placeholder = {"contact"}
                            maxLength = {10}
                            keyboardType = {'numeric'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    contact:text
                                })
                            }}
                            />

                            <TextInput 
                            style = {styles.formTextInput}
                            placeholder = {"address"}
                            multiline = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    address:text
                                })
                            }}
                            />

                            <TouchableOpacity style = {styles.button} onPress = {()=>{
                                this.updateUserDetails()
                            }}>
                                <Text style = {styles.buttonText}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContainer:{
      flex:1,
      width:'100%',
      alignItems: 'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20,
      alignSelf:'center'
    },
    buttonText:{
      fontSize:25,
      fontWeight:"bold",
      color:"#fff"
    }
  })
  