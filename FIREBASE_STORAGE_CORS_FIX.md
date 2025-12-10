# 🔧 FIREBASE STORAGE CORS FIX - UPDATED FOR NEW PROJECT

## Your New Firebase Project
- **Project ID:** dhilip-s-portfolio-907aa
- **Storage Bucket:** dhilip-s-portfolio-907aa.firebasestorage.app

---

## STEP 1: Install Google Cloud CLI (If Not Installed)

### Windows Installation:

1. **Download the installer:**
   👉 https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

2. **Run the installer:**
   - Double-click `GoogleCloudSDKInstaller.exe`
   - Follow the installation wizard
   - ✅ Check "Run gcloud init" at the end

---

## STEP 2: Login to Google Cloud

Open a **new terminal** and run:

```powershell
gcloud auth login
```

A browser window will open - sign in with your Google account.

---

## STEP 3: Apply CORS Configuration

Run these commands:

```powershell
cd C:\Users\dk637\OneDrive\Desktop\PROJECTS\PersonalPortfolio
gsutil cors set cors.json gs://dhilip-s-portfolio-907aa.firebasestorage.app
```

**Expected output:**
```
Setting CORS on gs://dhilip-s-portfolio-907aa.firebasestorage.app/...
```

---

## STEP 4: Verify CORS is Set

```powershell
gsutil cors get gs://dhilip-s-portfolio-907aa.firebasestorage.app
```

---

## STEP 5: Restart Dev Server & Test

1. Stop dev server: `Ctrl + C`
2. Restart: `npm run dev`
3. Go to admin panel
4. Try uploading an image

---

## 📞 Troubleshooting

If you get errors:
- `gsutil not found` → Restart terminal or computer
- `AccessDeniedException` → Run `gcloud auth login` again
- `BucketNotFoundException` → Check bucket name is correct

---

## ✅ Quick Commands Summary

```powershell
# 1. Login
gcloud auth login

# 2. Navigate to project
cd C:\Users\dk637\OneDrive\Desktop\PROJECTS\PersonalPortfolio

# 3. Apply CORS
gsutil cors set cors.json gs://dhilip-s-portfolio-907aa.firebasestorage.app

# 4. Verify
gsutil cors get gs://dhilip-s-portfolio-907aa.firebasestorage.app
```
