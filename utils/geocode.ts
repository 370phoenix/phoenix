import * as Location from "expo-location";

export default async function geocodeAddress(dText: string) {
    const geocodedLocation = await Location.geocodeAsync(dText);
    let lat: number = geocodedLocation[0].latitude;
    let long: number = geocodedLocation[0].longitude;
    let locCords = [lat, long];
    return locCords;
}