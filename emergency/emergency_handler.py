from .location_service import LocationService
from .hospital_finder import HospitalFinder
from .ambulance_booking import AmbulanceBooking

class EmergencyHandler:

    def __init__(self):
        self.location_service = LocationService()
        self.hospital_finder = HospitalFinder()
        self.ambulance_booking = AmbulanceBooking()

    def handle_emergency(
        self,
        emergency_type,
        location_data,
        patient_details=None
    ):
        """
        Master function that handles
        complete emergency flow
        """

        response = {
            "emergency_detected": True,
            "emergency_type": emergency_type,
            "steps_taken": []
        }

        # STEP 1: Get user coordinates
        user_location = self._resolve_location(
            location_data
        )

        if not user_location["success"]:
            return self._location_failed_response()

        response["user_location"] = user_location
        response["steps_taken"].append("location_found")

        # STEP 2: Find nearest hospitals
        hospitals = (
            self.hospital_finder
            .find_nearest_hospitals(
                user_location["latitude"],
                user_location["longitude"],
                emergency_level="critical"
            )
        )

        if hospitals["success"]:
            # Add driving time to each hospital
            for hospital in hospitals["hospitals"]:
                driving = (
                    self.hospital_finder
                    .get_driving_time(
                        user_location["latitude"],
                        user_location["longitude"],
                        hospital["latitude"],
                        hospital["longitude"]
                    )
                )
                if driving:
                    hospital["driving_time"] = (
                        driving["duration_text"]
                    )
                    hospital["driving_distance"] = (
                        driving["distance_text"]
                    )

        response["nearby_hospitals"] = hospitals
        response["steps_taken"].append(
            "hospitals_found"
        )

        # STEP 3: Auto book ambulance to nearest
        if hospitals["success"] and hospitals["hospitals"]:
            nearest = hospitals["hospitals"][0]

            booking = self.ambulance_booking.book_ambulance(
                user_location=user_location,
                nearest_hospital=nearest,
                patient_details=patient_details,
                emergency_type=emergency_type
            )

            response["ambulance_booking"] = booking
            response["steps_taken"].append(
                "ambulance_initiated"
            )

        # STEP 4: Always add emergency contacts
        response["emergency_contacts"] = {
            "ambulance_108": "108",
            "health_helpline_104": "104",
            "police_100": "100",
            "whatsapp_emergency": (
                "https://wa.me/911234567890"
                "?text=EMERGENCY+HELP+NEEDED"
            )
        }

        # STEP 5: Generate map URL
        if hospitals["success"] and hospitals["hospitals"]:
            nearest = hospitals["hospitals"][0]
            response["map_url"] = (
                f"https://www.google.com/maps/dir/"
                f"{user_location['latitude']},"
                f"{user_location['longitude']}/"
                f"{nearest['latitude']},"
                f"{nearest['longitude']}"
            )

        return response

    def _resolve_location(self, location_data):
        """
        Handle different location input types:
        - GPS coordinates (best)
        - PIN code
        - Village + District name
        """
        loc_type = location_data.get("type")

        if loc_type == "gps":
            return (
                self.location_service
                .get_location_from_coordinates(
                    location_data["latitude"],
                    location_data["longitude"]
                )
            )

        elif loc_type == "pincode":
            return (
                self.location_service
                .get_coordinates_from_pincode(
                    location_data["pincode"]
                )
            )

        elif loc_type == "village":
            return (
                self.location_service
                .get_coordinates_from_village_name(
                    location_data["village"],
                    location_data["district"],
                    location_data["state"]
                )
            )

        else:
            return {
                "success": False,
                "error": "Unknown location type"
            }

    def _location_failed_response(self):
        """
        When location cannot be determined
        Still show emergency numbers
        """
        return {
            "emergency_detected": True,
            "location_failed": True,
            "message_hindi": (
                "Aapki location nahi mili. "
                "Kripya ABHI 108 call karein. "
                "Apna village aur district bataiye."
            ),
            "emergency_contacts": {
                "ambulance": "108",
                "health_helpline": "104"
            }
        }
