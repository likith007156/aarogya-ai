import requests
from config import GOOGLE_MAPS_API_KEY

class LocationService:

    def get_location_from_coordinates(
        self, latitude, longitude
    ):
        """
        Convert GPS coordinates to readable address
        Uses Google Geocoding API
        """
        try:
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/geocode/json"
                f"?latlng={latitude},{longitude}"
                f"&language=hi"        # Hindi address
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            if data["status"] == "OK":
                result = data["results"][0]
                return {
                    "success": True,
                    "formatted_address": (
                        result["formatted_address"]
                    ),
                    "latitude": latitude,
                    "longitude": longitude,
                    "place_id": result["place_id"]
                }
            else:
                return {
                    "success": False,
                    "error": "Location not found"
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_coordinates_from_pincode(self, pincode):
        """
        For users who type their PIN code
        instead of sharing GPS location
        """
        try:
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/geocode/json"
                f"?address={pincode},India"
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            if data["status"] == "OK":
                location = (
                    data["results"][0]
                    ["geometry"]["location"]
                )
                return {
                    "success": True,
                    "latitude": location["lat"],
                    "longitude": location["lng"],
                    "formatted_address": (
                        data["results"][0]
                        ["formatted_address"]
                    )
                }
            else:
                return {
                    "success": False,
                    "error": "Pincode not found"
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_coordinates_from_village_name(
        self, village, district, state
    ):
        """
        For rural users who know their
        village and district name
        """
        try:
            query = f"{village},{district},{state},India"
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/geocode/json"
                f"?address={query}"
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            if data["status"] == "OK":
                location = (
                    data["results"][0]
                    ["geometry"]["location"]
                )
                return {
                    "success": True,
                    "latitude": location["lat"],
                    "longitude": location["lng"],
                    "address": (
                        data["results"][0]
                        ["formatted_address"]
                    )
                }

        except Exception as e:
            return {"success": False, "error": str(e)}
