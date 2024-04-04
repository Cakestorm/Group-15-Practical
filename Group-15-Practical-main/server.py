import os, json
from flask import Flask
from flask import request
hostName = "localhost"
serverPort = 8080

webpage_file = "./basic-webpage.html"

app = Flask(__name__)

@app.route("/")
def main():
    return open(webpage_file).read()

@app.route("/module_list")
def get_local_module_list():
    return ";".join([a for a in os.listdir("./static/modules/") if a.endswith(".js")])
    
def is_module(path):
    if not path.startswith("/modules/"): return False
    if not path.endswith(".js"): return False
    if len(path.split("/")) > 3: return False
    if ";" in path: return False
    return True

@app.route("/note_list")
def get_local_note_list():
    return ";".join([a.replace(".note","") for a in os.listdir("./stored_notes/") if a.endswith(".note")])

@app.route("/get_note/<path:name>")
def get_local_note(name):
    return open("./stored_notes/" + name + ".note").read()

@app.route("/post_note/<path:name>", methods=['POST'])
def save_local_note(name, data=""):
    posted = data
    if data == "":
        posted = request.json
    posted_string = json.dumps(posted)
    with open("./stored_notes/" + name + ".note", "w") as file:
        file.write(posted_string)
    return ('', 204)
