# Demo Day Cheat Sheet

## 1. Start the Dashboard (The Verifier)
(Do this in a separate terminal)
```bash
cd dashboard
npm run dev
```
*   Open specific URL: **`http://localhost:5173`**

---

## 2. Issue the Degree (The University)
(Run this in the main `did-cli` terminal)

```bash
node bin/did-cli.js credential issue 0x7dcb24d02b9ee337f5ea84e4d10b9c0260874962 --file credential.json
```

**Output:**
> Credential hash: **`0xd315...`** (COPY THIS LONG CODE)

---

## 3. Verify the Degree (The Employer)
Go to the Dashboard in your browser.

*   **Holder Address:** `0.0.5892919`
*   **Credential Hash:** (Paste the code you copied)
*   Click **VERIFY**

✅ **Result:** Green "Valid" Card.
