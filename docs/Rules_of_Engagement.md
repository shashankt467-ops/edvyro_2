# RULES OF ENGAGEMENT (ROE)
## Safe Cybersecurity Practice & Vulnerability Assessment Protocol
**Document ID:** SEC-ROE-LAB-2026-V1  
**Classification:** RESTRICTED – ACADEMIC PRACTICE ONLY  
**Target:** Local OWASP Juice Shop Container  
**Effective Date:** 2026-11-12  
**Status:** DRAFT / PENDING STUDENT SIGNATURE  

---

## 1. PURPOSE AND OBJECTIVES

### 1.1 Purpose
The purpose of this Rules of Engagement (ROE) document is to establish a rigorous, legally compliant, and technically sound operational framework for conducting cybersecurity practice, vulnerability identification, and application security assessments. This document serves as the governing agreement defining the boundaries of authorized activity.

### 1.2 Educational Objectives
- Provide hands-on training in application security testing using standard industry methodologies (OWASP Top 10).
- Develop safe security testing habits within strictly defined, sandboxed parameters.
- Instill a professional code of ethics and legal accountability prior to performing any vulnerability assessment.
- Verify and audit isolation controls ensuring no offensive network traffic can escape to unauthorized hosts.

---

## 2. AUTHORIZED TESTING ENVIRONMENT

Security testing is authorized **exclusively** on the designated, locally hosted virtual container system defined herein. No authorization is granted, expressed, or implied for any external network, third-party system, production asset, or shared infrastructure.

- **Host Workstation:** Student Local Machine
- **Virtualization Layer:** Docker Engine / Docker Desktop
- **Network Driver:** Docker Bridge (`bridge` / `docker0`)
- **Host Socket Binding:** `127.0.0.1:3000` (Loopback Interface Only)
- **Container IP Range:** Private bridge subnet (typically `172.17.0.0/16`)

---

## 3. TARGET APPLICATION

The sole authorized target application for all assessment and testing exercises is:

- **Application Name:** OWASP Juice Shop
- **Container Image:** `bkimminich/juice-shop:latest`
- **Application Architecture:** Node.js (Express framework), SQLite database, Angular SPA frontend
- **Application Type:** Deliberately vulnerable Web Application for Educational Security Training
- **Container Name:** `juice-shop`

---

## 4. TARGET URL & NETWORK ENDPOINT

The target application must be accessed and addressed solely through the local loopback interface:

```text
Target URL:      http://localhost:3000
Alternative URL: http://127.0.0.1:3000
Socket:          127.0.0.1:3000 (TCP)
```

> **MANDATORY CONSTRAINT:** Testing against domain names, public IP addresses, router-assigned DHCP addresses (e.g., `192.168.x.x`, `10.x.x.x`), or any IP address other than `127.0.0.1` is strictly out of scope and a violation of this agreement.

---

## 5. SCOPE OF AUTHORIZATION

### 5.1 In-Scope Assets
| Asset Identifier | Technology | Socket Binding | Authorization Boundary |
| :--- | :--- | :--- | :--- |
| `juice-shop` Container | Docker Linux Container | `127.0.0.1:3000` | Application layer vulnerabilities defined in OWASP Juice Shop scoreboard |
| Local Intercepting Proxy | Burp Suite Community / OWASP ZAP | `127.0.0.1:8080` (Proxy Listener) | Capturing and inspecting local HTTP/HTTPS traffic between browser and `127.0.0.1:3000` |

### 5.2 Out-of-Scope Assets
- The Host Operating System (Windows / macOS / Linux kernel, registry, and filesystem outside the lab).
- The Docker Daemon (`dockerd`) and Docker Desktop management runtime.
- Physical and wireless network interface cards (NICs, Wi-Fi adapters, Bluetooth).
- Gateway routers, home Wi-Fi access points, DNS servers, and ISP upstream infrastructure.
- Any remote server or website on the World Wide Web.

---

## 6. PERMITTED TESTING ACTIVITIES

The tester is authorized to perform non-destructive application security testing strictly aligned with OWASP Juice Shop training challenges:

1. **Input Validation Testing:**
   - SQL Injection (SQLi) within predefined challenge input parameters (e.g., search bars, login forms).
   - Cross-Site Scripting (Reflected, Stored, and DOM XSS) using non-destructive alert payloads (e.g., `<script>alert('XSS')</script>`).
2. **Authentication & Session Analysis:**
   - Password strength analysis and testing for default credentials against the local Juice Shop database.
   - Analysis of JSON Web Tokens (JWT) issued locally by the target application.
3. **Authorization & Access Control Testing:**
   - Insecure Direct Object References (IDOR) within local user baskets and order receipts.
   - Privilege escalation from mock standard user to mock administrator within the local SQLite database.
4. **Information Disclosure Analysis:**
   - Analysis of client-side JavaScript bundles (`main.js`, `vendor.js`).
   - Review of publicly accessible application metadata, swagger documentation, and configuration files.
5. **Security Vulnerability Documentation:**
   - Recording root causes, reproducing steps, impact assessments, and remediation advice for learning logs.

---

## 7. PROHIBITED ACTIVITIES

The following activities are strictly prohibited under any circumstances. Engaging in any of these activities will result in immediate termination of the lab, academic discipline, and potential legal referral:

1. **Testing Unauthorized Websites:** Under no condition may tools, scanners, or manual payloads be directed at any external website, cloud server, or domain name.
2. **Scanning Public IP Addresses:** Executing port scanners (e.g., `nmap`), vulnerability scanners, or crawlers across public IP ranges or local area networks.
3. **Attacking College or Corporate Networks:** Probing, sniffing, or attacking university, campus, school, or corporate Wi-Fi/LAN networks.
4. **Denial-of-Service (DoS / DDoS):** High-volume stress testing, network flooding (SYN floods, UDP floods), resource exhaustion attacks (slowloris), or fork bombs against the container or host machine.
5. **Stealing or Modifying Real User Data:** Juice Shop contains simulated fictitious customer data. If any real-world personal information is encountered, all testing must cease immediately.
6. **Container Breakout & Host Compromise:** Exploiting kernel vulnerabilities or Docker daemon socket vulnerabilities to escape the container sandbox and access the host operating system.
7. **Automated Mass Brute-Force:** Running unfettered high-speed dictionary attacks that degrade host CPU or disk performance.
8. **Malware Dissemination:** Uploading or deploying live ransomware, keyloggers, or destructive payloads to the container.

---

## 8. NETWORK RESTRICTIONS

1. **Loopback Constraint:** The target container must remain bound exclusively to `127.0.0.1`. The wildcard IP address `0.0.0.0` is strictly forbidden.
2. **No Port Forwarding:** Router port forwarding (NAT forwarding, UPnP, or DMZ hosting) must never be enabled for port 3000.
3. **No Bridging to Public Interfaces:** Docker network configurations must not bridge the container directly to a public or wireless interface.
4. **Proxy Restrictions:** If using intercepting proxies (e.g., Burp Suite or OWASP ZAP), proxy upstream listeners must be restricted to loopback (`127.0.0.1:8080`) and must not relay traffic to external destinations.

---

## 9. DATA HANDLING REQUIREMENTS

1. **Synthetic Data Only:** All test accounts, credentials, payment data, and transaction records used during testing must be synthetic/mock data generated by the OWASP Juice Shop application.
2. **Artifact Sanitization:** All screenshots, terminal outputs, and vulnerability reports prepared for academic submission must be sanitized to ensure no personal host information (such as personal directories, sensitive environment variables, or private API keys) is disclosed.
3. **Ephemeral Storage:** Test results, challenge progress tokens, and notes should be securely stored in the designated project folder. Once academic evaluation is finalized, temporary container state should be cleanly pruned (`docker rm -f juice-shop`).

---

## 10. MANDATORY STOP CONDITIONS

Testing must immediately cease, and the laboratory environment must be safely shutdown if any of the following conditions occur:

1. **Unexpected Access to External Systems:** Any tool, request, or script generates an outbound connection to an external or unfamiliar IP address.
2. **Accidental Exposure to Public Networks:** Discovery that the Docker container port is accessible from another machine on the LAN or the Internet.
3. **Unexpected Impact on Host Machine:** Extreme host CPU saturation, thermal throttling, unexpected file modification outside the lab, or system instability.
4. **Discovery of Sensitive Real-World Data:** Accidental access to genuine credentials, private keys, or personal identifying information.
5. **Uncertainty Regarding Authorization:** Any doubt regarding whether an action falls within the approved educational scope.

---

## 11. INCIDENT RESPONSE PROCEDURE

If a stop condition or potential security policy breach occurs, the student must execute the following containment procedure immediately:

```text
Step 1: CONTAIN
        Execute immediate shutdown of the container:
        docker stop juice-shop

Step 2: DISCONNECT
        If accidental network exposure is suspected, disconnect the host 
        machine from the local network (disconnect Wi-Fi / unplug Ethernet cable).

Step 3: PRESERVE LOGS
        Capture container runtime logs for forensic review:
        docker logs juice-shop > emergency-containment-log.txt

Step 4: REPORT & ESCALATE
        Notify the lab instructor, academic advisor, or faculty supervisor 
        in writing within 2 hours, detailing the time, action performed, 
        and observed anomaly.

Step 5: POST-INCIDENT REMEDIATION
        Remove the container image and virtual network:
        docker rm -f juice-shop
        docker network prune -f
        Await formal guidance before resuming laboratory activity.
```

---

## 12. RESPONSIBLE DISCLOSURE PRINCIPLES

While OWASP Juice Shop is an intentionally vulnerable educational application where vulnerabilities are documented by design:

1. **Simulated Reporting:** The student will practice drafting professional, responsible vulnerability disclosure reports highlighting root causes and remediation recommendations.
2. **Real-World Translation:** The student acknowledges that in real-world environments, identifying a vulnerability on any system without explicit authorization does not grant permission to exploit it, and discovered vulnerabilities must be reported through coordinated disclosure channels (e.g., `security.txt`, bug bounty platforms, or CERT coordinators) without public extortion or disclosure.

---

## 13. PERSONAL AUTHORIZATION DECLARATION

I, the undersigned student, hereby declare:
1. I have read, understood, and agree to abide strictly by this Rules of Engagement document.
2. I recognize that performing penetration testing techniques against systems without explicit, documented authorization is a criminal offense under applicable federal, state, and international cyber legislation.
3. I will restrict all testing activities exclusively to the locally isolated target (`127.0.0.1:3000`) and will immediately execute the incident containment procedure if any boundary anomaly occurs.
4. I understand that failure to comply with these rules will result in academic sanctions, course failure, and potential legal consequence.

---

## 14. SIGNATURE SECTION

*This document must be completed with genuine personal details prior to the commencement of testing.*

```text
================================================================================
                         STUDENT LAB PRACTITIONER
================================================================================

Student Full Name:       _____________________________________________________

Student ID / Roll No:    _____________________________________________________

Academic Institution:    _____________________________________________________

Course / Module Title:   _____________________________________________________

Target Host Machine OS:  _____________________________________________________

Date (YYYY-MM-DD):       _____________________________________________________

Student Signature:       _____________________________________________________


================================================================================
                    LAB SUPERVISOR / ACADEMIC ADVISOR
================================================================================

Advisor Full Name:       _____________________________________________________

Department / Title:      _____________________________________________________

Review Status:           [  ] APPROVED     [  ] REJECTED     [  ] PENDING

Approval Date:           _____________________________________________________

Advisor Signature:       _____________________________________________________
================================================================================
```
