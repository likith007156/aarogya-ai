import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "YOUR_GOOGLE_MAPS_API_KEY")

AMBULANCE_SERVICE = {
    "national_emergency": "108",
    "national_health_helpline": "104",
    "police": "100",
}

HOSPITAL_SEARCH_KEYWORDS = [
    "PHC",
    "Community Health Centre",
    "District Hospital",
    "Government Hospital",
    "AIIMS",
    "ESI Hospital",
    "Railway Hospital",
    "Ayushman Bharat Hospital"
]

# Search radius in meters
SEARCH_RADIUS = {
    "critical":  5000,   # 5km  - for life threatening
    "urgent":   10000,   # 10km - for serious
    "normal":   20000    # 20km - for general
}
