"""
Library Manager Module
Handles browsing and serving files from the digital library
"""

import os
import mimetypes
from pathlib import Path
from typing import List, Dict, Optional


class LibraryManager:
    """
    Manages the digital library
    Browses files, organizes by type, and provides safe file serving
    """
    
    # File type mappings for icons and categories
    FILE_TYPES = {
        'pdf': {'icon': '📄', 'category': 'Documents', 'mime': 'application/pdf'},
        'doc': {'icon': '📝', 'category': 'Documents', 'mime': 'application/msword'},
        'docx': {'icon': '📝', 'category': 'Documents', 'mime': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
        'txt': {'icon': '📄', 'category': 'Documents', 'mime': 'text/plain'},
        'mp4': {'icon': '🎬', 'category': 'Videos', 'mime': 'video/mp4'},
        'webm': {'icon': '🎬', 'category': 'Videos', 'mime': 'video/webm'},
        'mkv': {'icon': '🎬', 'category': 'Videos', 'mime': 'video/x-matroska'},
        'avi': {'icon': '🎬', 'category': 'Videos', 'mime': 'video/x-msvideo'},
        'jpg': {'icon': '🖼️', 'category': 'Images', 'mime': 'image/jpeg'},
        'jpeg': {'icon': '🖼️', 'category': 'Images', 'mime': 'image/jpeg'},
        'png': {'icon': '🖼️', 'category': 'Images', 'mime': 'image/png'},
        'gif': {'icon': '🖼️', 'category': 'Images', 'mime': 'image/gif'},
        'svg': {'icon': '🖼️', 'category': 'Images', 'mime': 'image/svg+xml'},
        'pptx': {'icon': '🎓', 'category': 'Presentations', 'mime': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
        'ppt': {'icon': '🎓', 'category': 'Presentations', 'mime': 'application/vnd.ms-powerpoint'},
        'csv': {'icon': '📊', 'category': 'Data', 'mime': 'text/csv'},
        'xlsx': {'icon': '📊', 'category': 'Data', 'mime': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
        'xls': {'icon': '📊', 'category': 'Data', 'mime': 'application/vnd.ms-excel'},
    }
    
    def __init__(self, library_path: Path):
        """
        Initialize the library manager
        
        Args:
            library_path: Path to the library folder
        """
        self.library_path = Path(library_path)
        
        # Ensure library path exists
        self.library_path.mkdir(parents=True, exist_ok=True)
    
    def get_file_type_info(self, filename: str) -> Dict:
        """
        Get file type information (icon, category, mime type)
        
        Args:
            filename: Name of the file
        
        Returns:
            Dictionary with file type information
        """
        ext = Path(filename).suffix.lower().lstrip('.')
        
        if ext in self.FILE_TYPES:
            return self.FILE_TYPES[ext]
        
        # Default for unknown types
        return {
            'icon': '📦',
            'category': 'Other',
            'mime': mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        }
    
    def get_library_structure(self, relative_path: str = "") -> List[Dict]:
        """
        Get recursive structure of library contents
        
        Args:
            relative_path: Relative path within library (for recursion)
        
        Returns:
            List of items (files and folders) with metadata
        """
        items = []
        
        current_path = self.library_path
        if relative_path:
            current_path = current_path / relative_path
        
        try:
            if not current_path.exists():
                return items
            
            # Get all items and sort them
            all_items = sorted(current_path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
            
            for item in all_items:
                # Skip hidden files
                if item.name.startswith('.'):
                    continue
                
                if item.is_dir():
                    # It's a folder
                    items.append({
                        'name': item.name,
                        'type': 'folder',
                        'icon': '📁',
                        'path': str(Path(relative_path) / item.name),
                        'children': self.get_library_structure(str(Path(relative_path) / item.name))
                    })
                
                else:
                    # It's a file
                    file_info = self.get_file_type_info(item.name)
                    file_path = str(Path(relative_path) / item.name)
                    
                    items.append({
                        'name': item.name,
                        'type': 'file',
                        'icon': file_info['icon'],
                        'category': file_info['category'],
                        'path': file_path,
                        'size': item.stat().st_size,
                        'size_human': self._format_size(item.stat().st_size)
                    })
        
        except Exception as e:
            print(f"Error scanning library: {str(e)}")
        
        return items
    
    def get_safe_path(self, filepath: str) -> Optional[Path]:
        """
        Get a safe absolute path within the library
        Prevents directory traversal attacks
        
        Args:
            filepath: Relative path from library root
        
        Returns:
            Safe absolute path if valid, None otherwise
        """
        try:
            # Normalize and resolve the path
            requested_path = (self.library_path / filepath).resolve()
            library_root = self.library_path.resolve()
            
            # Check if the requested path is within the library
            requested_path.relative_to(library_root)
            
            return requested_path if requested_path.exists() else None
        
        except (ValueError, OSError):
            # Path is outside library or invalid
            return None
    
    @staticmethod
    def _format_size(size_bytes: int) -> str:
        """
        Format file size to human-readable format
        
        Args:
            size_bytes: Size in bytes
        
        Returns:
            Formatted size string
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        
        return f"{size_bytes:.1f} TB"
    
    def create_sample_library(self):
        """
        Create sample library structure for testing
        This creates placeholder files to demonstrate the library structure
        """
        # Create sample directories
        sample_dirs = [
            'Mathematics',
            'Science',
            'History',
            'Languages',
            'Technology'
        ]
        
        for dir_name in sample_dirs:
            dir_path = self.library_path / dir_name
            dir_path.mkdir(exist_ok=True)
            
            # Create sample text files in each directory
            for i in range(2):
                sample_file = dir_path / f"Sample_{i+1}.txt"
                sample_file.write_text(f"Sample educational material for {dir_name}\nFile {i+1}")
        
        print(f"✓ Sample library structure created at {self.library_path}")


# Example usage and testing
def test_library_manager():
    """Test function for library manager"""
    from config import Config
    
    config = Config()
    manager = LibraryManager(config.LIBRARY_PATH)
    
    # Create sample library
    manager.create_sample_library()
    
    # Get library structure
    print("\n=== Library Structure ===")
    structure = manager.get_library_structure()
    
    def print_structure(items, indent=0):
        for item in items:
            prefix = "  " * indent
            if item['type'] == 'folder':
                print(f"{prefix}{item['icon']} {item['name']}/")
                if item.get('children'):
                    print_structure(item['children'], indent + 1)
            else:
                size = item.get('size_human', 'unknown')
                print(f"{prefix}{item['icon']} {item['name']} ({size})")
    
    print_structure(structure)


if __name__ == "__main__":
    test_library_manager()
