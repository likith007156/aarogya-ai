const text = "नमस्ते, यह आरोग्य AI है।";
fetch("http://localhost:3000/api/sarvam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text, target_language_code: "hi-IN" })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data).substring(0, 200)))
.catch(console.error);
