import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import {ListItem} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'


export default class BookDonateScreen extends Component{

    constructor(){
        super();
        this.state = {
            requestedBooksList:[],
            userId:firebase.auth().currentUser.email
        }
        this.requestRef = null;
    }

    getRequestedBookList = ()=>{
        this.requestRef = db.collection("requested_books").onSnapshot((snapshot)=>{
            var requestedBooksList = snapshot.docs.map((doc) =>doc.data())
            this.setState({
                requestedBooksList:requestedBooksList,
            })
            console.log("requestedBookList"+requestedBooksList)
        })
    }

    componentDidMount(){
        this.getRequestedBookList();
    }

    componentWillUnmount(){
        this.requestRef();
    }
    keyExtractor = (item,index)=>{
        index.toString()
    }
    renderItem = ({item,i})=>{
        return(
            <ListItem 
            key = {i}
            title = {item.book_name}
            subtitle = {item.reason_to_request}
            titleStyle = {{
                color:'black',
                fontWeight:"bold"
            }}

            leftElement = {
                <Image
                style = {{height:50, width:50}}
                source = {{uri:item.image_link}}
                />
            }

            rightElement = {
                <TouchableOpacity style = {styles.button} onPress = {
                    ()=>{
                        this.props.navigation.navigate('RecieverDetails', {'details':item})
                    }
                }>
                    <Text style = {{color:'aqua'}}>
                        View
                    </Text>
                </TouchableOpacity>
            }
            bottomDivider
            />
        )
    }

    render(){
        return(
            <View style = {{
                flex:1
            }}>
                <MyHeader title = "Donate Books" navigation = {this.props.navigation}/>

                <View style = {{flex:1}}>
                    {
                        this.state.requestedBooksList.length === 0
                        ?(
                            <View style = {styles.subContainer}>
                            <Text style = {{fontSize:20}}>
                                list of all requested Books
                            </Text>
                            </View>
                        )
                        :(
                            <FlatList
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.requestedBooksList}
                            renderItem = {this.renderItem}
                            />
                        )
                    }
                </View>                
            </View>
        );
    }
}
const styles = StyleSheet.create({ subContainer:{ flex:1, justifyContent:'center', alignItems:'center' }, button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8 } } })