# EduField TN - The Outlying Assistance Station (DEMO)

A complete offline educational platform with AI-powered chatbot and digital library, built with Flask and VLLM.

## 📋 Features

- **🤖 AI Chatbot**: Local VLLM-powered conversational AI for educational support
- **🌐 Multi-language**: English, Arabic (العربية), and French (Français)
- **📚 Digital Library**: Browse and access PDFs, videos, images, documents
- **🔒 Privacy**: All processing happens locally - no internet required
- **⚡ Offline First**: Complete offline operation with local model storage
- **🎓 Educational Focus**: System prompts designed for student learning
- **📱 Mobile Friendly**: Responsive Bootstrap 5 interface
- **🔧 Easy Setup**: Simple Python-based configuration

## 🏗️ Project Structure

```
demo/
├── app.py                  # Main Flask application server
├── config.py              # Configuration and system prompts
├── models_handler.py      # VLLM model loading and inference
├── library_manager.py     # Digital library file management
├── requirements.txt       # Python dependencies
│
├── templates/
│   ├── base.html         # Base template with navigation
│   └── index.html        # Main application interface
│
├── static/
│   ├── css/
│   │   └── style.css     # Complete custom styling
│   ├── js/
│   │   ├── utils.js      # Utility functions and state management
│   │   ├── chat.js       # Chat interface logic
│   │   ├── library.js    # Library browsing logic
│   │   └── main.js       # Main app initialization
│   └── lib/
│       └── bootstrap-5.3.0/  # Offline Bootstrap (to be added)
│
├── models/               # Directory for VLLM models (auto-created)
└── library/              # Digital library storage (auto-created)
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 8GB+ RAM recommended (for VLLM model)
- 20GB+ disk space (for model weights)

### 2. Installation

#### Step 1: Clone/Extract Project
```bash
cd c:\Users\zorgu\Desktop\IEEE\TSYP13_Projects\Herotopia\demo
```

#### Step 2: Create Virtual Environment (Recommended)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

#### Step 4: Download Bootstrap Offline
Bootstrap needs to be added to the static/lib folder. You have two options:

**Option A: Automatic Download (requires internet)**
```powershell
$dest = "static\lib\bootstrap-5.3.0"
mkdir $dest -Force
Invoke-WebRequest -Uri "https://github.com/twbs/bootstrap/releases/download/v5.3.0/bootstrap-5.3.0-dist.zip" -OutFile "bootstrap.zip"
Expand-Archive -Path "bootstrap.zip" -DestinationPath $dest
Remove-Item "bootstrap.zip"
```

**Option B: Manual Download**
1. Go to https://github.com/twbs/bootstrap/releases/v5.3.0
2. Download `bootstrap-5.3.0-dist.zip`
3. Extract to `static/lib/bootstrap-5.3.0/`

### 3. Running the Application

```powershell
python app.py
```

The first run will download the VLLM model (~3-5GB depending on model choice). This may take 10-30 minutes.

Once ready, open your browser and navigate to:
```
http://localhost:5000
```

## 📖 Usage Guide

### Chatbot Interface

1. **Select Language**: Click the language selector (🌐) in the top navigation
   - 🇬🇧 English
   - 🇸🇦 العربية (Arabic)
   - 🇫🇷 Français (French)

2. **Ask Questions**: Type your question in the input box and press Enter or click Send

3. **Chat History**: Conversations are automatically saved to your browser's localStorage

4. **Clear History**: Use browser console: `clearChatHistory()`

### Digital Library

1. **Browse**: Click "📚 Digital Library" in the navigation
2. **Search**: Use the search box to filter files
3. **Open Files**: 
   - **Images**: View inline preview
   - **Videos**: Stream in player
   - **PDFs/Documents**: Open in new tab
   - **Other Files**: Download

4. **Add Content**: Place files/folders in the `library/` directory

### System Features

- **Auto-save**: Chat history auto-saves every 30 seconds
- **Offline Storage**: All data stored locally in browser/filesystem
- **Keyboard Shortcuts**:
  - `Ctrl+K` / `Cmd+K`: Focus chat input
  - `Enter`: Send message
  - `Shift+Enter`: New line in message
  - `Escape`: Unfocus chat input

## ⚙️ Configuration

Edit `config.py` to customize:

```python
# Model selection
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # or "Qwen/Qwen1.5-0.5B-Chat"

# Generation parameters
MAX_TOKENS = 512          # Max response length
TEMPERATURE = 0.7         # Response creativity (0.0-1.0)
TOP_P = 0.9              # Nucleus sampling parameter

# System prompts (for each language)
SYSTEM_PROMPTS = {
    "en": "...",
    "ar": "...",
    "fr": "..."
}

# Paths
MODELS_PATH = "models/"
LIBRARY_PATH = "library/"
```

## 📚 Adding Educational Content

### Directory Structure
```
library/
├── Mathematics/
│   ├── Algebra_Basics.pdf
│   └── Geometry_Guide.txt
├── Science/
│   ├── Biology_101.mp4
│   └── Chemistry_Images/
│       ├── molecules.png
│       └── atoms.jpg
└── Languages/
    └── Spanish_Lessons.pdf
```

### Supported File Types

| Type | Extensions | Icon | Preview |
|------|-----------|------|---------|
| Documents | pdf, doc, docx, txt | 📄 | Browser/Download |
| Images | jpg, jpeg, png, gif, svg | 🖼️ | Inline Preview |
| Videos | mp4, webm, avi, mkv | 🎬 | Video Player |
| Presentations | pptx, ppt | 🎓 | Download |
| Data | csv, xlsx, xls | 📊 | Download |

## 🔧 Troubleshooting

### Issue: Model fails to load
```
Solution: Ensure 8GB+ RAM and 20GB+ disk space. Try smaller model:
MODEL_NAME = "Qwen/Qwen1.5-0.5B-Chat"
```

### Issue: "Port 5000 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port in app.py:
app.run(port=5001)
```

### Issue: Bootstrap not loading
```
Ensure static/lib/bootstrap-5.3.0/ folder exists with:
- css/bootstrap.min.css
- js/bootstrap.bundle.min.js
```

### Issue: Model download interrupted
```
Delete incomplete downloads:
rm -r ~/.cache/huggingface/
Then restart app.py
```

## 🎨 Customization

### Modify System Prompt
Edit `config.py` `SYSTEM_PROMPTS`:
```python
SYSTEM_PROMPTS = {
    "en": "Your custom prompt here...",
    "ar": "مرحبا، أنا مساعد تعليمي...",
    "fr": "Bonjour, je suis un assistant éducatif..."
}
```

### Change UI Colors
Edit `static/css/style.css`:
```css
:root {
    --primary-color: #0d6efd;      /* Change this */
    --dark-color: #212529;
    --light-color: #f8f9fa;
}
```

### Add More Languages
1. Add language code to `SYSTEM_PROMPTS` in `config.py`
2. Add to language selector in `templates/base.html`
3. Add to `SUPPORTED_LANGUAGES` in `app.py`

## 📊 Model Options

| Model | Size | Speed | Quality | RAM Needed |
|-------|------|-------|---------|-----------|
| TinyLlama 1.1B | 0.5GB | ⚡⚡⚡ | ⭐⭐ | 4GB |
| Qwen 1.5B 0.5B | 0.3GB | ⚡⚡⚡⚡ | ⭐ | 2GB |
| Qwen 1.5B 1B | 0.6GB | ⚡⚡⚡ | ⭐⭐ | 4GB |
| Llama 2 7B | 3.5GB | ⚡⚡ | ⭐⭐⭐⭐ | 16GB |

**Recommended for students**: TinyLlama 1.1B (balanced speed/quality)

## 🔒 Privacy & Security

- ✅ No cloud connectivity required
- ✅ All models run locally
- ✅ Chat history stored in browser only
- ✅ No data collection or telemetry
- ✅ No external API calls
- ⚠️ Clear browser cache to delete saved conversations

## 📝 API Reference

### Chat Endpoint
```
POST /chat
Content-Type: application/json

Request:
{
    "message": "user question",
    "language": "en|ar|fr",
    "history": [previous messages]
}

Response:
{
    "success": true,
    "response": "generated answer",
    "language": "en"
}
```

### Library Endpoint
```
GET /library

Response:
{
    "success": true,
    "items": [
        {
            "name": "filename",
            "type": "file|folder",
            "icon": "📄",
            "path": "relative/path",
            "size": 12345,
            "category": "Documents"
        }
    ]
}
```

### File Serving
```
GET /library/<path:filepath>

Returns the file with appropriate MIME type
```

## 🤝 Contributing

To extend Herotopia:

1. **Add new languages**: Update `config.py` system prompts
2. **Add file types**: Update `library_manager.py` `FILE_TYPES`
3. **Customize UI**: Modify `templates/` and `static/css/`
4. **Extend features**: Create new routes in `app.py`

## 📄 License

This project is provided as-is for educational purposes.

## 🆘 Support

For issues:
1. Check troubleshooting section above
2. Review console errors (F12 → Console)
3. Check Flask terminal output for backend errors
4. Ensure all files are in correct directories

## 📞 Credits

- **Framework**: Flask
- **AI Model**: VLLM (Large Language Models)
- **UI**: Bootstrap 5
- **Educational Focus**: Designed for student learning

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✓
