#!/usr/bin/env python3
"""
RideSense Local Development & College Expo Demo Server
Serves the web application at http://localhost:8000 with UTF-8 support.
"Smart Travel. Smarter Buses. Better Journeys."
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class RideSenseHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        content_type = super().guess_type(path)
        if content_type and ('javascript' in content_type or 'text' in content_type or 'json' in content_type):
            return f"{content_type}; charset=utf-8"
        return content_type

def main():
    os.chdir(DIRECTORY)
    handler = RideSenseHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 70)
        print(" 🚍 RIDESENSE – SMART TRAVEL. SMARTER BUSES. BETTER JOURNEYS.")
        print("=" * 70)
        print(f" Demo Server running at: {url}")
        print(f" Serving root directory: {DIRECTORY}")
        print(" Press Ctrl+C to terminate the server.")
        print("=" * 70)

        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down RideSense demo server. Goodbye!")
            httpd.shutdown()

if __name__ == "__main__":
    main()
