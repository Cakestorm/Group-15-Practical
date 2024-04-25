import os, json
from flask import Flask
from flask import request
from static.backend_py.embeddings import get_linked_notes

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
    if "/" in name:
        return ('', 403) # 403 forbidden. SHould never ever have a / in a note name anyways, but if this is sent then something *really* bad is going on and we don't allow it.
    posted = data
    if data == "":
        posted = request.json
    posted_string = json.dumps(posted)
    with open("./stored_notes/" + name + ".note", "w") as file:
        file.write(posted_string)
    return ('', 204)

@app.route("/delete_note/<path:name>")
def delete_local_note(name):
    #TODO: SO MANY SECURITY CHECKS
    if "/" in name:
        return ('', 403) # 403 forbidden. SHould never ever have a / in a note name anyways, but if this is sent then something *really* bad is going on and we don't allow it.
    if os.path.isfile("./stored_notes/" + name + ".note"):
        os.remove("./stored_notes/" + name + ".note")
        return ('', 204)
    else:
        return ('', 400)

@app.route("/edit_note/<path:name>")
def edit_local_note(name):
    return open("./quill_default.html").read()
    
@app.route("/get_config")
def get_server_config():
    return open("./server_config.json").read()

@app.route("/get_links")
def get_links():
    # Example: Given Article 1, find the top 10 most relevant notes among Article 2-300 to link.
    current_pth = "stored_notes/wos_notes/Article 1.note"
    pth_list = ["stored_notes/wos_notes/Article {}.note".format(str(i)) for i in range(2,300)]
    top_mathces = get_linked_notes(current_pth=current_pth,
                              pth_list=pth_list, topn = 10)
    return top_mathces