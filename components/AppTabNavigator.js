import React, {component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import BookRequestScreen from '../screens/BookRequestScreen'
import {AppStackNavigator} from './AppStackNavigator' 

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks:{screen:AppStackNavigator, 
    navigationOptions:{
        tabBarIcon:<Image source = {require("../assets/request-list.png")}
        style = {{width:20, height:20}}
        />,
        tabBarLabel : "donate books"
    }
    },
    BookRequest:{screen:BookRequestScreen,
        navigationOptions:{
            tabBarIcon:<Image source = {require("../assets/request-book.png")}
            style = {{width:20, height:20}}
            />,
            tabBarLabel : "book request"
        }
    }
})

