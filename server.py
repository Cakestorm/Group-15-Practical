from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import os

hostName = "localhost"
serverPort = 8080

webpage_file = "./basic-webpage.html"

def is_module(path):
    if not path.startswith("/modules/"): return False
    if not path.endswith(".js"): return False
    if len(path.split("/")) > 3: return False
    if ";" in path: return False
    return True

def get_local_module_list():
    return ";".join([a for a in os.listdir("./modules/") if a.endswith(".js")])

class RequestHandler(BaseHTTPRequestHandler):  
    
    def do_GET(self):
        # TODO: Parse self.path to open select notes if they are available.
        print(self.path)
        if self.path in ["/module_handler.js"] or is_module(self.path):
            file_to_open = open(self.path[1:]).read() # Currently crashes horrible if certain characters (primarily space) are included because of html encoding nonsense
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript')
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
        elif self.path == "/module_list":
            # Obtain list of modules
            data = get_local_module_list()
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript') # todo: set correct content type here
            self.end_headers()
            self.wfile.write(bytes(data, 'utf-8'))
            print(data)
        else:
            file_to_open = open(webpage_file).read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))

def main():
    webServer = HTTPServer((hostName, serverPort), RequestHandler)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")

if __name__ == "__main__":
    main()
