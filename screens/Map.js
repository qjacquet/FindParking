import React from 'react';
import {
    StyleSheet,
    Text, View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import MapView from 'react-native-maps';
import parkingsSpots from '../api/parkings';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Dropdown from 'react-native-modal-dropdown';
import * as theme from '../theme';

const { height, width } = Dimensions.get('screen');
const { Marker } = MapView;

export default class Map extends React.Component {

    state = {
        hours: {},
        active: null,
        activeModal: null
    }

    /**
     * Lifecycle functions
     */

    componentDidMount() {
        const hours = {};
        parkingsSpots.map(parking => { hours[parking.id] = 1 });
        this.setState({ hours });
    }

    /**
     * Helper functions
     */



    /**
     * Render functions
     */

    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={styles.headerLocationInfo}>
                    <Text style={styles.headerTitle}>Detected location</Text>
                    <Text style={styles.headerLocation}>San Francisco, US</Text>
                </View>
                <View style={styles.headerIcon}>
                    <TouchableWithoutFeedback>
                        <Ionicons name="ios-menu" size={theme.SIZES.icon * 1.5} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    renderParking(item) {
        const { hours } = this.state;
        return (
            <TouchableWithoutFeedback key={`parking-${item.id}`} onPress={() => this.setState({ active: item.id })} >
                <View style={[styles.parking, styles.shadow]}>
                    <View style={styles.hours}>
                        <Text style={styles.hoursTitle}>x {item.spots} {item.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.renderHours()}
                            <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
                        </View>
                    </View>
                    <View style={styles.parkingInfoContainer}>
                        <View style={styles.parkingInfo}>
                            <View style={styles.parkingIcon}>
                                <Ionicons name='ios-pricetag' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                                <Text>${item.price}</Text>
                            </View>
                            <View style={styles.parkingIcon}>
                                <Ionicons name='ios-star' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                                <Text>{item.rating}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeModal: item })}>
                            <View style={styles.buyTotal}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome name='dollar' size={theme.SIZES.icon * 1.25} color={theme.COLORS.white} />
                                    <Text style={styles.buyTotalPrice}>{item.price * hours[item.id]}</Text>
                                </View>
                                <Text style={{ color: theme.COLORS.white }}>
                                    {item.price}x{hours[item.id]} hrs
                </Text>
                            </View>
                            <View style={styles.buyButton}>
                                <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderParkings() {
        return (
            <FlatList
                horizontal
                pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                snapToAlignment="center"
                style={styles.parkings}
                data={parkingsSpots}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={({ item }) => this.renderParking(item)}
            />
        )
    }

    renderHours() {
        return (
            <Dropdown
                defaultIndex={0}
                defaultValue={'01:00'}
                options={['01:00', '02:00', '03:00', '04:00', '05:00']}
                style={styles.hoursDropdown}
                dropdownStyle={styles.hoursDropdownStyle}
            />
        )
    }

    renderModal() {
        const { activeModal, hours } = this.state;
        if (!activeModal) return null;

        return (
            <Modal
                isVisible
                useNativeDriver
                style={styles.modalContainer}
                onBackButtonPress={() => this.setState({ activeModal: null })}
                onBackdropPress={() => this.setState({ activeModal: null })}
                onSwipeComplete={() => this.setState({ activeModal: null })}

            >
                <View style={styles.modal}>
                    <View>
                        <Text style={{ fontSize: theme.SIZES.font * 1.5 }}>
                            {activeModal.title}
                        </Text>
                    </View>
                    <View style={{ paddingVertical: theme.SIZES.base }}>
                        <Text style={{ color: theme.COLORS.gray, fontSize: theme.SIZES.font * 1.1 }}>
                            {activeModal.description}
                        </Text>
                    </View>
                    <View style={styles.modalInfo}>
                        <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
                            <Ionicons name='ios-pricetag' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
                            <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> ${activeModal.price}</Text>
                        </View>
                        <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
                            <Ionicons name='ios-star' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
                            <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.rating}</Text>
                        </View>
                        <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
                            <Ionicons name='ios-pin' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
                            <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.distance}km</Text>
                        </View>
                        <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
                            <Ionicons name='ios-car' size={theme.SIZES.icon * 1.3} color={theme.COLORS.gray} />
                            <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.free}/{activeModal.spots}</Text>
                        </View>
                    </View>
                    <View style={styles.modalHours}>
                        <Text style={{ textAlign: 'center', fontWeight: '500' }}>Choose your Booking Period:</Text>
                        <View style={styles.modalHoursDropdown}>
                            {this.renderHours()}
                            <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.payBtn}>
                            <Text style={styles.payText}>
                                Proceed to pay ${activeModal.price * hours[activeModal.id]}
                            </Text>
                            <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <MapView style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {parkingsSpots.map(parking =>
                        <Marker
                            key={`marker-${parking.id}`}
                            coordinate={parking.coordinate}>
                            <TouchableWithoutFeedback onPress={() => this.setState({ active: parking.id })} >
                                <View style={[
                                    styles.marker,
                                    styles.shadow,
                                    this.state.active === parking.id ? styles.active : null
                                ]}>
                                    <Text style={styles.markerPrice}>${parking.price}</Text>
                                    <Text style={styles.markerStatus}> ({parking.free}/{parking.spots})</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </Marker>
                    )}
                </MapView>
                {this.renderParkings()}
                {this.renderModal()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: theme.SIZES.base * 2,
        paddingTop: theme.SIZES.base * 2.5,
        paddingBottom: theme.SIZES.base * 1.5,
    },
    headerTitle: {
        color: theme.COLORS.gray,
    },
    headerLocation: {
        fontSize: theme.SIZES.font,
        fontWeight: '500',
        paddingVertical: theme.SIZES.base / 3,
    },
    headerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    headerLocationInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: width,
        height: height,
        flex: 3
    },
    parkings: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: theme.SIZES.base * 2,
        paddingBottom: theme.SIZES.base * 2
    },
    parking: {
        flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        borderRadius: 6,
        padding: theme.SIZES.base,
        marginHorizontal: theme.SIZES.base * 2,
        width: width - (24 * 2),
    },
    buy: {
        flex: 1.25,
        flexDirection: 'row',
        paddingHorizontal: theme.SIZES.base * 1.5,
        paddingVertical: theme.SIZES.base,
        backgroundColor: theme.COLORS.red,
        borderRadius: 6,
    },
    marker: {
        flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        borderRadius: theme.SIZES.base * 2,
        paddingVertical: 12,
        paddingHorizontal: theme.SIZES.base * 2,
        borderWidth: 1,
        borderColor: theme.COLORS.white,
    },
    markerPrice: {
        color: theme.COLORS.red,
        fontWeight: 'bold',
    },
    markerStatus: {
        color: theme.COLORS.gray
    },
    shadow: {
        shadowColor: theme.COLORS.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: theme.COLORS.white,
        elevation: 15
    },
    active: {
        borderColor: theme.COLORS.red,
    },
    hours: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: theme.SIZES.base / 2,
        justifyContent: 'space-evenly',
    },
    hoursTitle: {
        fontSize: theme.SIZES.text,
        fontWeight: '500',
    },
    hoursDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        paddingHorizontal: theme.SIZES.base,
        paddingVertical: theme.SIZES.base / 1.5,
        marginRight: theme.SIZES.base / 2,
    },
    hoursDropdownStyle: {
        marginLeft: -theme.SIZES.base,
        paddingHorizontal: theme.SIZES.base / 2,
        marginVertical: -(theme.SIZES.base + 1),
    },
    parkingInfoContainer: {
        flex: 1.5,
        flexDirection: 'row'
    },
    parkingInfo: {
        flex: 0.5,
        justifyContent: 'space-evenly',
        marginHorizontal: theme.SIZES.base * 1.5
    },
    parkingIcon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buyTotal: {
        flex: 1,
        justifyContent: 'center'
    },
    buyButton: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    buyTotalPrice: {
        color: theme.COLORS.white,
        fontSize: theme.SIZES.base * 2,
        fontWeight: '600',
        paddingLeft: theme.SIZES.base / 4, fontSize: 25,
        color: theme.COLORS.white
    },
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modal: {
        flexDirection: 'column',
        height: height * 0.75,
        padding: theme.SIZES.base * 2,
        backgroundColor: theme.COLORS.white,
        borderTopLeftRadius: theme.SIZES.base,
        borderTopRightRadius: theme.SIZES.base,
    },
    modalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: theme.SIZES.base,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: theme.COLORS.overlay,
        borderBottomColor: theme.COLORS.overlay,
    },
    modalHours: {
        paddingVertical: height * 0.15,
    },
    modalHoursDropdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.SIZES.base,
    },
    payBtn: {
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.SIZES.base * 1.5,
        backgroundColor: theme.COLORS.red,
    },
    payText: {
        fontWeight: '600',
        fontSize: theme.SIZES.base * 1.5,
        color: theme.COLORS.white,
    }
});