# 🦸 Herotopia - Quick Reference Card

## 🚀 Quick Start

### Windows (Fastest)
```batch
double-click start.bat
```

### PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Manual (Any OS)
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python setup.py
python app.py
```

**Then open**: http://localhost:5000

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app.py` | Main Flask server |
| `config.py` | Settings & system prompts |
| `models_handler.py` | VLLM AI engine |
| `library_manager.py` | File browser |
| `templates/index.html` | Main UI |
| `static/js/chat.js` | Chat logic |
| `static/js/library.js` | Library logic |

---

## ⚙️ Configuration

### Change AI Model
Edit `config.py`:
```python
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
# or "Qwen/Qwen1.5-0.5B-Chat"
```

### Customize System Prompt
Edit `config.py` → `SYSTEM_PROMPTS`:
```python
SYSTEM_PROMPTS = {
    "en": "Your custom English prompt...",
    "ar": "مرحبا، أنا مساعد تعليمي...",
    "fr": "Bonjour, je suis..."
}
```

### Add New Language
1. Add to `SYSTEM_PROMPTS` in `config.py`
2. Add button in `templates/base.html`
3. Add to `SUPPORTED_LANGUAGES` in `app.py`

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `taskkill /PID <pid> /F` or change port |
| Module not found | `pip install -r requirements.txt` |
| Bootstrap missing | `python setup.py` |
| Slow responses | Use smaller model in config.py |
| Out of memory | Reduce MAX_TOKENS in config.py |

---

## 📚 Add Content to Library

Place files in `library/` folder:
```
library/
├── Mathematics/
│   ├── Algebra.pdf
│   └── Geometry.txt
├── Science/
│   ├── Biology.mp4
│   └── Chemistry.png
└── History/
    └── Ancient_Rome.pdf
```

Supported types: PDF, DOC, TXT, MP4, PNG, JPG, GIF, PPTX, CSV, XLSX

---

## 🌐 Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Main page |
| `/chat` | POST | Send message to AI |
| `/library` | GET | List files |
| `/library/<path>` | GET | Download/view file |
| `/static/<file>` | GET | CSS/JS/Bootstrap |

---

## 💾 Data Storage

- **Chat History**: Browser localStorage + auto-save every 30s
- **Library**: `library/` folder on disk
- **Models**: `models/` folder (auto-downloaded)
- **Settings**: `config.py`

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Focus chat input |
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `Escape` | Unfocus input |

---

## 🌍 Languages Supported

- 🇬🇧 **English** (en)
- 🇸🇦 **العربية** (ar)
- 🇫🇷 **Français** (fr)

---

## 💾 Browser Compatibility

✅ Chrome, Firefox, Safari, Edge (modern versions)
❌ Internet Explorer 11

---

## 🔒 Security & Privacy

- ✅ Runs completely offline
- ✅ No cloud connectivity
- ✅ No data collection
- ✅ All data stored locally
- ✅ Open source

---

## 📊 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4GB | 8GB+ |
| Disk | 20GB free | 30GB+ |
| Processor | Dual-core | Quad-core |
| Internet | For setup only | For model download |

---

## 🔧 API Examples

### Chat API
```javascript
fetch('/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        message: "What is photosynthesis?",
        language: "en",
        history: []
    })
})
```

### Library API
```javascript
fetch('/library')
    .then(r => r.json())
    .then(data => console.log(data.items))
```

---

## 📝 System Prompts

Each language has a custom system prompt that instructs the AI to:
- Help students learn
- Explain simply
- Stay on educational topics
- Maintain language
- Be respectful

Edit in `config.py` → `SYSTEM_PROMPTS`

---

## 🚀 Performance Tips

1. **Use smaller models** for faster responses (Qwen 0.5B)
2. **Reduce MAX_TOKENS** for quicker generation
3. **Clear browser cache** if UI feels slow
4. **Use wired internet** for model download
5. **Close other apps** to free up RAM

---

## 📚 File Structure

```
demo/
├── app.py                    # Server
├── config.py                 # Configuration
├── models_handler.py         # AI Engine
├── library_manager.py        # File Manager
├── setup.py                  # Setup helper
├── start.bat / start.ps1     # Startup scripts
├── requirements.txt          # Dependencies
├── README.md                 # User guide
├── IMPLEMENTATION.md         # Technical guide
├── templates/
│   ├── base.html            # Layout
│   └── index.html           # Main page
├── static/
│   ├── css/style.css        # Styling
│   ├── js/*.js              # JavaScript
│   └── lib/bootstrap/       # Bootstrap offline
├── models/                  # AI models
└── library/                 # User content
```

---

## 🎓 Educational Use

**Ideal for:**
- Tutoring platforms
- Distance learning
- School computer labs
- Personal study
- Classroom teaching

**Subject matter:**
- Any academic subject
- Science & mathematics
- Languages & history
- Technology & coding
- General knowledge

---

## 🆘 Debug Tips

### Enable Debug Mode
Edit `app.py`:
```python
app.run(debug=True)
```

### Check Logs
Watch terminal output while running app.py

### Browser DevTools
Press F12 → Console for JavaScript errors

### Check Config
```python
python -c "from config import Config; print(Config.MODEL_NAME)"
```

---

## 📞 Quick Help

**Something not working?**

1. Check terminal for error messages
2. Try clearing browser cache (Ctrl+Shift+Del)
3. Restart the application
4. Check README.md troubleshooting section
5. Review IMPLEMENTATION.md for details

---

## 🎯 Next Steps

1. ✅ Install and run the app
2. ✅ Test the chatbot in all 3 languages
3. ✅ Add content to the library
4. ✅ Customize system prompts
5. ✅ Share with students!

---

## 📄 License & Credits

- **Framework**: Flask
- **AI Model**: VLLM
- **UI**: Bootstrap 5
- **Version**: 1.0.0
- **Status**: Production Ready ✓

---

**🦸 Welcome to Herotopia - Educational Excellence Powered by AI**

Last Updated: December 2024
