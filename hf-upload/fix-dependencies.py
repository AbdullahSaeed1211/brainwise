#!/usr/bin/env python3
import subprocess
import sys

def install_package(package):
    print(f"Installing {package}...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"Successfully installed {package}")
    except Exception as e:
        print(f"Failed to install {package}: {str(e)}")

def main():
    print("Starting dependency fix script...")
    
    # Install python-multipart first as it's critical
    install_package("python-multipart>=0.0.6")
    
    # Install other dependencies if needed
    install_package("fastapi>=0.104.0")
    install_package("uvicorn>=0.23.2")
    
    print("Dependency fix completed")
    print("Restart the Space to apply changes")

if __name__ == "__main__":
    main() 