# ✅ Herotopia Setup Checklist

## Pre-Installation
- [ ] Python 3.8+ installed (`python --version`)
- [ ] pip working (`pip --version`)
- [ ] 20GB+ free disk space
- [ ] 8GB+ RAM (4GB minimum)
- [ ] Internet connection (for model download)

## Installation Steps

### Step 1: Navigate to Project
```powershell
cd c:\Users\zorgu\Desktop\IEEE\TSYP13_Projects\Herotopia\demo
```
- [ ] In correct directory
- [ ] Can see app.py and other files
- [ ] No permission issues

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
- [ ] venv folder created
- [ ] Virtual environment activated (see (venv) in prompt)

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```
- [ ] Installation completes without errors
- [ ] All packages installed successfully
- [ ] No warnings about missing dependencies

### Step 4: Run Setup
```powershell
python setup.py
```
- [ ] Directories created
- [ ] Bootstrap downloaded (or skipped if already exists)
- [ ] Sample library structure created
- [ ] No errors reported

### Step 5: Start Application
```powershell
python app.py
```
- [ ] Flask server starts
- [ ] Message: "Running on http://127.0.0.1:5000"
- [ ] No errors in terminal
- [ ] Application ready

### Step 6: Open Browser
- [ ] Open http://localhost:5000
- [ ] Page loads without errors
- [ ] UI is visible and responsive
- [ ] Navigation works

## First-Use Testing

### Chatbot Features
- [ ] Default welcome message displays
- [ ] Chat input box is active
- [ ] Send button works
- [ ] Type test message: "What is photosynthesis?"
- [ ] Message appears in chat (user side)
- [ ] Typing indicator appears
- [ ] Response is generated (may take 10-30s first time)
- [ ] Response appears in chat (bot side)

### Language Testing
- [ ] Language selector dropdown opens
- [ ] Can select English (EN)
- [ ] Can select Arabic (AR)
- [ ] Can select French (FR)
- [ ] UI updates language labels
- [ ] Try chat message in each language
- [ ] Responses are in correct language

### Chat Features
- [ ] Keyboard Enter sends message
- [ ] Shift+Enter creates new line
- [ ] Send button works with mouse
- [ ] Ctrl+K focuses input (optional)
- [ ] Chat history persists after page refresh
- [ ] Multiple messages show correctly

### Library Features
- [ ] Click "Digital Library" button
- [ ] Library page loads
- [ ] Sample folders display
- [ ] Sample files display
- [ ] File icons show correctly
- [ ] File sizes display
- [ ] Can click on folders (breadcrumb updates)
- [ ] Can click "back" to parent folder
- [ ] Search bar filters files

### Library File Operations
- [ ] Click PDF file → opens in new tab
- [ ] Click image file → preview modal shows
- [ ] Click video file → player appears
- [ ] Right-click on file → context menu
- [ ] "Open" option works
- [ ] "Download" option works
- [ ] "Copy Path" copies to clipboard

### About Section
- [ ] Click "About" button
- [ ] About page displays correctly
- [ ] All information readable
- [ ] Links work (if any)
- [ ] Back to chatbot works

### Responsive Design
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] All layouts work
- [ ] Touch interactions work
- [ ] No horizontal scrolling

### Performance
- [ ] Initial page load < 2 seconds
- [ ] Chat response generation (varies by model)
- [ ] Library loading smooth
- [ ] No lag when typing
- [ ] Animations smooth
- [ ] No console errors (F12 → Console)

## Configuration Testing

### Edit System Prompt
- [ ] Open config.py
- [ ] Locate SYSTEM_PROMPTS dict
- [ ] Edit English prompt
- [ ] Save file
- [ ] Restart app
- [ ] Chat responds differently

### Change Model
- [ ] Open config.py
- [ ] Change MODEL_NAME to "Qwen/Qwen1.5-0.5B-Chat"
- [ ] Save file
- [ ] Restart app
- [ ] Model downloads and loads
- [ ] Chat works with new model

### Add Language
- [ ] Edit config.py
- [ ] Add new language to SYSTEM_PROMPTS
- [ ] Edit base.html to add language button
- [ ] Edit app.py SUPPORTED_LANGUAGES
- [ ] Restart app
- [ ] New language appears in dropdown
- [ ] Can select and use new language

## Content Management

### Add Files to Library
- [ ] Create subfolder in library/
- [ ] Add .txt file to subfolder
- [ ] Refresh library in browser
- [ ] New folder appears
- [ ] File displays with correct icon
- [ ] Can open file
- [ ] Can download file

### Test File Types
- [ ] Add .pdf → PDF icon shows
- [ ] Add .txt → Document icon shows
- [ ] Add .mp4 → Video icon shows
- [ ] Add .png → Image icon shows
- [ ] Each file opens/previews correctly

## Troubleshooting

### If Port 5000 is in Use
- [ ] Run: `netstat -ano | findstr :5000`
- [ ] Note PID from output
- [ ] Run: `taskkill /PID <PID> /F`
- [ ] Try app again

### If Python Not Found
- [ ] Reinstall Python from python.org
- [ ] Check "Add Python to PATH" during installation
- [ ] Restart computer
- [ ] Try again

### If Model Download Fails
- [ ] Check internet connection
- [ ] Check disk space (20GB needed)
- [ ] Check RAM available (8GB+)
- [ ] Try smaller model in config.py

### If Bootstrap Not Loading
- [ ] Check: `dir static\lib\bootstrap-5.3.0\css\`
- [ ] If missing, run: `python setup.py`
- [ ] Verify bootstrap.min.css exists
- [ ] Refresh browser (Ctrl+F5)

## Performance Optimization

### If App is Slow
- [ ] Check CPU/RAM usage (Task Manager)
- [ ] Try smaller model: "Qwen/Qwen1.5-0.5B-Chat"
- [ ] Reduce MAX_TOKENS in config.py
- [ ] Close other applications
- [ ] Check disk for fragmentation

### If Chat Responses are Slow
- [ ] First response slower (model initialization)
- [ ] Subsequent responses faster
- [ ] Very large responses take longer
- [ ] Try reducing MAX_TOKENS

### If Library is Slow
- [ ] Too many files? Library scans recursively
- [ ] Check system resources
- [ ] Clear browser cache
- [ ] Restart application

## Final Verification

### Code Structure
- [ ] app.py exists and runnable
- [ ] config.py has correct settings
- [ ] models_handler.py has VLLM code
- [ ] library_manager.py has file listing
- [ ] All Python files have proper syntax

### Frontend Files
- [ ] base.html in templates/
- [ ] index.html in templates/
- [ ] style.css in static/css/
- [ ] All JavaScript files in static/js/
- [ ] Bootstrap exists in static/lib/

### Documentation
- [ ] README.md present and readable
- [ ] IMPLEMENTATION.md has technical details
- [ ] QUICKSTART.md has quick reference
- [ ] DELIVERY.md has overview
- [ ] requirements.txt has dependencies

### Auto-Created Directories
- [ ] models/ folder exists
- [ ] library/ folder exists
- [ ] Sample content in library/

## Deployment Readiness

- [ ] Code is production-quality
- [ ] Documentation is complete
- [ ] Error handling is robust
- [ ] No placeholder code
- [ ] All features working
- [ ] Security implemented
- [ ] Performance optimized
- [ ] Ready for students/users

## Sign-Off

- [ ] All checklist items complete
- [ ] Application fully functional
- [ ] No outstanding issues
- [ ] Ready for use
- [ ] Ready for deployment

---

## 📝 Notes

**Date Checked**: ___________
**Tester Name**: ___________
**Status**: ✅ PASSED / ❌ FAILED

**Issues Found** (if any):
- [ ] Issue 1: ___________
- [ ] Issue 2: ___________
- [ ] Issue 3: ___________

**Resolution**:
____________________________________
____________________________________

---

**🎓 When all items are checked, Herotopia is ready for educational use!**
