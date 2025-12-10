# **Return Feedback Loop Automation System**

A fully automated, AI-powered workflow that collects customer return feedback, analyzes it using Gemini AI, stores it in structured tables, and closes the loop by sending automated responses to both the customer and the support team.

---

## **📌 Overview**

Return Feedback Loop Automation is designed to solve a common pain point in e-commerce: slow, inconsistent, and manual return handling.
This project creates an intelligent feedback loop using modern automation tools, eliminating manual intervention and speeding up customer support.

The system:

* Collects return feedback from users
* Stores it inside Boltic Tables
* Runs Gemini AI to interpret the message
* Automatically responds to the customer
* Sends a detailed insight email to the support team

Everything executes within seconds.

---

## **🎯 Features**

### **✔ Real-time Feedback Capture**

Customers submit return reasons and issues through a Next.js UI.

### **✔ Automated Workflow with Boltic**

The data flows through a Boltic HTTP Trigger into a complete automation pipeline.

### **✔ AI-Powered Text Analysis**

Gemini AI interprets:

* Sentiment
* Issue summary
* Root cause
* Recommended next action

### **✔ Automatic Email Notifications**

Two emails are generated:

* **Customer** → apology, explanation, next steps
* **Support Team** → raw feedback + AI insights + context

### **✔ No Backend Server Required**

All logic is orchestrated in Boltic, making the system lightweight and scalable.

---

## **🧱 Tech Stack**

### **Frontend**

* Next.js (App Router)
* Tailwind CSS
* Clerk Authentication
* Fetch API

### **Automation & Backend**

* Boltic HTTP Trigger
* Boltic Tables
* Boltic Workflow Engine
* Gemini AI (LLM)
* Boltic Email Activity (Gmail)

---

## **⚙️ System Architecture**

```
Customer (UI)
     ↓
Next.js Form (Feedback + Email)
     ↓ POST
Boltic HTTP Trigger
     ↓
Boltic Table (Insert Record)
     ↓
Gemini AI (Feedback Analysis)
     ↓
Automated Emails
   ↙         ↘
Customer     Support Team
```

---

## **🚀 Workflow Breakdown**

### **1. User Submits Feedback**

The UI sends a POST request containing:

```json
{
  "feedback": "the shoes are big",
  "usermail": "customer@example.com"
}
```

### **2. Boltic HTTP Trigger Activates**

The workflow receives the payload and starts processing.

### **3. Record Inserted into Table**

Boltic stores the feedback + customer email inside a table named `return_feedback`.

### **4. Gemini AI Processes the Text**

AI generates:

* Issue interpretation
* Sentiment
* Root cause
* Explanation

### **5. Automated Emails Sent**

* Customer gets a clear apology + resolution path
* Internal support team receives a detailed AI report

---

## **🧪 Frontend Code (Simplified)**

```jsx
const res = await fetch(TRIGGER_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    feedback,
    usermail: user?.primaryEmailAddress?.emailAddress || ""
  }),
});
```

---

## **📬 Example AI Interpretation**

```
Sentiment: Negative
Customer Issue: Product does not fit as expected
Root Cause: Size mismatch
Suggested Action: Provide replacement or initiate refund
```

---

## **📈 Impact**

* Reduces manual support workload
* Ensures customers get immediate, consistent responses
* Converts raw feedback into actionable data
* Improves product understanding through AI insights
* Scales easily without backend overhead

---

## **🚀 Future Enhancements**

* Product category–specific AI troubleshooting
* Automated refund/replacement initiation
* Slack/Discord alerts for high-severity feedback
* Customer satisfaction scoring
* Admin dashboard for analytics

---

## **📄 Project Status**

✓ Fully functional
✓ End-to-end automation working
✓ AI analysis integrated
✓ Email system configured
✓ Ready for extension and deployment

---

## **📚 How to Run Locally**

### **1. Clone Repo**

```bash
git clone <repo-url>
cd return-feedback-loop-automation
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Environment Variables**

In `.env.local`:

```
NEXT_PUBLIC_TRIGGER_URL=<your-boltic-http-trigger-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### **4. Run the Project**

```bash
npm run dev
```

---

## **👤 Author**

**Charan**
Full-Stack Developer | ML Enthusiast
