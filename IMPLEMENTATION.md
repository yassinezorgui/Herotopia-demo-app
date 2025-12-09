# Herotopia - Complete Implementation Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [System Architecture](#system-architecture)
4. [Feature Details](#feature-details)
5. [Installation Steps](#installation-steps)
6. [Configuration](#configuration)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Herotopia** is a complete, production-ready educational platform that combines:

- **AI-Powered Chatbot**: Using VLLM for local, offline language model inference
- **Digital Library**: File browser and document management system
- **Multi-Language Support**: English, Arabic, French
- **Privacy-First Design**: 100% offline, no data collection
- **Educational Focus**: System prompts optimized for student learning

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Flask (Python web framework) |
| **AI Model** | VLLM (Large Language Model inference) |
| **Frontend** | Bootstrap 5, HTML5, JavaScript (no CDN) |
| **Storage** | Local filesystem + Browser localStorage |
| **Hosting** | Localhost (127.0.0.1:5000) |

---

## File Structure

```
demo/
│
├── 📄 Core Application Files
│   ├── app.py                 # Main Flask server (routes, endpoints)
│   ├── config.py              # Configuration, system prompts, paths
│   ├── models_handler.py      # VLLM model management
│   ├── library_manager.py     # File system operations for library
│   └── setup.py               # Initialization and setup script
│
├── 📁 templates/              # HTML templates
│   ├── base.html             # Base layout with navigation
│   └── index.html            # Main application page
│
├── 📁 static/                 # Static assets
│   ├── css/
│   │   └── style.css         # Complete custom styling (no framework CSS needed)
│   ├── js/
│   │   ├── utils.js          # Global utilities, state management
│   │   ├── chat.js           # Chat interaction logic
│   │   ├── library.js        # Library browsing logic
│   │   └── main.js           # App initialization and coordination
│   └── lib/
│       └── bootstrap-5.3.0/  # Offline Bootstrap library
│           ├── css/
│           └── js/
│
├── 📁 models/                 # VLLM model storage (auto-created)
│   └── model/                # Downloaded model weights
│
├── 📁 library/                # User content directory (auto-created)
│   ├── Mathematics/
│   ├── Science/
│   ├── History/
│   └── ... (user defined)
│
├── 📋 Configuration Files
│   ├── requirements.txt        # Python dependencies (with VLLM)
│   ├── requirements-minimal.txt # Minimal dependencies (no VLLM)
│   ├── .gitignore            # Git ignore patterns
│   └── README.md             # User documentation
│
├── 🚀 Startup Scripts
│   ├── start.bat             # Windows batch startup
│   ├── start.ps1             # PowerShell startup
│   └── app.py                # Direct Python execution
│
└── 📚 Documentation
    └── IMPLEMENTATION.md     # This file

```

---

## System Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  (HTML Templates + Bootstrap + JavaScript)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓ (HTTP Requests/Responses)
┌─────────────────────────────────────────────────────────────┐
│               Flask Web Server (app.py)                     │
│                                                             │
│  Routes:                                                   │
│  • GET /                    → Serve main page             │
│  • POST /chat               → Process chat messages       │
│  • GET /library             → List library contents       │
│  • GET /library/<path>      → Serve files                 │
│  • GET /static/<path>       → Serve CSS/JS               │
└────────┬──────────────────────────────────────────────────┘
         │
         ├─→ 📝 Config Module (config.py)
         │   • System prompts (EN, AR, FR)
         │   • Model settings
         │   • Path management
         │
         ├─→ 🤖 Model Handler (models_handler.py)
         │   • VLLM initialization
         │   • Model inference
         │   • Response generation
         │
         └─→ 📚 Library Manager (library_manager.py)
             • Directory scanning
             • File type detection
             • Safe path handling

```

### Chat Flow

```
User Input
   ↓
[JavaScript - chat.js]
   ├─ Validate message
   ├─ Add to UI
   └─ Send to server
      ↓
[Flask - app.py:/chat]
   ├─ Receive JSON request
   ├─ Validate language
   └─ Call model handler
      ↓
[Model Handler - models_handler.py]
   ├─ Format prompt with system message
   ├─ Include chat history
   ├─ Call VLLM inference
   └─ Return generated response
      ↓
[Flask - Send response]
   └─ Return JSON with response
      ↓
[JavaScript - chat.js]
   ├─ Receive response
   ├─ Add to chat UI
   ├─ Save to history
   └─ Scroll to bottom
```

### Language Support Flow

```
Language Selection (navbar)
   ↓
[JavaScript - utils.js:setLanguage()]
   ├─ Update localStorage
   ├─ Set document lang attribute
   ├─ Update RTL for Arabic
   ├─ Update UI labels
   └─ Pass to chat requests
      ↓
[Flask - Receives language code]
   └─ Select system prompt from config.py
      ↓
[VLLM - Generates response]
   └─ Response follows language system prompt
```

---

## Feature Details

### 1. Chatbot System

#### System Prompts by Language

The system prompts define the AI's behavior:

```python
# English
"You are an educational assistant designed to help students..."

# Arabic (العربية)
"أنت مساعد تعليمي مصمم لمساعدة الطلاب..."

# French (Français)
"Vous êtes un assistant éducatif conçu pour aider les étudiants..."
```

#### Key Features

- **Context Awareness**: Last 5 messages kept as context
- **Safety Guards**: System prompt enforces educational topics only
- **Language Enforcement**: Responds in selected language
- **Clear Explanations**: Prompt encourages simple, understandable language

#### Response Generation

```python
# In models_handler.py
def generate_response(message, language, chat_history):
    # 1. Format prompt with system message
    prompt = format_prompt(message, language, chat_history)
    
    # 2. Call VLLM with parameters
    outputs = model.generate(
        prompt,
        max_tokens=512,
        temperature=0.7,  # Balanced creativity
        top_p=0.9         # Nucleus sampling
    )
    
    # 3. Extract and return response
    return outputs[0].outputs[0].text
```

### 2. Digital Library

#### File Type Support

| Type | Extensions | Preview | Icon |
|------|-----------|---------|------|
| Documents | pdf, doc, docx, txt | Browser/Download | 📄 |
| Images | jpg, png, gif, svg | Modal Preview | 🖼️ |
| Videos | mp4, webm, avi, mkv | HTML5 Player | 🎬 |
| Presentations | pptx, ppt | Download | 🎓 |
| Data | csv, xlsx, xls | Download | 📊 |

#### Directory Scanning

```python
# In library_manager.py
def get_library_structure():
    items = []
    for item in library_path.iterdir():
        if item.is_dir():
            items.append({
                'name': item.name,
                'type': 'folder',
                'children': get_library_structure(item)
            })
        else:
            items.append({
                'name': item.name,
                'type': 'file',
                'category': get_category(item.suffix),
                'size': item.stat().st_size
            })
    return items
```

### 3. Multi-Language Support

#### Implementation

1. **Selection UI**: Language dropdown in navbar
2. **Storage**: localStorage persists choice
3. **Document Settings**: `html[lang]` and `body[dir]` for RTL
4. **System Prompts**: Each language has custom system prompt
5. **Responses**: AI generates in selected language

#### RTL Support for Arabic

```javascript
if (language === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.dir = 'rtl';
    // CSS automatically adjusts for RTL
} else {
    document.documentElement.dir = 'ltr';
}
```

---

## Installation Steps

### Method 1: Automated Setup (Recommended)

#### Windows (Batch File)
```batch
double-click start.bat
```

#### Windows (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

#### Manual (Any OS)
```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run setup
python setup.py

# 4. Start application
python app.py
```

### Method 2: Step-by-Step

#### Step 1: Check Python
```powershell
python --version  # Must be 3.8+
pip --version
```

#### Step 2: Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Step 3: Install Dependencies
```powershell
# Full installation (with VLLM)
pip install -r requirements.txt

# Lightweight installation (for testing)
pip install -r requirements-minimal.txt
```

#### Step 4: Download Bootstrap
```powershell
python setup.py  # Auto-downloads Bootstrap

# OR manually:
# 1. Download from https://github.com/twbs/bootstrap/releases/v5.3.0
# 2. Extract to: static/lib/bootstrap-5.3.0/
```

#### Step 5: Create Library Structure
```powershell
python setup.py  # Creates sample directories
```

#### Step 6: Run Application
```powershell
python app.py
```

#### Step 7: Open Browser
```
http://localhost:5000
```

---

## Configuration

### Main Configuration (config.py)

```python
# Model Selection
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
# Alternatives:
# - "Qwen/Qwen1.5-0.5B-Chat"        (smallest, fastest)
# - "Qwen/Qwen1.5-1B-Chat"          (medium)
# - "mistralai/Mistral-7B-Instruct" (larger, higher quality)

# Generation Parameters
MAX_TOKENS = 512              # Max response length
TEMPERATURE = 0.7             # 0.0=deterministic, 1.0=random
TOP_P = 0.9                  # Nucleus sampling

# System Prompts
SYSTEM_PROMPTS = {
    "en": "...",  # English instructions
    "ar": "...",  # Arabic instructions
    "fr": "..."   # French instructions
}

# Paths
MODELS_PATH = "models/"        # Where models are stored
LIBRARY_PATH = "library/"      # Digital library location
```

### Customizing System Prompts

Edit `config.py` to change AI behavior:

```python
SYSTEM_PROMPTS = {
    "en": """You are an expert tutor specializing in mathematics.
    Your role is to:
    - Explain concepts clearly
    - Provide step-by-step solutions
    - Encourage critical thinking
    ..."""
}
```

### Adding Languages

1. Add to `SYSTEM_PROMPTS` in `config.py`:
```python
SYSTEM_PROMPTS = {
    "en": "...",
    "es": "Eres un asistente educativo..."  # Spanish
}
```

2. Update UI in `templates/base.html`:
```html
<a class="dropdown-item" onclick="setLanguage('es')">🇪🇸 Español</a>
```

3. Add to `SUPPORTED_LANGUAGES` in `app.py`:
```python
SUPPORTED_LANGUAGES = ["en", "ar", "fr", "es"]
```

---

## Deployment

### Local Testing

```powershell
python app.py
# Access at http://localhost:5000
```

### Production Considerations

#### Using Gunicorn (Production Server)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Docker Support (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t herotopia .
docker run -p 5000:5000 herotopia
```

---

## Troubleshooting

### Common Issues

#### 1. "Port 5000 already in use"

```powershell
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID 12345 /F

# OR change port in app.py
app.run(port=5001)
```

#### 2. "Module not found: vllm"

```powershell
# Install VLLM
pip install vllm torch transformers

# OR use minimal version
pip install -r requirements-minimal.txt
```

#### 3. "Bootstrap not loading"

```powershell
# Verify Bootstrap exists
dir static\lib\bootstrap-5.3.0\css\bootstrap.min.css

# If missing, run setup
python setup.py
```

#### 4. "Model download fails"

```powershell
# Check internet connection
# Check disk space (20GB+ needed)
# Check RAM (8GB+ recommended)

# Clear cache and retry
rmdir /s /q %USERPROFILE%\.cache\huggingface\
python app.py
```

#### 5. "Chat responses are slow"

```python
# In config.py, use smaller model:
MODEL_NAME = "Qwen/Qwen1.5-0.5B-Chat"

# Reduce token length:
MAX_TOKENS = 256
```

#### 6. "Out of Memory (OOM)"

```python
# Use smaller model in config.py
MODEL_NAME = "Qwen/Qwen1.5-0.5B-Chat"

# OR reduce batch size
# Add tensor parallelism in models_handler.py
```

### Debug Mode

Enable Flask debug logging:

```python
# In app.py
app.run(
    debug=True,        # Enable debug mode
    use_reloader=True  # Auto-reload on changes
)
```

Check logs in terminal for errors.

---

## Performance Optimization

### Model Selection by Hardware

| Hardware | Recommended Model | Speed | Quality |
|----------|------------------|-------|---------|
| 4GB RAM | Qwen 0.5B | ⚡⚡⚡⚡ | ⭐ |
| 8GB RAM | TinyLlama 1.1B | ⚡⚡⚡ | ⭐⭐ |
| 16GB RAM | Qwen 1B | ⚡⚡ | ⭐⭐⭐ |
| 32GB RAM | Llama2 7B | ⚡ | ⭐⭐⭐⭐ |

### Response Optimization

```python
# In config.py
# Faster but less detailed
TEMPERATURE = 0.3
MAX_TOKENS = 256

# Better quality but slower
TEMPERATURE = 0.7
MAX_TOKENS = 512
```

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Good support |
| Safari | ✅ Full | iOS supported |
| Edge | ✅ Full | Chromium-based |
| IE 11 | ❌ No | Too old, use modern browser |

---

## File Upload (Optional Enhancement)

To add file upload capability:

```python
# Add to app.py
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return jsonify({'success': True})
```

---

## Security Considerations

1. **Input Validation**: All user inputs sanitized
2. **Path Traversal Prevention**: Library manager prevents `../` attacks
3. **MIME Type Checking**: Files served with correct types
4. **No Remote Code Execution**: Models run in sandboxed environment
5. **CORS Configured**: Only allows same-origin requests

---

## Maintenance

### Regular Tasks

- **Clear cache**: `rm -r ~/.cache/huggingface/`
- **Update models**: Re-download latest versions
- **Back up library**: Archive `library/` folder
- **Review logs**: Check terminal output for errors

### Updates

To update dependencies:
```bash
pip install --upgrade -r requirements.txt
```

---

## Support & Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **VLLM GitHub**: https://github.com/vllm-project/vllm
- **Bootstrap 5**: https://getbootstrap.com/docs/5.3/
- **Hugging Face Models**: https://huggingface.co/models

---

## Version Information

- **Herotopia Version**: 1.0.0
- **Python**: 3.8+
- **Flask**: 2.3.2
- **VLLM**: 0.2.7
- **Bootstrap**: 5.3.0
- **Last Updated**: December 2024

---

**🎓 Ready to revolutionize education with Herotopia!**
