# Project Roles: The "Trust Triangle"

## 1. The Issuer (University / IIT Madras)
*   **Goal:** To give students digital proof of their degrees that cannot be faked.
*   **Problem:** Paper certificates can be forged. Central Databases can be hacked.
*   **Action:**
    *   I verify the student's grades in my internal system.
    *   I use my **Private Key** to "Sign" the data.
    *   I publish the **Hash** (Fingerprint) to the Public Blockchain.
*   **Benefit:** I don't need to answer phone calls from employers checking grades. The Blockchain answers for me.

## 2. The Holder (Student / Joji)
*   **Goal:** To prove I have a degree without carrying papers or waiting for the university to send transcripts.
*   **Problem:** I lose my certificates, or they get damaged. I want to share my degree instantly.
*   **Action:**
    *   I receive the digital file (`credential.json`) from the University.
    *   I store it in my Digital Wallet (or USB drive).
    *   When I apply for a job, I share the **Original File** + **Hash** with the Employer.
*   **Benefit:** I have "Self-Sovereign Identity". I own my data, not the university.

## 3. The Verifier (Employer / Company)
*   **Goal:** To instantly hire qualified candidates without waiting weeks for background checks.
*   **Problem:** Fake resumes are common. Background checks are slow and expensive.
*   **Action:**
    *   I receive the data from the Student.
    *   I paste the Hash into the **Verifier Dashboard**.
    *   The Dashboard asks the Blockchain: *"Is this hash valid and signed by IIT Madras?"*
*   **Benefit:** Instant trust. Zero cost. No third-party agencies needed.
