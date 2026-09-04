# ProQ Notifications Infrastructure Setup Guide

**IMPORTANT STRATEGY NOTE:** 
All automated notifications (WhatsApp, SMS, and Email) are **strictly gated behind the Pro and Enterprise tiers**. 
Because free users cannot access this feature, you will never spend API credits or incur SMS costs on non-paying users. The KES 1,499+ subscription fees will easily subsidize the minimal API costs.

---

## 1. WhatsApp Alerts (Meta Cloud API)
*Target Cost: 100% FREE (First 1,000 conversations/month)*

To send automated, verified WhatsApp messages without relying on hacky third-party bots, we use the official Meta Cloud API.

### SIM Card Requirement
*   You must purchase a **brand new Safaricom or Airtel SIM card** dedicated exclusively to ProQ.
*   **CRITICAL:** Do *not* register this number on the standard WhatsApp or WhatsApp Business mobile app on your phone. The Meta Cloud API requires a "clean" number. If it is already tied to a mobile app, you must delete the WhatsApp account from the app first.

### Step-by-Step Setup
1.  Go to [Meta for Developers](https://developers.facebook.com/) and create a Developer Account.
2.  Click **Create App** -> Select **Other** -> Select **Business**.
3.  Inside your new App dashboard, scroll down to **WhatsApp** and click **Set Up**.
4.  You will be prompted to link or create a Meta Business Portfolio.
5.  Navigate to **WhatsApp > API Setup** in the left sidebar.
6.  Click **Add Phone Number** and follow the prompts to verify your new SIM card via an OTP SMS.
7.  Generate your keys:
    *   Copy the **Phone Number ID** (not the phone number itself, it is a long numeric string).
    *   Generate a **Permanent Access Token** (via Business Settings -> System Users -> Generate Token with `whatsapp_business_messaging` permissions).

---

## 2. SMS Alerts (Africa's Talking)
*Target Cost: ~KES 0.8 per SMS*

Because SMS operates over telecom networks, it cannot be 100% free. Africa's Talking (AT) offers the cheapest and most reliable direct-to-Safaricom routing in Kenya.

### Step-by-Step Setup
1.  Create an account at [Africa's Talking](https://africastalking.com/).
2.  Navigate to your **App Dashboard** (or create a new app named "ProQ").
3.  Go to **Settings > API Key** and generate your `AFRICASTALKING_API_KEY`.
4.  Note your `AFRICASTALKING_USERNAME` (usually the name of the app you created).

### Sender ID (Optional but Recommended)
By default, your SMS will arrive from a random 5-digit shortcode (e.g., `22123`). To make it appear as "PROQ":
1.  Go to **SMS > Sender IDs** in the AT dashboard.
2.  Request an Alphanumeric Sender ID.
3.  You will need to submit a brief letter of authorization to Safaricom (AT provides a template) explaining you own the brand ProQ. This process takes about 2-4 days to be approved.

---

## 3. Email Alerts (Resend)
*Target Cost: 100% FREE (Up to 3,000 emails/month)*

1.  Create a free account at [Resend.com](https://resend.com).
2.  Go to **API Keys** and generate a new key.
3.  Go to **Domains** and add `proq.co.ke`. You will need to add the provided DNS records (TXT/MX) to your domain registrar (e.g., Truehost/KenyaWebExperts) to verify you own the domain.

---

## 4. Finalizing Configuration
Once you have collected all the credentials, you will inject them into the system by adding them to the `.env.local` file in the root of the ProQ codebase:

```env
# Africa's Talking SMS
AFRICASTALKING_USERNAME=your_at_username
AFRICASTALKING_API_KEY=your_at_api_key
AFRICASTALKING_SENDER_ID=PROQ

# Meta WhatsApp Cloud API
WHATSAPP_API_TOKEN=your_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Email
RESEND_API_KEY=your_resend_api_key
```

Until these keys are provided, the system will operate in **Simulation Mode**, logging the exact alert text to the server console for testing purposes without triggering any real network requests.
