import requests
from config import GOOGLE_MAPS_API_KEY, SEARCH_RADIUS

class HospitalFinder:

    def find_nearest_hospitals(
        self,
        latitude,
        longitude,
        emergency_level="urgent",  # critical/urgent/normal
        max_results=5
    ):
        """
        Find nearest hospitals using
        Google Places API Nearby Search
        """
        radius = SEARCH_RADIUS[emergency_level]

        try:
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/place/nearbysearch/json"
                f"?location={latitude},{longitude}"
                f"&radius={radius}"
                f"&type=hospital"
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            if data["status"] == "OK":
                hospitals = []

                for place in data["results"][:max_results]:
                    hospital = self._extract_hospital_info(
                        place,
                        latitude,
                        longitude
                    )
                    hospitals.append(hospital)

                # Sort by distance - nearest first
                hospitals.sort(
                    key=lambda x: x["distance_meters"]
                )

                return {
                    "success": True,
                    "hospitals": hospitals,
                    "total_found": len(hospitals),
                    "search_radius_km": radius/1000
                }

            elif data["status"] == "ZERO_RESULTS":
                # Expand search if nothing found
                return self.find_nearest_hospitals(
                    latitude,
                    longitude,
                    "normal",   # Expand to larger radius
                    max_results
                )

            else:
                return self._get_mock_hospitals(latitude, longitude, radius)

        except Exception as e:
            return self._get_mock_hospitals(latitude, longitude, radius)

    def _get_mock_hospitals(self, lat, lng, radius):
        import random
        lat = float(lat)
        lng = float(lng)
        return {
            "success": True,
            "hospitals": [
                {
                    "name": "City General Hospital (Mock)",
                    "latitude": lat + 0.005,
                    "longitude": lng + 0.005,
                    "address": "123 Health Ave, Medical District",
                    "distance_meters": 1200,
                    "distance_km": 1.2,
                    "rating": "4.5",
                    "open_now": True,
                    "phone": "1800-111-2222",
                    "directions_url": f"https://www.google.com/maps/dir/{lat},{lng}/{lat+0.005},{lng+0.005}",
                    "driving_time": "5 mins"
                },
                {
                    "name": "Aarogya Lifecare Clinic (Mock)",
                    "latitude": lat - 0.003,
                    "longitude": lng - 0.004,
                    "address": "45 Wellness Blvd, Tech Park",
                    "distance_meters": 2500,
                    "distance_km": 2.5,
                    "rating": "4.2",
                    "open_now": True,
                    "phone": "1800-333-4444",
                    "directions_url": f"https://www.google.com/maps/dir/{lat},{lng}/{lat-0.003},{lng-0.004}",
                    "driving_time": "12 mins"
                },
                {
                    "name": "Sanjeevani Care Center (Mock)",
                    "latitude": lat + 0.008,
                    "longitude": lng - 0.002,
                    "address": "78 Hope Street, Green Valley",
                    "distance_meters": 3100,
                    "distance_km": 3.1,
                    "rating": "4.8",
                    "open_now": True,
                    "phone": "1800-555-6666",
                    "directions_url": f"https://www.google.com/maps/dir/{lat},{lng}/{lat+0.008},{lng-0.002}",
                    "driving_time": "15 mins"
                }
            ],
            "total_found": 3,
            "search_radius_km": radius/1000,
            "mocked": True
        }

    def _extract_hospital_info(
        self, place, user_lat, user_lng
    ):
        """
        Extract and format hospital details
        from Google Places response
        """
        lat = place["geometry"]["location"]["lat"]
        lng = place["geometry"]["location"]["lng"]

        # Calculate straight line distance
        distance = self._calculate_distance(
            user_lat, user_lng, lat, lng
        )

        hospital = {
            "name": place.get("name", "Hospital"),
            "place_id": place.get("place_id", ""),
            "latitude": lat,
            "longitude": lng,
            "address": place.get("vicinity", ""),
            "distance_meters": distance,
            "distance_km": round(distance / 1000, 1),
            "rating": place.get("rating", "N/A"),
            "open_now": self._check_open_status(place),
            "google_maps_url": (
                f"https://maps.google.com/?q="
                f"{lat},{lng}"
            ),
            "directions_url": (
                f"https://www.google.com/maps/dir/"
                f"{user_lat},{user_lng}/"
                f"{lat},{lng}"
            )
        }

        # Get phone number if available
        hospital["phone"] = self._get_hospital_phone(
            place.get("place_id", "")
        )

        return hospital

    def _get_hospital_phone(self, place_id):
        """
        Get hospital phone number
        using Place Details API
        """
        if not place_id:
            return None

        try:
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/place/details/json"
                f"?place_id={place_id}"
                f"&fields=formatted_phone_number"
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            if data["status"] == "OK":
                return (
                    data["result"]
                    .get("formatted_phone_number", None)
                )

        except:
            return None

    def _check_open_status(self, place):
        """
        Check if hospital is open right now
        """
        try:
            opening_hours = place.get(
                "opening_hours", {}
            )
            return opening_hours.get("open_now", True)
        except:
            return True

    def _calculate_distance(
        self, lat1, lon1, lat2, lon2
    ):
        """
        Haversine formula
        """
        import math

        R = 6371000  # Earth radius in meters

        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)

        a = (
            math.sin(dphi/2) ** 2
            + math.cos(phi1)
            * math.cos(phi2)
            * math.sin(dlambda/2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        return R * c

    def get_driving_time(
        self,
        user_lat, user_lng,
        hospital_lat, hospital_lng
    ):
        """
        Get actual driving time and distance
        using Google Distance Matrix API
        """
        try:
            url = (
                f"https://maps.googleapis.com/maps/api"
                f"/distancematrix/json"
                f"?origins={user_lat},{user_lng}"
                f"&destinations={hospital_lat},"
                f"{hospital_lng}"
                f"&mode=driving"
                f"&language=hi"
                f"&key={GOOGLE_MAPS_API_KEY}"
            )

            response = requests.get(url)
            data = response.json()

            element = (
                data["rows"][0]["elements"][0]
            )

            if element["status"] == "OK":
                return {
                    "duration_text": (
                        element["duration"]["text"]
                    ),
                    "duration_seconds": (
                        element["duration"]["value"]
                    ),
                    "distance_text": (
                        element["distance"]["text"]
                    ),
                    "distance_meters": (
                        element["distance"]["value"]
                    )
                }

        except Exception as e:
            return None
