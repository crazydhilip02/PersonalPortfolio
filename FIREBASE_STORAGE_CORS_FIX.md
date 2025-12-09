# 🔧 FIREBASE STORAGE CORS FIX - COMPLETE GUIDE

## Overview
This guide will help you fix the local image upload CORS error step by step.

---

## STEP 1: Install Google Cloud CLI

### Windows Installation:

1. **Download the installer:**
   👉 https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

2. **Run the installer:**
   - Double-click `GoogleCloudSDKInstaller.exe`
   - Follow the installation wizard
   - ✅ Check "Run gcloud init" at the end

3. **After installation, a terminal window opens.**
   - It will ask you to log in

---

## STEP 2: Login to Google Cloud

When the terminal opens after installation:

```
Welcome! This command will take you through the configuration of gcloud.

Your current configuration has been set to: [default]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic passed (1/1 checks passed).

You must log in to continue. Would you like to log in (Y/n)?
```

**Type:** `Y` and press Enter

A browser window will open:
1. Sign in with your **Google account** (same one used for Firebase)
2. Click "Allow" to grant permissions
3. Return to the terminal

---

## STEP 3: Select Your Project

After login, it will show:

```
Pick cloud project to use:
 [1] studio-1183784247-373e5
 [2] Create a new project
Please enter numeric choice or text value (must exactly match list item):
```

**Type:** `1` (or the number for `studio-1183784247-373e5`)

---

## STEP 4: Apply CORS Configuration

**Open a NEW terminal** (Command Prompt or PowerShell) and run:

```powershell
cd C:\Users\dk637\OneDrive\Desktop\PROJECTS\PersonalPortfolio
gsutil cors set cors.json gs://studio-1183784247-373e5.appspot.com
```

**Expected output:**
```
Setting CORS on gs://studio-1183784247-373e5.appspot.com/...
```

---

## STEP 5: Verify CORS is Set

Run this command to check:

```powershell
gsutil cors get gs://studio-1183784247-373e5.appspot.com
```

**Expected output:**
```json
[{"maxAgeSeconds": 3600, "method": ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"], "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"], "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-meta-*", "Authorization"]}]
```

---

## STEP 6: Restart Dev Server

1. Go to your terminal running `npm run dev`
2. Press `Ctrl + C` to stop it
3. Run again: `npm run dev`

---

## STEP 7: Test Image Upload

1. Open: http://localhost:5173/admin
2. Login to admin panel
3. Go to **Projects** tab
4. Click to add a new project
5. Click **"Upload Local"** or similar button
6. Select an image file
7. **Should upload successfully!** ✅

---

## 🆘 TROUBLESHOOTING

### Error: `gsutil is not recognized`
- Close and reopen your terminal
- Or restart your computer
- The PATH needs to update after installation

### Error: `AccessDeniedException: 403`
- Make sure you're logged in with the correct Google account
- Run: `gcloud auth login`
- Then try the gsutil command again

### Error: `BucketNotFoundException: 404`
- Check bucket name is correct: `studio-1183784247-373e5.appspot.com`

---

## ✅ SUMMARY OF COMMANDS

```powershell
# 1. Navigate to project folder
cd C:\Users\dk637\OneDrive\Desktop\PROJECTS\PersonalPortfolio

# 2. Apply CORS configuration
gsutil cors set cors.json gs://studio-1183784247-373e5.appspot.com

# 3. Verify it worked
gsutil cors get gs://studio-1183784247-373e5.appspot.com

# 4. Restart dev server
npm run dev
```

---

## 📞 NEED HELP?

If any step fails, copy the error message and share it with me. I'll help you fix it!
