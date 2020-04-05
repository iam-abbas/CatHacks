import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import AntIcon from "react-native-vector-icons/AntDesign"
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";
import TestRequest from "./screens/TestRequest";
import Statistics from "./screens/Statistics";



import * as firebase from "firebase";

var firebaseConfig = require("./firebase.json")

firebase.initializeApp(firebaseConfig);

signOutUser = () => {
    firebase.auth().signOut();
};

const AppTabNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (<AntIcon name="appstore-o" size={22} color={tintColor} />)
            }
        },
        Stats: {
            screen: Statistics,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-stats" size={22} color={tintColor} />)
            }
        },
        Test: {
            screen: TestRequest,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-flask" size={22} color={tintColor} />),
            },


        },
        Logout: {
            screen: () => null,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (<AntIcon name="logout" size={22} color={tintColor} onPress={this.signOutUser} />)
            }
        }
    },
    {
        tabBarOptions: {
            style: {
                position: 'absolute',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                height: 70,
                marhinTop: 70,
                backgroundColor: '#fff',
                borderTopColor: 'transparent',
                borderRadius: 8,
                shadowColor: "#1f1f1f",
                shadowRadius: 12,
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
            },
            activeTintColor: "#ff8566",
            inactiveTintColor: "#c3c9d1",
            showLabel: false,

        },

    },

);

const AuthStack = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#ff8566',
                elevation: 0,
                shadowOpacity: 0
            },
            headerTintColor: '#fff',

        },
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#ff8566',
                elevation: 0,
                shadowOpacity: 0
            },
            headerTintColor: '#fff',
        },
    }

});

export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            App: AppTabNavigator,
            Auth: AuthStack
        },
        {
            initialRouteName: "Loading"
        }
    )
);
