import React from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { LineChart } from "react-native-chart-kit";


export default class Statistics extends React.Component {
    static navigationOptions = {
        headerShown: true,
    };

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            region: null,
            country: null,
            dataSource: [],
            countryCases: [],
            country: null,
            chartData: {
                data: [0, 0, 0, 0, 0],
                label: [],
            },
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
                fetch("http://api.geonames.org/countryCodeJSON?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude + "&username=covid")
                    .then(response => response.json())
                    .then((responseJson) => {
                        let data_c = responseJson
                        this.setState({ country: data_c.countryName })
                        fetch("http://covid2019-api.herokuapp.com/v2/country/" + data_c["countryCode"])
                            .then(response => response.json())
                            .then((responseJson) => {
                                let c_cases = responseJson["data"]
                                this.setState({ countryCases: c_cases })
                                this.setState({ loading: false })
                            })
                    })

            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },

        );

        fetch("http://covid19.mathdro.id/api/daily")
            .then(response => response.json())
            .then((responseJson) => {
                let datac = {
                    data: [],
                    label: [],
                }
                for (var i = 0; i < 6; i++) {
                    datac.data[i] = responseJson[responseJson.length - 1 - i]["totalConfirmed"]
                    datac.label[i] = responseJson[responseJson.length - 1 - i]["reportDate"].replace(/2020-/gi, "").replace(/-/gi, "/")

                }
                datac.data = datac.data.reverse()
                this.setState({
                    chartData: datac
                })
            })

        fetch("http://covid2019-api.herokuapp.com/v2/total")
            .then(response => response.json())
            .then((responseJson) => {
                let data = responseJson["data"]
                this.setState({
                    dataSource: data
                })
            })

    }

    renderChart() {
        const chartConfig = {
            backgroundGradientFrom: "#210BFE",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#210BFE",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 133, 102, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                padding: 30,
            },
            propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#ff8566"
            }
        };

        const screenWidth = Dimensions.get("window").width;
        const data = {
            labels: this.state.chartData.label,
            datasets: [
                {
                    data: this.state.chartData.data,

                }
            ]
        };

        return (
            <View style={{ marginBottom: 120, flex: 1 }}>
                <View style={styles.chart}>
                    <Text style={styles.growth}>GLOBAL GROWTH PAST 5 DAYS</Text>
                    <LineChart
                        data={data}
                        width={screenWidth - 40}
                        height={250}
                        chartConfig={chartConfig}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View>
                <View style={styles.pageHead}><Text style={styles.pageTitle}>Statistics</Text></View>
                {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#ff8566"></ActivityIndicator>
                    </View>
                }
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                    <View style={styles.card1}>
                            <Text style={{
                                        fontSize: 12,
                                        color: "#686c77",
                                        fontWeight: "600",
                                        paddingBottom: 15,
                                        textTransform: "uppercase",
                                        width: "100%",
                                        alignSelf: "center",
                                        textAlign: "center",
                            }}>NEARBY CASES</Text>
                            <View style={{ flexDirection: "row", width: "100%", textAlign: "center"}}>
                                <View style={{color: "#ff8566",  width: "100%"}}>
                                    <Text style={{fontSize: 28,  width: "100%", textAlign: "center", fontWeight: "700", alignSelf: "center",color: "#ff8566"}}>18</Text>
                                </View>
                            </View>
                        </View>
                    <View style={styles.card}>
                            <Text style={styles.head}>BEDS AVAILABLE</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.conf}>
                                    <Text style={styles.num}>12032</Text>
                                    <Text style={styles.Title}>CALIFORNIA</Text>
                                </View>
                                <View style={styles.de}>
                                    <Text style={styles.num}>92</Text>
                                    <Text style={styles.Title}>BERKELEY</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.head}>{this.state.country} SITUATION</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.conf}>
                                    <Text style={styles.num}>{this.state.countryCases.confirmed}</Text>
                                    <Text style={styles.Title}>CONFIRMED</Text>
                                </View>
                                <View style={styles.de}>
                                    <Text style={styles.num}>{this.state.countryCases.deaths}</Text>
                                    <Text style={styles.Title}>DEATHS</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.head}>GLOBAL SITUATION</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.conf}>
                                    <Text style={styles.num}>{this.state.dataSource.confirmed}</Text>
                                    <Text style={styles.Title}>CONFIRMED</Text>
                                </View>
                                <View style={styles.de}>
                                    <Text style={styles.num}>{this.state.dataSource.deaths}</Text>
                                    <Text style={styles.Title}>DEATHS</Text>
                                </View>
                            </View>
                        </View>
                        {this.renderChart()}
                    </View>
                </ScrollView>
            </View>


        );
    }
}

const styles = StyleSheet.create({

    card: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 130,
        borderRadius: 15,
        backgroundColor: "white",
        padding: 20,
        justifyContent: "center",
    },
    card1: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 130,
        borderRadius: 15,
        backgroundColor: "white",
        padding: 20,
        textAlign: "center",
        justifyContent: "center",

    },
    conf: {
        alignSelf: "center",
        paddingRight: 60,
    },
    de: {
        alignSelf: "center",
    },
    num: {
        fontSize: 26,
        color: "#595959",
        fontWeight: "700",
        paddingBottom: 7,
    },
    container: {
        marginTop: 60,
        backgroundColor: '#efeff2',
        flex: 1,
        justifyContent: "center",
    },
    Title: {
        color: "#8A8F9E",
        paddingLeft: 4,
        fontSize: 10,
        textTransform: "uppercase"
    },
    head: {
        fontSize: 12,
        color: "#686c77",
        fontWeight: "600",
        paddingBottom: 15,
        textTransform: "uppercase",

    },
    chart: {
        justifyContent: "center",
        alignSelf: "center",
        margin: 20,
        borderRadius: 15,
        backgroundColor: "white",

    },
    growth: {
        padding: 20,
        fontSize: 12,
        color: "#686c77",
        fontWeight: "600",
        paddingBottom: 15,
        textTransform: "uppercase",
    },
    loading: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        overflow: "hidden",
        position: "absolute",
        zIndex: 999,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    pageHead: {
        position: "absolute",
        height: "10%",
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
