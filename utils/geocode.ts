import * as Location from "expo-location";

export default async function geocodeAddress(dText: string) : Promise<number[] | undefined> {
    try {
        const geocodedLocation = await Location.geocodeAsync(dText);
        const lat: number = geocodedLocation[0].latitude;
        const long: number = geocodedLocation[0].longitude;
        const locCords = [lat, long];
        return locCords;
    }
    catch (e){
        return undefined;
    }
}