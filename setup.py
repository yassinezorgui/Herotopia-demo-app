"""
Setup Script for Herotopia
Initializes the application and downloads required dependencies
Run this before first use: python setup.py
"""

import os
import sys
from pathlib import Path
import urllib.request
import zipfile
import shutil


class HerotopiaSetup:
    """Setup and initialization helper"""
    
    BASE_DIR = Path(__file__).parent
    STATIC_LIB_DIR = BASE_DIR / 'static' / 'lib'
    MODELS_DIR = BASE_DIR / 'models'
    LIBRARY_DIR = BASE_DIR / 'library'
    
    # Bootstrap version
    BOOTSTRAP_VERSION = '5.3.0'
    BOOTSTRAP_URL = f"https://github.com/twbs/bootstrap/releases/download/v{BOOTSTRAP_VERSION}/bootstrap-{BOOTSTRAP_VERSION}-dist.zip"
    BOOTSTRAP_DIR = STATIC_LIB_DIR / f"bootstrap-{BOOTSTRAP_VERSION}"
    
    @classmethod
    def create_directories(cls):
        """Create necessary directories"""
        print("📁 Creating directories...")
        
        dirs = [
            cls.STATIC_LIB_DIR,
            cls.MODELS_DIR,
            cls.LIBRARY_DIR,
        ]
        
        for dir_path in dirs:
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"  ✓ {dir_path}")
    
    @classmethod
    def download_bootstrap(cls):
        """Download and extract Bootstrap offline library"""
        print("\n📚 Setting up Bootstrap...")
        
        # Check if already downloaded
        if (cls.BOOTSTRAP_DIR / 'css' / 'bootstrap.min.css').exists():
            print(f"  ✓ Bootstrap already installed at {cls.BOOTSTRAP_DIR}")
            return True
        
        try:
            print(f"  ⏳ Downloading Bootstrap {cls.BOOTSTRAP_VERSION}...")
            print(f"     URL: {cls.BOOTSTRAP_URL}")
            
            zip_path = cls.STATIC_LIB_DIR / f"bootstrap-{cls.BOOTSTRAP_VERSION}.zip"
            
            # Download
            urllib.request.urlretrieve(cls.BOOTSTRAP_URL, zip_path)
            print("  ✓ Download complete")
            
            # Extract
            print("  ⏳ Extracting...")
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Extract to temp location first
                temp_extract = cls.STATIC_LIB_DIR / 'bootstrap-temp'
                zip_ref.extractall(temp_extract)
                
                # Move to final location
                extracted_dir = list(temp_extract.glob('bootstrap-*-dist'))[0]
                shutil.move(str(extracted_dir), str(cls.BOOTSTRAP_DIR))
                
                # Clean up temp
                shutil.rmtree(temp_extract)
            
            # Clean up zip
            zip_path.unlink()
            
            print(f"  ✓ Bootstrap installed to {cls.BOOTSTRAP_DIR}")
            return True
        
        except Exception as e:
            print(f"  ✗ Failed to download Bootstrap: {str(e)}")
            print("  ℹ️  You can manually download from:")
            print(f"     {cls.BOOTSTRAP_URL}")
            print(f"     Extract to: {cls.BOOTSTRAP_DIR}")
            return False
    
    @classmethod
    def create_sample_library(cls):
        """Create sample library structure"""
        print("\n📖 Creating sample library structure...")
        
        sample_structure = {
            'Mathematics': [
                'Algebra_Basics.txt',
                'Geometry_Guide.txt',
            ],
            'Science': [
                'Biology_101.txt',
                'Chemistry_Guide.txt',
            ],
            'History': [
                'Ancient_Civilizations.txt',
                'Modern_History.txt',
            ],
            'Languages': [
                'English_Grammar.txt',
                'French_Basics.txt',
                'Arabic_Alphabet.txt',
            ],
            'Technology': [
                'Programming_Basics.txt',
                'Web_Development.txt',
            ]
        }
        
        for category, files in sample_structure.items():
            category_dir = cls.LIBRARY_DIR / category
            category_dir.mkdir(exist_ok=True)
            
            for filename in files:
                file_path = category_dir / filename
                if not file_path.exists():
                    content = f"Educational Material: {filename}\n\n"
                    content += f"Subject: {category}\n"
                    content += f"Content type: Sample Educational Resource\n\n"
                    content += "This is a sample file. Replace with your own educational materials.\n"
                    
                    file_path.write_text(content)
                    print(f"  ✓ {category}/{filename}")
        
        print(f"  ✓ Sample library created at {cls.LIBRARY_DIR}")
    
    @classmethod
    def check_python_version(cls):
        """Check Python version"""
        print("🐍 Checking Python version...")
        
        if sys.version_info < (3, 8):
            print(f"  ✗ Python 3.8+ required, found {sys.version_info.major}.{sys.version_info.minor}")
            return False
        
        print(f"  ✓ Python {sys.version_info.major}.{sys.version_info.minor}")
        return True
    
    @classmethod
    def check_dependencies(cls):
        """Check if required packages are installed"""
        print("\n📦 Checking dependencies...")
        
        required = ['flask', 'flask_cors']
        
        missing = []
        for package in required:
            try:
                __import__(package.replace('_', '-'))
                print(f"  ✓ {package}")
            except ImportError:
                print(f"  ✗ {package} (missing)")
                missing.append(package)
        
        if missing:
            print(f"\n⚠️  Missing packages: {', '.join(missing)}")
            print("Install with: pip install -r requirements.txt")
            return False
        
        return True
    
    @classmethod
    def run(cls):
        """Run complete setup"""
        print("=" * 60)
        print("🦸 Herotopia - Setup Wizard")
        print("=" * 60)
        print()
        
        # Check Python version
        if not cls.check_python_version():
            return False
        
        # Create directories
        cls.create_directories()
        
        # Check dependencies
        if not cls.check_dependencies():
            print("\n⚠️  Please install dependencies and try again")
            return False
        
        # Download Bootstrap
        cls.download_bootstrap()
        
        # Create sample library
        cls.create_sample_library()
        
        print("\n" + "=" * 60)
        print("✅ Setup complete!")
        print("=" * 60)
        print("\n📝 Next steps:")
        print("1. Ensure Bootstrap is in: static/lib/bootstrap-5.3.0/")
        print("2. Add your content to: library/")
        print("3. Run: python app.py")
        print("4. Open: http://localhost:5000")
        print("\n💡 For more info, see README.md")
        print()
        
        return True


if __name__ == '__main__':
    success = HerotopiaSetup.run()
    sys.exit(0 if success else 1)
