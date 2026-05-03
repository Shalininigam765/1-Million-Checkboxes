# 1-Million-Checkboxes

A real-time, synchronized checkbox grid built with **Node.js**, **Socket.io**, and **Redis**, featuring a custom-built **Identity Provider (IdP)** using **RSA Asymmetric Encryption**.

## 🚀 Features
* **Real-time Sync**: 500 checkboxes synchronized across all connected clients.
* **Custom OIDC Layer**: Hand-rolled authentication using **RSA-256** (Private/Public key pairs).
* **Stateless Security**: Uses JWTs signed by a local private key; no session database required.
* **Concurrency**: Powered by **Redis** for state management and **Pub/Sub** for instant updates.
* **Modular Architecture**: Clean separation of concerns using the **MVC** pattern.

## 🛠️ Tech Stack
* **Frontend**: Vanilla JavaScript, HTML5, CSS3
* **Backend**: Node.js, Express.js
* **Real-time**: Socket.io
* **Database**: Redis (State + Pub/Sub)
* **Auth**: JSON Web Tokens (JWT) & RSA Encryption

---

## 🏗️ How It Works (The Security Flow)

### 1. Identity Provider Logic
The server acts as its own OIDC provider. On the first run, it automatically generates a **2048-bit RSA key pair** in the `/keys` directory.
* **Signing**: The `private.pem` is used by the server to sign user tokens during login.
* **Verification**: The `public.pem` is used to verify the signature of every checkbox toggle attempt.

### 2. Synchronization
When an authenticated user clicks a checkbox:
1. The frontend sends the **JWT** + **Checkbox Index** via Socket.io.
2. The server verifies the JWT using the Public Key.
3. Upon successful verification, the state is updated in **Redis**.
4. Redis **Pub/Sub** triggers a broadcast to all connected clients to update their UI.

---

## 🏃 How to Run

### 1. Prerequisites
* **Node.js** installed.
* **Redis** running
### 2. Installation
```bash
npm install
```
### 3. Start the app
```bash
npm start
```
