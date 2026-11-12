# LAB INSTALLATION & CONFIGURATION GUIDE
## Isolated OWASP Juice Shop Deployment on Docker
**Document ID:** SEC-GUIDE-LAB-2026-V1  
**Target:** Localhost Sandboxed Web Security Environment  
**Supported Platforms:** Windows 10/11 (WSL 2 Backend) & Ubuntu Linux 22.04 / 24.04 LTS  

---

## 1. Prerequisites & System Requirements

Before configuring the laboratory, ensure your host machine satisfies the following hardware and virtualization criteria:

- **Hardware:**
  - CPU: 64-bit Dual Core processor with Virtualization Technology enabled (Intel VT-x or AMD-V in BIOS/UEFI).
  - RAM: Minimum 4 GB (8 GB recommended for smooth multitasking).
  - Storage: Minimum 5 GB free disk space.
- **Privileges:** Administrator (Windows) or `sudo` root privileges (Ubuntu Linux).

> **IMPORTANT NOTICE:**  
> This setup guide contains commands and expected outputs for reference. **Do not claim that installation or verification has been completed until you execute each step on your host machine and capture genuine screenshots for your evidence portfolio.**

---

## 2. Platform-Specific Docker Installation

Select the installation instructions corresponding to your operating system:

### Option A: Windows 10 / 11 (Docker Desktop + WSL 2)

1. **Enable Virtual Machine Platform & WSL:**
   Open PowerShell as Administrator and run:
   ```powershell
   wsl --install
   ```
   Restart your computer if prompted.

2. **Download & Install Docker Desktop:**
   - Download the installer from the official portal: `https://www.docker.com/products/docker-desktop/`
   - Run `Docker Desktop Installer.exe`. Ensure the option **"Use WSL 2 instead of Hyper-V (recommended)"** is checked.
   - Complete installation and log out or reboot Windows.

3. **Start Docker Desktop:**
   - Launch Docker Desktop from the Start Menu.
   - Accept the Docker Service Agreement.
   - Wait until the bottom-left whale icon turns green, indicating the Docker Engine daemon is running.

4. **Verify Installation in PowerShell:**
   ```powershell
   docker --version
   ```
   *Expected Output:*
   ```text
   Docker version 27.x.x, build ...
   ```

---

### Option B: Ubuntu Linux (22.04 / 24.04 LTS via Docker Engine)

1. **Update Package Index & Install Dependencies:**
   ```bash
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg lsb-release
   ```

2. **Add Docker Official GPG Key & Repository:**
   ```bash
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

3. **Configure Non-Root Access & Start Service:**
   ```bash
   sudo usermod -aG docker $USER
   sudo systemctl enable docker
   sudo systemctl start docker
   ```
   *Note: Log out and log back in for group changes to take effect.*

4. **Verify Installation:**
   ```bash
   docker --version
   ```

---

## 3. Step-by-Step Lab Deployment

### Step 1: Verify Docker Daemon Connectivity

Run:
```bash
docker info
```

**Technical Explanation:** This command validates that the Docker client CLI can communicate with the background Docker daemon engine (`dockerd`) through the local IPC socket.

---

### Step 2: Download the Official OWASP Juice Shop Image

Run:
```bash
docker pull bkimminich/juice-shop
```

**Technical Explanation:**
- `docker pull`: Instructs the engine to contact Docker Hub registry.
- `bkimminich/juice-shop`: The official, audited repository managed by the OWASP project lead (Bjoern Kimminich). It pulls the latest pre-compiled image containing Node.js, Express, Angular, and SQLite.

*Expected Output:*
```text
Using default tag: latest
latest: Pulling from bkimminich/juice-shop
...
Digest: sha256:...
Status: Downloaded newer image for bkimminich/juice-shop:latest
docker.io/bkimminich/juice-shop:latest
```

---

### Step 3: Launch the Container with Localhost-Only Isolation

Execute the following exact command:

```bash
docker run -d --name juice-shop --network bridge -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```

#### Detailed Command Line Flag Anatomy

| Parameter Flag | Value | Security & Operational Function |
| :--- | :--- | :--- |
| `docker run` | Subcommand | Instructs Docker to create and immediately start a container from an image. |
| `-d` | Detached Mode | Runs the container in the background, freeing your current terminal shell. |
| `--name` | `juice-shop` | Assigns a predictable, human-readable name to the container instance for lifecycle management. |
| `--network` | `bridge` | Connects the container to Docker's default virtual bridge network (`172.17.0.0/16`), isolating container network namespaces from the host kernel interfaces. |
| `-p` | `127.0.0.1:3000:3000` | **THE CRITICAL SECURITY BOUNDARY:** Maps port 3000 of the container specifically to the host's loopback interface (`127.0.0.1`). It strictly forbids listening on `0.0.0.0`, ensuring external Wi-Fi and LAN devices cannot access the application. |
| `bkimminich/juice-shop` | Image Name | Specifies the source container image downloaded in Step 2. |

*Expected Output:*
A 64-character hexadecimal container ID string (e.g., `4f9b8c2d1e...`).

---

### Step 4: Access Target in Web Browser

Open your browser and navigate to:
```text
http://localhost:3000
```
or
```text
http://127.0.0.1:3000
```

**What You Should See:**
The OWASP Juice Shop single-page application loads with a dark banner, a mock juice product catalog, and a "Welcome to OWASP Juice Shop" modal dialog.

---

### Step 5: Verify Container Runtime Status

Run:
```bash
docker ps --filter name=juice-shop
```

**Technical Explanation:** Confirms that the container process has not crashed, is running stably, and displays uptime and socket bindings.

*Expected Output:*
```text
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS          PORTS                      NAMES
4f9b8c2d1e8a   bkimminich/juice-shop   "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds    127.0.0.1:3000->3000/tcp   juice-shop
```

---

### Step 6: Verify Port Binding Audit

Run:
```bash
docker port juice-shop
```

**Technical Explanation:** Directly queries the Docker engine's port-mapping tables to verify which host IP address is listening for incoming TCP traffic.

*Expected Output:*
```text
3000/tcp -> 127.0.0.1:3000
```

> **SECURITY CHECKPOINT:**  
> If the output shows `0.0.0.0:3000` or `:::3000`, **STOP IMMEDIATELY**. That indicates you omitted `127.0.0.1:` and the container is exposed to your entire local network. Terminate the container with `docker rm -f juice-shop` and re-run Step 3 with `-p 127.0.0.1:3000:3000`.

---

## 4. Troubleshooting & Common Pitfalls

### Issue 1: Port 3000 is Already in Use
**Error Message:**
```text
docker: Error response from daemon: driver failed programming external connectivity on endpoint juice-shop: Bind for 127.0.0.1:3000 failed: port is already allocated.
```
**Diagnosis:** Another application (e.g., React dev server, Grafana, Node.js process) is already listening on port 3000.  
**Resolution:**
- Windows PowerShell:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
  ```
- Linux:
  ```bash
  sudo lsof -i :3000
  ```
- If an older Juice Shop container exists, stop and remove it:
  ```bash
  docker stop juice-shop
  docker rm juice-shop
  ```
- Alternatively, map to another localhost port (e.g., `127.0.0.1:3001:3000`).

---

### Issue 2: Cannot Connect to Docker Daemon
**Error Message:**
```text
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```
**Resolution:**
- On Windows: Ensure Docker Desktop is launched and the status indicator shows "Engine running".
- On Ubuntu Linux:
  ```bash
  sudo systemctl restart docker
  sudo systemctl status docker
  ```

---

### Issue 3: Container Exits Immediately After Starting
**Diagnosis:** Insufficient memory or container configuration conflict.  
**Check Container Logs:**
```bash
docker logs juice-shop
```
Ensure your system has at least 1 GB of free RAM dedicated to Docker.

---

## 5. Lab Teardown & Safe Decommissioning

When you finish your practice session or need to reset the environment:

```bash
# 1. Stop the running container safely
docker stop juice-shop

# 2. Remove the container instance (clears temporary session data)
docker rm juice-shop

# 3. Optional: Prune unused Docker network artifacts
docker network prune -f
```

---

## 6. Screenshot Capture Instructions for Evidence Submission

Capture the following 4 screenshots during this setup:

1. **Docker Version & Info (`EVD-01`):** Capture terminal executing `docker --version`.
2. **Container Running State (`EVD-02`):** Capture terminal executing `docker ps --filter name=juice-shop`.
3. **Juice Shop Web Homepage (`EVD-03`):** Capture web browser showing `http://localhost:3000` with the Juice Shop storefront.
4. **Port Binding Audit (`EVD-04`):** Capture terminal executing `docker port juice-shop` displaying `3000/tcp -> 127.0.0.1:3000`.

*Save your image files into the `evidence/` directory as specified in [evidence/evidence-checklist.md](../evidence/evidence-checklist.md).*

