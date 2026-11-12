# EVIDENCE COLLECTION AUDIT MANIFEST & VERIFICATION CHECKLIST
## Safe Cybersecurity Practice Lab – Non-Repudiable Portfolio Evidence
**Document ID:** SEC-EVD-LAB-2026-V1  
**Project:** Legal Scope and Isolated Lab – Safe Cybersecurity Practice Environment  
**Evaluation Standard:** Academic Laboratory Integrity Standard  

---

## 1. Evidence Verification Policy

To earn academic accreditation and satisfy cybersecurity portfolio requirements, the student must provide genuine, verifiable proof of lab deployment. 

> **ACADEMIC HONESTY POLICY:**  
> In accordance with institutional honor codes, **no terminal outputs, timestamps, IP bindings, or screenshots may be simulated, fabricated, or plagiarized.** Each evidence artifact must reflect actual commands executed on the student's personal host machine.

---

## 2. Master Evidence Matrix

| Evidence ID | Artifact Title | Target File Path | Audit Verification Goal | Student Status |
| :--- | :--- | :--- | :--- | :--- |
| `EVD-01` | Docker Engine Installation | `evidence/evd-01-docker-install.png` | Validates host virtualization and CLI readiness | `[ ] PENDING VERIFICATION` |
| `EVD-02` | Juice Shop Running Container | `evidence/evd-02-docker-ps.png` | Validates active container execution state | `[ ] PENDING VERIFICATION` |
| `EVD-03` | OWASP Juice Shop Web Interface | `evidence/evd-03-juice-shop-web.png` | Confirms HTTP service responsiveness on localhost | `[ ] PENDING VERIFICATION` |
| `EVD-04` | Localhost Socket Binding Audit | `evidence/evd-04-port-binding.png` | Verifies non-exposure to LAN/WAN (127.0.0.1:3000) | `[ ] PENDING VERIFICATION` |
| `EVD-05` | Lab Topology Diagram Artifact | `evidence/evd-05-lab-topology.png` | Demonstrates architectural boundary awareness | `[ ] PENDING VERIFICATION` |
| `EVD-06` | Signed Rules of Engagement Doc | `evidence/evd-06-signed-roe.png` | Validates ethical pledge and legal authorization | `[ ] PENDING VERIFICATION` |

---

## 3. Detailed Capture Instructions & Acceptance Criteria

---

### Artifact `EVD-01`: Docker Engine Installation
- **Evidence ID:** `EVD-01`
- **Screenshot Title:** Docker Engine Installation & Host Environment Verification
- **What it Proves:** Proves that Docker / Docker Desktop is installed, running with genuine daemon connectivity, and configured with a supported virtualization runtime (WSL 2 or native Linux daemon).
- **Execution Command:**
  ```bash
  # Windows PowerShell or Linux Terminal
  docker --version
  docker info
  ```
- **Instructions for Capturing:**
  1. Open a clean terminal window on your host OS.
  2. Execute `docker --version`.
  3. Ensure your terminal prompt (showing current user and OS hostname) is visible.
  4. Capture the full terminal window including the header bar and save as `evidence/evd-01-docker-install.png`.

---

### Artifact `EVD-02`: Container Runtime Execution State
- **Evidence ID:** `EVD-02`
- **Screenshot Title:** OWASP Juice Shop Active Container Runtime State
- **What it Proves:** Proves that the official `bkimminich/juice-shop` container has been instantiated, is healthy, has not exited with error, and is running in detached background mode.
- **Execution Command:**
  ```bash
  docker ps -a --filter name=juice-shop
  ```
- **Instructions for Capturing:**
  1. In your terminal, run `docker ps -a --filter name=juice-shop`.
  2. Verify that the `STATUS` column displays `Up X minutes` or `Up X seconds`.
  3. Ensure the `NAMES` column clearly displays `juice-shop`.
  4. Capture the terminal window showing the table headers and container entry. Save as `evidence/evd-02-docker-ps.png`.

---

### Artifact `EVD-03`: OWASP Juice Shop Web Interface
- **Evidence ID:** `EVD-03`
- **Screenshot Title:** OWASP Juice Shop Single Page Application Homepage
- **What it Proves:** Proves that the HTTP server inside the container is successfully rendering the Angular storefront to a browser client accessing the local loopback interface.
- **Access URL:**
  ```text
  http://localhost:3000  OR  http://127.0.0.1:3000
  ```
- **Instructions for Capturing:**
  1. Open Chrome, Edge, or Firefox and navigate to `http://localhost:3000`.
  2. Wait for the Juice Shop storefront banner and the welcome dialog to load.
  3. Ensure the browser address bar clearly shows `localhost:3000` or `127.0.0.1:3000`.
  4. Capture the browser window including the address bar and storefront layout. Save as `evidence/evd-03-juice-shop-web.png`.

---

### Artifact `EVD-04`: Localhost Port Binding Audit
- **Evidence ID:** `EVD-04`
- **Screenshot Title:** Verification of 127.0.0.1 Loopback Isolation Binding
- **What it Proves:** Critically proves that the container is bound **exclusively** to the IPv4 loopback socket (`127.0.0.1`) and is **not** listening on wildcard `0.0.0.0`. This confirms the lab cannot be accessed or attacked by third parties over the local Wi-Fi or Internet.
- **Execution Command:**
  ```bash
  docker port juice-shop
  ```
- **Instructions for Capturing:**
  1. Execute `docker port juice-shop`.
  2. Confirm the output exactly matches: `3000/tcp -> 127.0.0.1:3000`.
  3. Also execute a socket inspection check:
     - On Windows: `netstat -ano | findstr 3000`
     - On Linux: `ss -tulpn | grep 3000`
  4. Capture the terminal output clearly showing `127.0.0.1:3000`. Save as `evidence/evd-04-port-binding.png`.

---

### Artifact `EVD-05`: Lab Architecture & Topology Diagram
- **Evidence ID:** `EVD-05`
- **Screenshot Title:** System Architecture & Isolation Boundary Topology
- **What it Proves:** Proves the student's mastery of the technical layers, container boundary, bridge networking, and security warnings governing the isolated environment.
- **Source Artifact:** `diagrams/lab-topology.svg`
- **Instructions for Capturing:**
  1. Render `diagrams/lab-topology.svg` in your browser or vector viewer.
  2. Confirm all components (Host Machine, Loopback, Docker Engine, Bridge, Juice Shop, Blocked WAN) are sharp and legible.
  3. Export or screenshot the rendered diagram as `evidence/evd-05-lab-topology.png`.

---

### Artifact `EVD-06`: Signed Rules of Engagement Document
- **Evidence ID:** `EVD-06`
- **Screenshot Title:** Fully Executed & Signed Rules of Engagement Document
- **What it Proves:** Proves formal ethical commitment, legal scope comprehension, personal identification, and mutual authorization prior to performing any vulnerability assessment.
- **Source File:** `reports/Rules_of_Engagement.pdf`
- **Instructions for Capturing:**
  1. Complete the Student Practitioner signature section in `reports/Rules_of_Engagement.pdf` or print and physically sign.
  2. Provide genuine student name, student ID, date, and signature.
  3. Capture a clear, high-resolution scan or screenshot of the completed signature block page.
  4. Save as `evidence/evd-06-signed-roe.png`.

---

## 4. Submission Sign-off Manifest

```text
================================================================================
                    LAB PRACTITIONER VERIFICATION SIGN-OFF
================================================================================
I confirm that all 6 evidence artifacts listed above have been captured 
directly from my active local practice environment without fabrication.

Student Signature: ___________________________    Date: ________________________
================================================================================
```

