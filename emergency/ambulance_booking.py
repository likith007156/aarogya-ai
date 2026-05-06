import requests
from datetime import datetime

class AmbulanceBooking:

    def __init__(self):
        self.booking_log = []

    def book_ambulance(
        self,
        user_location,
        nearest_hospital,
        patient_details,
        emergency_type
    ):
        """
        Primary ambulance booking system
        Tries multiple methods in order
        """

        booking_result = {
            "booking_id": self._generate_booking_id(),
            "timestamp": datetime.now().isoformat(),
            "patient_location": user_location,
            "nearest_hospital": nearest_hospital,
            "emergency_type": emergency_type,
            "status": "INITIATED"
        }

        # METHOD 1: Try 108 API if available
        # (State governments have different APIs)
        api_result = self._try_108_api_booking(
            user_location,
            emergency_type
        )

        if api_result["success"]:
            booking_result["status"] = "BOOKED_VIA_API"
            booking_result["ambulance_eta"] = (
                api_result.get("eta", "15-20 minutes")
            )
            booking_result["ambulance_number"] = (
                api_result.get("vehicle_number")
            )

        else:
            # METHOD 2: Generate click-to-call
            booking_result["status"] = "CALL_REQUIRED"
            booking_result["call_108"] = True
            booking_result["call_script"] = (
                self._generate_call_script(
                    user_location,
                    emergency_type,
                    nearest_hospital
                )
            )

        # Always log the booking attempt
        self._log_booking(booking_result)

        return booking_result

    def _try_108_api_booking(
        self, user_location, emergency_type
    ):
        """
        Attempt to book via state 108 API
        Note: Each state in India has different
        GVK EMRI / 108 integration

        Currently Karnataka, AP, Telangana have APIs
        """
        try:
            # GVK EMRI 108 API (where available)
            payload = {
                "latitude": user_location["latitude"],
                "longitude": user_location["longitude"],
                "emergency_type": emergency_type,
                "source": "AarogyaAI",
                "timestamp": datetime.now().isoformat()
            }

            # This endpoint varies by state
            # Replace with actual state API endpoint
            response = requests.post(
                "https://api.108service.in/book",
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return {"success": False}

        except:
            # If API fails - fallback to call
            return {"success": False}

    def _generate_call_script(
        self,
        user_location,
        emergency_type,
        nearest_hospital
    ):
        """
        Generate a simple script for user
        to read when calling 108
        Hindi script for rural users
        """
        address = user_location.get(
            "formatted_address", "location unknown"
        )
        hospital = nearest_hospital.get(
            "name", "nearest hospital"
        )

        script = {
            "hindi": (
                f"Mera naam [APNA NAAM BATAIYE] hai. "
                f"Mujhe ambulance chahiye. "
                f"Main {address} par hoon. "
                f"Mareez ko {emergency_type} hai. "
                f"Kripya ambulance {hospital} ki "
                f"taraf bhejein."
            ),
            "english": (
                f"I need an ambulance at {address}. "
                f"Patient has {emergency_type}. "
                f"Please send to {hospital}."
            )
        }

        return script

    def _generate_booking_id(self):
        """
        Generate unique booking reference
        """
        import uuid
        return f"AAI-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

    def _log_booking(self, booking_data):
        """
        Log every booking attempt for audit
        """
        self.booking_log.append(booking_data)
        # In production: save to database
        print(f"Booking logged: {booking_data['booking_id']}")
