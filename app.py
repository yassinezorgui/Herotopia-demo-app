"""
Herotopia Educational Chatbot with Digital Library
Main Flask application server
Uses VLLM for local language model inference
"""

import os
import json
import mimetypes
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from flask_cors import CORS

# Import local modules
from config import Config
from models_handler import ModelHandler
from library_manager import LibraryManager

# Initialize Flask app
app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')
CORS(app)

# Load configuration
config = Config()

# Initialize model handler (loads VLLM model)
try:
    model_handler = ModelHandler(config)
    print(f"✓ Model loaded: {config.MODEL_NAME}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model_handler = None

# Initialize library manager
library_manager = LibraryManager(config.LIBRARY_PATH)

# Language codes
SUPPORTED_LANGUAGES = ["en", "ar", "fr"]
DEFAULT_LANGUAGE = "en"


@app.route('/')
def index():
    """
    Main page - serves the chatbot and library interface
    """
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    """
    Chat endpoint - receives user message and returns VLLM response
    
    Expected JSON payload:
    {
        "message": "user message",
        "language": "en|ar|fr",
        "history": [list of previous messages for context]
    }
    
    Returns:
    {
        "response": "generated response",
        "language": "language used",
        "success": true/false,
        "error": "error message if failed"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'message' in request"
            }), 400
        
        user_message = data.get('message', '').strip()
        language = data.get('language', DEFAULT_LANGUAGE)
        chat_history = data.get('history', [])
        
        # Validate language
        if language not in SUPPORTED_LANGUAGES:
            language = DEFAULT_LANGUAGE
        
        # Check if message is empty
        if not user_message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty"
            }), 400
        
        # Check if model is loaded
        if not model_handler:
            return jsonify({
                "success": False,
                "error": "Model not loaded. Please check your setup."
            }), 503
        
        # Generate response using VLLM
        response = model_handler.generate_response(
            message=user_message,
            language=language,
            chat_history=chat_history
        )
        
        return jsonify({
            "success": True,
            "response": response,
            "language": language
        })
    
    except Exception as e:
        print(f"Error in /chat: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@app.route('/library')
def library():
    """
    Digital Library endpoint - returns list of files and folders
    
    Returns:
    {
        "success": true/false,
        "items": [list of library items with metadata],
        "error": "error message if failed"
    }
    """
    try:
        items = library_manager.get_library_structure()
        return jsonify({
            "success": True,
            "items": items
        })
    except Exception as e:
        print(f"Error in /library: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@app.route('/library/<path:filepath>', methods=['GET'])
def serve_library_file(filepath):
    """
    Serve files from the library
    
    Args:
        filepath: Path to the file within the library folder
    
    Returns:
        The file if it exists and is safe to serve
    """
    try:
        # Sanitize and validate filepath
        safe_path = library_manager.get_safe_path(filepath)
        
        if not safe_path or not safe_path.exists():
            return jsonify({
                "success": False,
                "error": "File not found"
            }), 404
        
        if not safe_path.is_file():
            return jsonify({
                "success": False,
                "error": "Invalid file path"
            }), 400
        
        # Serve the file
        return send_file(
            safe_path,
            as_attachment=False,
            mimetype=mimetypes.guess_type(str(safe_path))[0]
        )
    
    except Exception as e:
        print(f"Error serving file: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, Bootstrap library)"""
    return send_from_directory(app.static_folder, filename)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Herotopia Educational Chatbot with Digital Library")
    print("=" * 60)
    print(f"Model: {config.MODEL_NAME}")
    print(f"Library Path: {config.LIBRARY_PATH}")
    print(f"Supported Languages: {', '.join(SUPPORTED_LANGUAGES)}")
    print("=" * 60)
    print("Starting server on http://localhost:5000")
    print("=" * 60)
    
    # Run Flask development server
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True,
        use_reloader=True
    )
