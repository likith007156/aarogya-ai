const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir);
}

const translations = {
  'hi-IN': {
    greeting: "नमस्ते! मैं आरोग्य AI हूं। आपकी क्या तकलीफ है?",
    askSymptom: "कृपया मुझे अपने मुख्य लक्षण के बारे में बताएं।",
    askDuration: "यह समस्या कितने समय से है?",
    askSeverity: "यह कितना गंभीर है? (हल्का, मध्यम, या बहुत तेज)",
    calculatingRisk: "जोखिम का आकलन किया जा रहा है...",
    highRisk: "उच्च जोखिम",
    mediumRisk: "मध्यम जोखिम",
    lowRisk: "कम जोखिम",
    bookPHC: "पीएचसी (PHC) बुक करें",
    generateABHA: "आभा (ABHA) आईडी बनाएं",
    thankYou: "धन्यवाद! हम आपकी मदद के लिए यहाँ हैं।",
    visitDoctor: "कृपया जल्द से जल्द डॉक्टर से मिलें।",
    urgent: "आपातकाल: तुरंत 108 एम्बुलेंस बुलाएं।",
    languageName: "हिंदी"
  },
  'kn-IN': {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಗ್ಯ AI. ನಿಮಗೆ ಏನು ತೊಂದರೆ?",
    askSymptom: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮುಖ್ಯ ಲಕ್ಷಣವನ್ನು ನನಗೆ ತಿಳಿಸಿ.",
    askDuration: "ಈ ಸಮಸ್ಯೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?",
    askSeverity: "ಇದು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ? (ಸ್ವಲ್ಪ, ಸಾಧಾರಣ, ಅಥವಾ ತುಂಬಾ)",
    calculatingRisk: "ಅಪಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    mediumRisk: "ಸಾಧಾರಣ ಅಪಾಯ",
    lowRisk: "ಕಡಿಮೆ ಅಪಾಯ",
    bookPHC: "PHC ಬುಕ್ ಮಾಡಿ",
    generateABHA: "ABHA ಐಡಿ ರಚಿಸಿ",
    thankYou: "ಧನ್ಯವಾದಗಳು! ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ.",
    visitDoctor: "ದಯವಿಟ್ಟು ಆದಷ್ಟು ಬೇಗ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
    urgent: "ತುರ್ತು: ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ.",
    languageName: "ಕನ್ನಡ"
  },
  'ta-IN': {
    greeting: "வணக்கம்! நான் ஆரோக்ய AI. உங்களுக்கு என்ன பிரச்சனை?",
    askSymptom: "தயவுசெய்து உங்கள் முக்கிய அறிகுறியை கூறுங்கள்.",
    askDuration: "இந்த பிரச்சனை எத்தனை நாட்களாக உள்ளது?",
    askSeverity: "இது எவ்வளவு தீவிரமானது? (லேசானது, மிதமானது, அல்லது மிகவும்)",
    calculatingRisk: "ஆபத்து கணக்கிடப்படுகிறது...",
    highRisk: "அதிக ஆபத்து",
    mediumRisk: "மிதமான ஆபத்து",
    lowRisk: "குறைந்த ஆபத்து",
    bookPHC: "PHC பதிவு செய்",
    generateABHA: "ABHA ID உருவாக்கு",
    thankYou: "நன்றி! உங்களுக்கு உதவ நாங்கள் உள்ளோம்.",
    visitDoctor: "தயவுசெய்து விரைவில் மருத்துவரை சந்திக்கவும்.",
    urgent: "அவசரம்: உடனடியாக 108 ஆம்புலன்ஸை அழைக்கவும்.",
    languageName: "தமிழ்"
  },
  'te-IN': {
    greeting: "నమస్కారం! నేను ఆరోగ్య AI. మీకు ఏమి సమస్య?",
    askSymptom: "దయచేసి మీ ముఖ్య లక్షణాన్ని చెప్పండి.",
    askDuration: "ఈ సమస్య ఎన్ని రోజుల నుండి ఉంది?",
    askSeverity: "ఇది ఎంత తీవ్రంగా ఉంది? (తేలికపాటి, మితమైన, లేదా చాలా)",
    calculatingRisk: "ప్రమాదం అంచనా వేయబడుతోంది...",
    highRisk: "అధిక ప్రమాదం",
    mediumRisk: "మితమైన ప్రమాదం",
    lowRisk: "తక్కువ ప్రమాదం",
    bookPHC: "PHC బుక్ చేయండి",
    generateABHA: "ABHA ID సృష్టించండి",
    thankYou: "ధన్యవాదాలు! మేము మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము.",
    visitDoctor: "దయచేసి వీలైనంత త్వరగా వైద్యుడిని కలవండి.",
    urgent: "అత్యవసరం: వెంటనే 108 అంబులెన్స్ కాల్ చేయండి.",
    languageName: "తెలుగు"
  },
  'mr-IN': {
    greeting: "नमस्कार! मी आरोग्य AI आहे. तुम्हाला काय त्रास आहे?",
    askSymptom: "कृपया मला तुमची मुख्य लक्षणे सांगा.",
    askDuration: "हा त्रास किती दिवसांपासून आहे?",
    askSeverity: "हे किती तीव्र आहे? (सौम्य, मध्यम, किंवा खूप)",
    calculatingRisk: "धोक्याची गणना करत आहे...",
    highRisk: "उच्च धोका",
    mediumRisk: "मध्यम धोका",
    lowRisk: "कमी धोका",
    bookPHC: "PHC बुक करा",
    generateABHA: "ABHA ID तयार करा",
    thankYou: "धन्यवाद! आम्ही तुमच्या मदतीसाठी येथे आहोत.",
    visitDoctor: "कृपया लवकरात लवकर डॉक्टरांना भेटा.",
    urgent: "तातडीचे: त्वरित 108 रुग्णवाहिकेला कॉल करा.",
    languageName: "मराठी"
  },
  'en-IN': {
    greeting: "Hello! I am Aarogya AI. What health concern can I help you with?",
    askSymptom: "Please tell me your main symptom.",
    askDuration: "How long have you had this issue?",
    askSeverity: "How severe is it? (Mild, Moderate, or Severe)",
    calculatingRisk: "Calculating risk...",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",
    bookPHC: "Book PHC",
    generateABHA: "Generate ABHA ID",
    thankYou: "Thank you! We are here to help.",
    visitDoctor: "Please visit a doctor as soon as possible.",
    urgent: "URGENT: Call 108 ambulance immediately.",
    languageName: "English"
  }
};

for (const [code, messages] of Object.entries(translations)) {
  fs.writeFileSync(path.join(localesDir, `${code}.json`), JSON.stringify(messages, null, 2));
}

console.log('Locales generated successfully.');
