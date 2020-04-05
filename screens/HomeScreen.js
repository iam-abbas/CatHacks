import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from "react-native";
import * as firebase from "firebase";
import MapView, { Marker } from "react-native-maps"

import { Ionicons } from '@expo/vector-icons';
import { setLightEstimationEnabled } from "expo/build/AR";


function Item({ title, description }) {
    return (
        <View style={styles.item}>
            <View style={styles.ico}>
                <Ionicons name="ios-business" size={22} color={"#fff"} />
            </View>
            <View style={styles.info}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            region: null,
            dataSource: [],
        }
    }


    state = {
        email: "",
        displayName: "",

    };


    componentDidMount() {
        const { email, displayName } = firebase.auth().currentUser;

        this.setState({ email, displayName });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.045,
                    longitudeDelta: 0.045,
                }
                fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + position.coords.latitude + "," + position.coords.longitude + "&radius=1900&type=hospital&key=AIzaSyAEatyPE8FwTqny-1nLGunYN5apRKStSic")
                    .then(response => response.json())
                    .then((responseJson) => {
                        let data = []
                        let ann = []
                        for (var i = 0; i < responseJson["results"].length; i++) {
                            data[i] = {
                                id: i + 1,
                                latitude: responseJson["results"][i]["geometry"]["location"]["lat"],
                                longitude: responseJson["results"][i]["geometry"]["location"]["lng"],
                                name: responseJson["results"][i]["name"],
                                addr: responseJson["results"][i]["vicinity"]
                            }
                        }
                        // console.log(data)
                        this.setState({
                            dataSource: data
                        })
                    })
                    .catch(error => console.log(error))
                this.setState({ region: region })
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );


    }


    signOutUser = () => {
        firebase.auth().signOut();
    }





    render() {

        let markers = this.state.dataSource.map((dealer, index) => (
            <MapView.Marker
                key={index}
                coordinate={{
                    latitude: dealer.latitude,
                    longitude: dealer.longitude,
                }}
                title={dealer.name}
            />
        ));

        return (
            <View style={styles.container}>
                <View style={styles.pageHead}><Text style={styles.pageTitle}>Nerby Health Centers</Text></View>
                <MapView
                    initialRegion={this.state.region}
                    showsUserLocation={true}
                    annotations={this.state.annot}
                    showsCompass={true}
                    rotateEnabled={false}
                    style={styles.mapStyle}
                >

                    {markers}

                </MapView>

                <View style={styles.horizontalMenu}>
                    <FlatList
                        horizontal
                        data={this.state.dataSource}
                        renderItem={({ item }) => <Item title={item.name} description={item.addr} />}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    horizontalMenu: {
        height: 230,
        position: "absolute",
        justifyContent: "center",
        flex: 1,
        alignContent: "center",
        bottom: 10,
    },
    item: {
        flex: 1,
        flexDirection: "row",
        top: 30,
        shadowColor: "#1f1f1f",
        shadowRadius: 12,
        justifyContent: "center",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        borderRadius: 10,
        backgroundColor: "white",
        padding: 25,
        paddingLeft: 30,
        paddingRight: 30,
        margin: 15,
        height: 100,
        marginVertical: 8,
        marginHorizontal: 16,
        minWidth: 260,
        maxWidth: 280,
    },
    title: {
        color: "#b32400",
        fontSize: 14,
        fontWeight: "600",
    },
    description: {
        fontSize: 12,
        paddingTop: 5,
    },
    ico: {
        backgroundColor: "#ff8566",
        padding: 17,
        alignSelf: "center",
        borderRadius: 30,
        color: "#ffffff",
    },
    info: {
        marginLeft: 20,
        alignSelf: "center",
    },
    pageHead: {
        position: "absolute",
        height: 67,
        width: "100%",
        backgroundColor: "#ff8566",
        top: 0,
        alignContent: "center",
        justifyContent: "flex-end",
        zIndex: 999,
        shadowColor: "#1f1f1f",
        shadowRadius: 12,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    pageTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "500",
        alignSelf: "center",
        color: "white"
    }

});
