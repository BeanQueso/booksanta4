import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
import MyHeader from '../components/MyHeader'
import db from '../config'
import firebase from 'firebase'
import {BookSearch} from 'react-native-google-books'
import BookDonateScreen from './BookDonateScreen';


export default class BookRequestScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            bookName:'',
            reasonToRequest:'',
            isBookRequestActive:'',
            requestedBookName:'',
            bookStatus:'',
            requestId:'',
            docId:'',
            userDocId:'',
            imageLink:'',
            dataSource:'',
            showFlatList:false
        }
    }

    getBooksFromApi = async(bookName)=>{
        this.setState({
            bookName:bookName
        })
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName, 'AIzaSyCGaNpi13FU5aIed3dCgzi1BK_kLBCFWt8')
            this.setState({
                dataSource:books.data, 
                showFlatList:true
            })
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    getBookRequest = ()=>{
        //getting the requested book
        var bookRequest = db.collection('requested_books').where("user_id", "==", this.state.userId)
        .get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().book_status!=="received"){
                    this.setState({
                        requestId:doc.data().request_id,
                        requestedBookName:doc.data().book_name,
                        bookStatus:doc.data().book_status,
                        docId:doc.id
                    })
                }
            })
        })
    }

    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
    }

    getIsBookRequestActive = ()=>{
        db.collection("Users").where("email_id", "==", this.state.userId)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    isBookRequestActive:doc.data().isBookRequestActive,
                    userDocId:doc.id
                })
            })
        })
    }

    addRequest = async (bookName, reasonToRequest)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        var books = await BookSearch.searchbook(bookName, 'AIzaSyCGaNpi13FU5aIed3dCgzi1BK_kLBCFWt8')
        db.collection("requested_books").add({
            "user_id":userId,
            "book_name":bookName,
            "reason_to_request":reasonToRequest,
            "request_id":randomRequestId,
            "book_status":"requested",
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "image_link":books.data[0].volumeInfo.imageLinks.smallThumbnail
        })

        //setting isBookRequestActive to true and getting new book request when it is made.
        await this.getBookRequest()
        db.collection("Users").where("email_id", "==", userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('Users').doc(doc.id).update({
                    isBookRequestActive:true
                })
            })
        })

        this.setState({
            bookName:'',
            reasonToRequest:'',
            requestId:randomRequestId,
        })
        return alert("book requested successfully")

        
    }

    sendNotification = ()=>{
        //to get the first and the last name
        db.collection("Users").where("email_id", "==", this.state.userId)
        .get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().first_name
                var lastName = doc.data().last_name

                //to get the donor id and the book name
                db.collection("all_notifications").where("request_id", '==', this.state.requestId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donor_id
                        var bookName = doc.data().book_name

                        //targeted user id is the donor id to send notification to the user
                        db.collection("all_notifications").add({
                        "targeted_user_id":donorId,
                        "message":name+' '+lastName+' recieved the book '+bookName,
                        "notification_status":"unread",
                        "book_name":bookName
                        })
                    })
                })
            })
        })
    }

    updateBookRequestStatus = ()=>{
        //updating the book status after recieving the book
        db.collection("request_books").doc(this.state.docId).update({
            bookStatus:"recieved"
        })
        //getting the doc id to update the user's doc
        db.collection("Users").where("email_id", "==", this.state.userId)
        .get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                //updating the doc
                db.collection("Users").doc(doc.id).update({
                    isBookRequestActive:false
                })
            })
        })
    }

    recievedBooks = (bookName)=>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection("recieved_books").add({
            "user_id":userId,
            "book_name":bookName,
            "request_id":requestId,
            "bookStatus":"recieved"
        })
    }

    //render item function to render the books form api
    renderItem = ({item,i})=>{
        var obj = {
            title:item.volumeInfo.title,
            selfLink:item.selfLink,
            buyLink:item.saleInfo.buyLink,
            imageLink:item.volumeInfo.imageLinks
        }
        return(
            <TouchableHighlight
            style = {{
                alignItems:'center',
                backgroundColor:'blue',
                padding:10,
                width:'90%'
            }}
            activeOpacity = {0.6}
            underlayColor = 'black'
            onPress = {()=>{
                this.setState({
                    showFlatList:false,
                    bookName:item.volumeInfo.title
                })
            }} 
            bottomDivider
            >
                <Text>
                    {item.volumeInfo.title}
                </Text>
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.isBookRequestActive===true){
            return(
                <View style = {{flex:1, justifyContent:'center'}}>
                    <View style = {{borderColor:'orange', borderWidth:2, justifyContent:'center', alignItems:'center', padding:10, margin:10}}>
                        <Text>
                            Book Name
                        </Text>

                        <Text>
                            {this.state.requestedBookName}
                        </Text>
                    </View>
                    <View style = {{borderColor:'orange', borderWidth:2, justifyContent:'center', alignItems:'center', margin:10, padding:10}}>
                       <Text>
                           Book Status
                       </Text> 

                       <Text>
                           {this.state.bookStatus}
                       </Text>
                    </View>

                    <TouchableOpacity 
                    style = {{
                        borderWidth:1,
                        borderColor:'orange',
                        backgroundColor:'orange',
                        width:300,
                        alignSelf:'center',
                        alignItems:'center',
                        height:30,
                        marginTop:20
                    }}
                    onPress = {()=>{
                        this.sendNotification();
                        this.updateBookRequestStatus();
                        this.recievedBooks(this.state.requestedBookName);
                    }}>
                        <Text>I recieved the book</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
        return(
            <View style = {{flex:1}}>

                <MyHeader title = "Request Book" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                    <TextInput 
                    style = {styles.fromTextInput}
                    placeholder = {"Enter book name"}
                    onChangeText = {
                        (text)=>{
                            this.setState({
                                bookName:text
                            })
                        }
                    }
                    value = {this.state.bookName}
                    />

                    {
                        this.state.showFlatList ? 
                        (
                            <FlatList
                            data = {this.state.dataSource}
                            renderItem = {this.renderItem}
                            enableEmptySections = {true}
                            style = {{marginTop:10}}
                            keyExtractor = {(item, index)=>{
                                index.toString()
                            }}
                            />
                        ):(
                            <View style = {{alignItems:'center'}}>
                                <TextInput
                                     style = {[styles.fromTextInput, {height:300}]}
                                     placeholder = {"Why do you want the book"}
                                     multiline
                                     numberOfLines = {8}
                                     onChangeText = {
                                        (text)=>{
                                            this.setState({
                                            reasonToRequest:text
                                        })
                                     }
                                 }
                    value = {this.state.reasonToRequest}
                    />

                    <TouchableOpacity style = {styles.button} onPress = {()=>{
                        this.addRequest(this.state.bookName, this.state.reasonToRequest)
                    }}>
                        <Text>
                            Book Request
                        </Text>
                    </TouchableOpacity>
                            </View>
                        )
                    }
                </KeyboardAvoidingView>
            </View>
        );
                }
    }
}
const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
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
      marginTop:20
      },
    }
  )
  