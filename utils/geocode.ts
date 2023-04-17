import * as Location from "expo-location";
import { Coords } from "./postValidation";

/**
 * Geocodes an address and returns the latitude and longitude.
 * @param dText The address to geocode.
 * @returns The latitude and longitude of the address.
 */
export default async function geocodeAddress(dText: string): Promise<Coords | null> {
    try {
        const geocodedLocation = await Location.geocodeAsync(dText);
        const lat = geocodedLocation[0].latitude;
        const long = geocodedLocation[0].longitude;
        const locCords = {
            lat,
            long,
        };
        return locCords;
    } catch (e) {
        console.log("Invalid address.");
        return null;
    }
}
