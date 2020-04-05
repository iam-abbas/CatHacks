import React from "react";
import { View, Image, ScrollView, Keyboard, Text, Switch, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import { CheckBox } from 'react-native-elements'

export default class TestRequest extends React.Component {
    static navigationOptions = {
        headerShown: true,
    };

    constructor(props) {
        super(props)
        this.state = {
            region: null,
            _valid: false,
            phoneNo: "",
            aadharNo: "",
            switchValue: false,
            cough: false,
            fever: false,
            rnose: false,
            breath: false,
            email: "",
            displayName: "",
            errorMessage: ""
        }
        this.submitSymptoms()
    }

    _toggleShow = () => {
        this.setState({ showSymptoms: !this.state.showSymptoms })
    }

    validate() {

        if (this.state.phoneNo.length < 10) {
            this.setState({ errorMessage: "Please enter a valid mobile number." })
        } else if (this.state.aadharNo.length < 12) {
            this.setState({ errorMessage: "Please enter a valid Aadhar number." })
        } else {
            this.setState({ errorMessage: "" })
        }

        if (this.state.errorMessage.trim() === "") {
            this.setState({ _valid: true })
        }
    }


    submitSymptoms() {

        if (this.state._valid) {

            let data = {}
            data._valid = this.state._valid
            data.name = this.state.displayName
            data.email = this.state.email
            data.mobile = this.state.phoneNo
            data.aadhar = this.state.aadharNo
            data._isSymptomatic = this.state.switchValue
            data.cough = this.state.cough
            data.fever = this.state.fever
            data.runny_nose = this.state.rnose
            data.hard_breath = this.state.breath
            data.location = this.state.region


            var url = 'https://api.choros.io/request.php?api-key=0bac42d90721825fdda5ac671f1a7c1a64297fb9'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            alert("Successfully submited request for your test! Stay safe " + this.state.displayName.split(" ")[0]);

        }
    }

    componentDidMount() {
        const { email, displayName } = firebase.auth().currentUser;

        this.setState({ email, displayName });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                }
                this.setState({ region: region })
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.pageHead}><Text style={styles.pageTitle}>Request A Test</Text></View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        <Image style={{
                            flex: 1,
                            width: 350,
                            height: "auto",
                            alignContent: "center",
                            alignSelf: "center",
                            marginTop: 60,
                            resizeMode: 'contain'
                        }} source={require('../assets/lab.png')} />

                        <View style={styles.errorMessage}>
                            <Text style={styles.error}>{this.state.errorMessage}</Text>
                        </View>

                        <View style={styles.form}>
                            <View>
                                <Text style={styles.inputTitle}>Mobile Number</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    maxLength={10}
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={phoneNo => this.setState({ phoneNo })}
                                    value={this.state.phoneNo}
                                ></TextInput>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <Text style={styles.inputTitle}>GOVT ID</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    maxLength={12}
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={aadharNo => this.setState({ aadharNo })}
                                    value={this.state.aadharNo}
                                ></TextInput>
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: "center" }}>
                                <Text style={{ marginRight: 10, fontSize: 10, color: "#8A8F9E", textTransform: "uppercase" }}>Do You Have Symptoms? </Text>
                                <Switch
                                    value={this.state.switchValue}
                                    onValueChange={(switchValue) => {
                                        this.setState({ switchValue })
                                        this._toggleShow()
                                    }} />
                            </View>
                            {this.state.showSymptoms &&
                                <View style={{ marginTop: 12 }}>

                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ marginRight: 10, fontSize: 10, color: "#8A8F9E", textTransform: "uppercase" }}>Difficulty Breathing</Text>
                                        <CheckBox
                                            checked={this.state.breath}
                                            onPress={() => this.setState({ breath: !this.state.breath })}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ marginRight: 10, fontSize: 10, color: "#8A8F9E", textTransform: "uppercase" }}>Cough</Text>
                                        <CheckBox
                                            checked={this.state.cough}
                                            onPress={() => this.setState({ cough: !this.state.cough })}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ marginRight: 10, fontSize: 10, color: "#8A8F9E", textTransform: "uppercase" }}>fever</Text>
                                        <CheckBox
                                            checked={this.state.fever}
                                            onPress={() => this.setState({ fever: !this.state.fever })}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ marginRight: 10, fontSize: 10, color: "#8A8F9E", textTransform: "uppercase" }}>Runny Nose</Text>
                                        <CheckBox
                                            checked={this.state.rnose}
                                            onPress={() => this.setState({ rnose: !this.state.rnose })}
                                        />
                                    </View>
                                </View>
                            }


                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.submitSymptoms()
                                this.validate()
                                // this.setState({ _valid: true })
                            }}>
                                <Text style={{ color: "#FFF", fontWeight: "500" }}>Submit Test Request</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efeff2',
        marginTop: 30,
        flex: 1,
        justifyContent: "center",
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        top: 32,
        marginHorizontal: 30,
        backgroundColor: "#ff8566",
        borderRadius: 30,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 80,
        shadowColor: "#c0c2c3",
        elevation: 7,
        shadowRadius: 20,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 2 },
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
