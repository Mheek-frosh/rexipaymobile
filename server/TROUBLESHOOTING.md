# Connection Troubleshooting

## "Connection Failed" / ERR_CONNECTION_TIMED_OUT

When the app or browser can't reach `http://192.168.1.5:3001`:

### 1. Start the server
```bash
cd server
npm start
```
You should see: `RexiPay Auth Server running on http://localhost:3001`

### 2. Allow Windows Firewall
Windows may block incoming connections. Run PowerShell **as Administrator**:

```powershell
New-NetFirewallRule -DisplayName "RexiPay Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

Or manually: Windows Security → Firewall → Advanced settings → Inbound Rules → New Rule → Port → TCP 3001 → Allow.

### 3. Test from browser
On the same PC, open: `http://localhost:3001/health`

You should see: `{"status":"ok"}`

Then try: `http://192.168.1.5:3001/health` (from the same PC or your phone on same WiFi).

### 4. Same WiFi
Your phone and PC must be on the **same WiFi network** for `192.168.1.5` to work.

---

## OPay Account (9034448700)

OPay accounts are often domiciled at **Lotus Bank** (code 303). The NUBAN lookup may return Lotus Bank.

**Flutterwave Test Mode:** Some banks may not resolve in sandbox. If account resolution fails for OPay/Lotus Bank in test mode, try:
- A different test account (e.g. Access Bank, GTBank)
- Or switch to Flutterwave **live** keys for production

Test account numbers that often work with Flutterwave sandbox: `0690000032` (Access Bank), `0123456789` (varies by bank).
