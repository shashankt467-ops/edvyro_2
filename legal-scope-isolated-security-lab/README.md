# Legal Scope and Isolated Lab – Safe Cybersecurity Practice Environment

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Lab Security: Isolated Localhost](https://img.shields.io/badge/Security-Localhost%20127.0.0.1%20Only-blue.svg)](#security-boundaries)
[![Target: OWASP Juice Shop](https://img.shields.io/badge/Target-OWASP%20Juice%20Shop%20v17+-orange.svg)](https://owasp-juice.shop)
[![Environment: Docker Bridge](https://img.shields.io/badge/Virtualization-Docker%20Bridge-cyan.svg)](https://www.docker.com/)
[![Rules of Engagement: Defined](https://img.shields.io/badge/ROE-Formally%20Defined-green.svg)](docs/Rules_of_Engagement.md)

An academically rigorous, beginner-friendly cybersecurity laboratory project demonstrating how to design, configure, verify, and document a secure, legal, and isolated local practice environment for application security testing.

---

## 1. Executive Summary & Objective

Practicing vulnerability identification and penetration testing techniques requires a target that is deliberately insecure. However, testing systems without explicit written permission is strictly prohibited under international cyber law (such as the US **Computer Fraud and Abuse Act (CFAA)** and UK **Computer Misuse Act**). Furthermore, deploying vulnerable applications onto public or shared local networks exposes the host system to automated network exploitation by adversaries.

### Core Objectives
1. **Legal Scope Demonstration**: Define formal, legally binding **Rules of Engagement (ROE)** with explicit target boundaries and stop conditions.
2. **Localhost Isolation**: Configure a containerized instance of **OWASP Juice Shop** bound exclusively to the loopback interface (`127.0.0.1:3000`), preventing access from adjacent local network (LAN) hosts and the public Internet (WAN).
3. **Architectural Verification**: Map and document the virtualization boundary between the Host OS and the Docker virtual bridge network.
4. **Authentic Evidence Auditing**: Establish a non-repudiable evidence checklist to verify Docker engine status, container runtime health, and socket binding before engaging in offensive practice.

---

## 2. Technology Stack

- **Virtualization Engine**: Docker Desktop / Docker Engine (Linux Bridge Driver)
- **Vulnerable Target**: OWASP Juice Shop (`bkimminich/juice-shop`)
- **Documentation Dashboard**: HTML5, CSS3 (Modern Dark Cybersecurity Theme), Vanilla JavaScript (Zero External CDN Dependencies)
- **Diagram Formats**: Vector SVG (Draw.io compatible with embedded XML metadata)
- **Verification Standards**: RFC 1122 / RFC 5735 (Loopback Address Protocol Standards)

---

## 3. Lab Architecture & Topology

The practice environment strictly adheres to a three-tier host-to-container boundary:

```
+-------------------------------------------------------------------------------+
|                                 HOST WORKSTATION                              |
|                                                                               |
|   +-----------------------+              +--------------------------------+   |
|   | Local Web Browser     |              | Operating System Network Stack |   |
|   | http://127.0.0.1:3000 | <----------> | Loopback Interface (lo0)       |   |
|   +-----------------------+              | 127.0.0.1                      |   |
|                                          +--------------------------------+   |
|                                                          ^                    |
|                                                          | Port Forwarding    |
|                                                          | 127.0.0.1:3000     |
|                                                          v                    |
|   +-----------------------------------------------------------------------+   |
|   |                         DOCKER ENGINE SUBSYSTEM                       |   |
|   |                                                                       |   |
|   |   +---------------------------------------------------------------+   |   |
|   |   | Docker Default Bridge Network (172.17.0.0/16)                |   |   |
|   |   | Virtual Gateway: 172.17.0.1                                   |   |   |
|   |   +---------------------------------------------------------------+   |   |
|   |                                  |                                    |   |
|   |                                  v                                    |   |
|   |   +---------------------------------------------------------------+   |   |
|   |   | Container Sandbox: juice-shop (Container IP: 172.17.0.2)     |   |   |
|   |   | Internal Port: 3000/tcp                                       |   |   |
|   |   |                                                               |   |   |
|   |   | Target: OWASP Juice Shop Application                          |   |   |
|   |   | - Node.js Express Backend                                     |   |   |
|   |   | - Angular Frontend Single Page Application                   |   |   |
|   |   | - SQLite Local Database                                       |   |   |
|   |   +---------------------------------------------------------------+   |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
                                       |
                     XXXXXXXXXXXXXXXXXX|XXXXXXXXXXXXXXXXXX
                     X                 v                 X
                     X   BLOCKED: Physical NIC / Wi-Fi   X
                     X   No External Inbound Access      X
                     X   LAN / WAN Cannot Reach Port     X
                     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Critical Architecture Note
> **WARNING**: Localhost port binding (`127.0.0.1:3000`) prevents inbound network access from remote LAN and Internet endpoints, but it **is not an air-gapped system**. The container shares the host kernel and network interface hardware. Host-side browser extensions, local malware, or malicious Server-Side Request Forgery (SSRF) scripts executing on the host can communicate with the target. Never run uninspected exploit scripts against the container.

---

## 4. Quick Start & Setup Guide

### Prerequisites
- Docker Desktop (Windows / macOS) or Docker Engine (Ubuntu / Debian / RHEL).
- Terminal access (PowerShell for Windows, Bash for Linux).

### Setup Commands

```bash
# 1. Verify Docker Engine runtime
docker --version

# 2. Pull official OWASP Juice Shop image
docker pull bkimminich/juice-shop

# 3. Launch isolated container bound strictly to localhost loopback
docker run -d --name juice-shop --network bridge -p 127.0.0.1:3000:3000 bkimminich/juice-shop

# 4. Confirm container is running
docker ps --filter name=juice-shop

# 5. Verify localhost port binding
docker port juice-shop
# Expected Output: 3000/tcp -> 127.0.0.1:3000
```

Access the application in your browser:
```
http://127.0.0.1:3000
```

*For comprehensive OS-specific installation instructions, WSL2 configurations, and troubleshooting, refer to [docs/Lab_Setup_Guide.md](docs/Lab_Setup_Guide.md).*

---

## 5. Security & Isolation Boundaries

| Aspect | Safe Practice Setting | Prohibited Insecure Setting | Reason |
| :--- | :--- | :--- | :--- |
| **IP Binding** | `127.0.0.1:3000:3000` | `0.0.0.0:3000:3000` or `-p 3000:3000` | Wildcard `0.0.0.0` binds to all interfaces, exposing Juice Shop to the entire Wi-Fi/LAN. |
| **Network Mode** | `--network bridge` | `--network host` | Host networking disables Docker network isolation entirely. |
| **Port Forwarding** | Disabled on Home Router | Enabled / DMZ | Public port forwarding subjects the vulnerable app to automated Internet botnet crawlers. |
| **DNS Resolution** | `localhost` / `127.0.0.1` | Public domain / DDNS | Vulnerable application must never be mapped to a routable public domain. |

*Detailed architectural breakdown and network packet filtering rules are provided in [docs/Network_Isolation.md](docs/Network_Isolation.md).*

---

## 6. Rules of Engagement (Summary)

All cybersecurity testing activities must strictly comply with the authorized parameters:

- **Target System**: Local Docker container running OWASP Juice Shop (`127.0.0.1:3000`).
- **Permitted Activities**:
  - OWASP Top 10 web vulnerabilities (SQL Injection, Cross-Site Scripting, Broken Access Control, Security Misconfiguration) contained strictly within the Juice Shop challenge suite.
  - Manual payload craft and inspection using browser developer tools or local proxy (Burp Suite / OWASP ZAP configured strictly for `127.0.0.1:3000`).
- **Strictly Prohibited Activities**:
  - Scanning, probing, or testing any public IP address, university campus network, or corporate network.
  - Denial of Service (DoS/DDoS) stress testing against the host or container.
  - Attempting container breakouts or host operating system privilege escalation.
  - Using automated scanning tools (e.g., mass brute-force) that risk host resource exhaustion.
- **Immediate Stop Conditions**:
  - Any discovery of real-world personal data (PII) or production credentials.
  - Detection of network traffic leaving the local loopback interface.
  - Unexpected host system instability or overheating.

*The complete 14-section formal document and printable signature template is available in [docs/Rules_of_Engagement.md](docs/Rules_of_Engagement.md) and [reports/Rules_of_Engagement.pdf](reports/Rules_of_Engagement.pdf).*

---

## 7. Evidence Collection Checklist

To satisfy academic verification and technical audits, the student must capture and deposit authentic, un-manipulated terminal output screenshots into `evidence/`:

| Evidence ID | Description | Command / URL to Capture | Target File |
| :--- | :--- | :--- | :--- |
| `EVD-01` | Docker Installation & Version | `docker --version; docker info` | `evidence/evd-01-docker-install.png` |
| `EVD-02` | Docker Container Running State | `docker ps -a --filter name=juice-shop` | `evidence/evd-02-docker-ps.png` |
| `EVD-03` | OWASP Juice Shop Web Interface | `http://127.0.0.1:3000` (Browser) | `evidence/evd-03-juice-shop-web.png` |
| `EVD-04` | Localhost Port Binding Audit | `docker port juice-shop` | `evidence/evd-04-port-binding.png` |
| `EVD-05` | Lab Topology Diagram | `diagrams/lab-topology.svg` | `evidence/evd-05-lab-topology.png` |
| `EVD-06` | Signed Rules of Engagement Document | Signed Document Block | `evidence/evd-06-signed-roe.png` |

> **IMPORTANT**: In accordance with academic integrity guidelines, no terminal output or screenshots may be fabricated. Checkmarks must only be confirmed once actual verification commands succeed on the student workstation.

---

## 8. Repository Structure

```
legal-scope-isolated-security-lab/
├── README.md                           # Master Project Documentation & Portfolio Overview
├── index.html                          # Interactive Cybersecurity Lab Dashboard
├── css/
│   └── style.css                       # Cybersecurity Theme Styling (Dark Navy / Terminal Emerald)
├── js/
│   └── app.js                          # Dynamic Verification Checklist & Interactive Controls
├── docs/
│   ├── Rules_of_Engagement.md          # 14-Section Formal Legal Rules of Engagement Document
│   ├── Lab_Setup_Guide.md              # Detailed Beginner Guide (Windows PowerShell & Ubuntu Linux)
│   ├── Network_Isolation.md            # Deep Technical Dive into Loopback Routing & Docker Networking
│   └── Safety_Policy.md                # Ethics, CFAA Compliance, and Safe Payload Standards
├── diagrams/
│   ├── lab-topology.svg                # Draw.io-compatible Lab Architecture Vector Diagram
│   └── network-isolation.svg           # Localhost vs Wildcard Interface Comparison Diagram
├── evidence/
│   └── evidence-checklist.md           # Formal Verification Audit Trail & Evidence Manifest
└── reports/
    ├── Rules_of_Engagement.html        # Clean Printable Executive Template
    └── Rules_of_Engagement.pdf         # Publication-Quality PDF Rules of Engagement
```

---

## 9. Learning Outcomes

Upon completing this project, the student has demonstrated:
1. **Foundational Security Ethics**: Comprehension of authorization boundaries and criminal liability associated with unauthorized penetration testing.
2. **Containerized Environment Engineering**: Practical capability in provisioning isolated container workloads using Docker CLI.
3. **Network Boundary Defenses**: Operational knowledge of RFC 1122 loopback IP constraints versus open socket listeners.
4. **Professional Technical Documentation**: Creation of clear, audit-ready engineering artifacts and formal rules of engagement.

---

## 10. Local Dashboard Launch

To view the interactive laboratory dashboard with live verification tracking:

```bash
# Option 1: Open directly in your default browser
# Windows:
start index.html
# Linux / Ubuntu:
xdg-open index.html

# Option 2: Serve via local static HTTP server (Python or Node)
npx serve .
# Or:
python3 -m http.server 8080
```
Open your browser to `http://127.0.0.1:8080` (or local file path).

