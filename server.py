import os
from flask import Flask
hostName = "localhost"
serverPort = 8080

webpage_file = "./basic-webpage.html"

app = Flask(__name__)

@app.route("/")
def main():
    return open(webpage_file).read()

@app.route("/module_list")
def get_local_module_list():
    print("MODULES")
    return ";".join([a for a in os.listdir("./static/modules/") if a.endswith(".js")])
    
def is_module(path):
    if not path.startswith("/modules/"): return False
    if not path.endswith(".js"): return False
    if len(path.split("/")) > 3: return False
    if ";" in path: return False
    return True
