# CYBERSECURITY LABORATORY SAFETY & ETHICS POLICY
## Operational Standards, Safe Payload Selection, and Ethical Code of Conduct
**Document ID:** SEC-POL-LAB-2026-V1  
**Target:** Academic & Professional Cybersecurity Training  
**Classification:** PUBLIC / EDUCATIONAL STANDARD  

---

## 1. Ethical Foundation & Core Philosophy

Security testing capabilities are dual-use technologies. The skills, methods, and scripts utilized to defend critical infrastructure are mathematically identical to those used by malicious actors. Therefore, ethical discipline, legal boundaries, and technical caution must govern every phase of application security training.

### The Zero-Harm Principle
All training exercises must strictly adhere to the **Zero-Harm Principle**:
- **No permanent disruption:** The host operating system, local network, and target software must not be placed in a non-recoverable state.
- **No data contamination:** No real personal, financial, or institutional data shall ever be introduced into vulnerable application databases.
- **No lateral movement:** Testing activities must never traverse outside the local container sandbox.

---

## 2. Safe Payload Selection Guidelines

When practicing vulnerability exploitation against OWASP Juice Shop, students must select benign, non-destructive payloads that prove the existence of a vulnerability without causing denial-of-service or host corruption.

### 2.1 Cross-Site Scripting (XSS)
- **Approved Payloads:**
  ```html
  <script>console.log('LAB-VERIFIED-XSS')</script>
  <script>alert('XSS Proof of Concept')</script>
  <img src=x onerror=console.warn('XSS-Executed')>
  ```
- **Prohibited Payloads:**
  - Automated infinite redirect loops (`window.location = ...`).
  - Keylogging payloads attempting to steal browser autofill passwords.
  - Payloads that spawn infinite popups or crash the browser tab (`while(true) alert()`).

### 2.2 SQL Injection (SQLi)
- **Approved Payloads:**
  - Authentication bypass demonstration: `' OR 1=1 --`
  - Safe data extraction queries: `' UNION SELECT 1, 'test', 'demo', 4 --`
  - Version fingerprinting: `' UNION SELECT sqlite_version(), 2, 3 --`
- **Prohibited Payloads:**
  - Destructive data manipulation: `'; DROP TABLE users; --`
  - Bulk deletions: `'; DELETE FROM products; --`
  - Heavy database sleep/time-delay attacks that freeze the container process.

### 2.3 Remote Code Execution & Deserialization
- If practicing deserialization challenges:
  - Demonstrate command execution using benign diagnostic commands (e.g., `whoami`, `hostname`, `id`).
  - Never execute file system wipe commands (`rm -rf /`), crypto-miners, or reverse shells calling external internet IP addresses.

---

## 3. Incident Escalation & Decommissioning

### 3.1 Incident Escalation Triggers
The student must cease testing and inform the course administrator if:
1. Network monitoring tools reveal packets leaving the host interface towards external IPs during a lab test.
2. A vulnerability allows arbitrary write access to the host machine's native root filesystem (container escape).
3. The host CPU or RAM exhibits runaway consumption that prevents system responsiveness.

### 3.2 Secure Decommissioning Protocol
Upon concluding practice or before presenting lab results for evaluation:
1. Ensure all genuine terminal evidence is captured in `evidence/`.
2. Gracefully stop the running target:
   ```bash
   docker stop juice-shop
   ```
3. Remove the container to flush volatile challenge states:
   ```bash
   docker rm juice-shop
   ```
4. Verify no lingering listeners remain on port 3000:
   ```bash
   # Windows
   netstat -ano | findstr 3000
   # Linux
   sudo ss -tulpn | grep 3000
   ```

---

## 4. Student Code of Professional Conduct

By engaging in this project, the student pledges:
1. I will never use my security knowledge to attack, harass, disrupt, or spy on any individual, university, or corporate network.
2. I will restrict my experimental security activities solely to locally isolated laboratories under my own ownership or explicit authorization.
3. I will advocate for responsible disclosure, defensive engineering, and digital safety throughout my cybersecurity career.

