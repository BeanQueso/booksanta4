import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header, Icon, Badge} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'

export default class MyHeader extends React.Component{
constructor(props){
    super(props);
        this.state = {
            value:''
        }
    }

    getNumberOfUnreadNotifications = ()=>{
        db.collection("all_notifications").where("notification_status", "==", "unread")
        .onSnapshot((snapshot)=>{
            var unreadNotifications = snapshot.docs.map((doc)=>{
                doc.data();
            })
        
        this.setState({
            value:unreadNotifications.length
        })
    })
    }

    componentDidMount(){
        this.getNumberOfUnreadNotifications();
    }

    BellIconWithBadge = ()=>{
        return(
            <View>
                   <Icon
                name = 'bell'
                type = 'font-awesome'
                color = 'blue'
                size = {23}
                onPress = {()=>{
                   this.props.navigation.navigate('Notifications')
                }}
                />
                <Badge 
                value = {this.state.value} 
                containerStyle = {{position:'absolute', top:-4, right:-4}}
                />
            </View>
        );
    }

    render(){
        return(
            <Header 
        leftComponent = {
        <Icon
        name = 'bars'
        type = 'font-awesome'
        color = 'gray'
        onPress = {()=>{
            this.props.navigation.toggleDrawer();
        }}
        />
    }
        centerComponent = {{text:this.props.title, style:{color:'blue', fontSize:20, fontWeight:'bold', width:200, textAlign:'center'}}}
        rightComponent = {
         <this.BellIconWithBadge {...this.props}/>
        }
        backgroundColor = "aqua"
        
        />
        );
    }
}