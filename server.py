import os, json
from flask import Flask
from flask import request
hostName = "localhost"
serverPort = 8080

webpage_file = "./index.html"

app = Flask(__name__)

@app.route("/")
def main():
    return open(webpage_file).read()

@app.route("/module_list")
def get_local_module_list():
    return json.dumps([a for a in os.listdir("./static/modules/") if a.endswith(".js")])
    
def is_module(path):
    if not path.startswith("/modules/"): return False
    if not path.endswith(".js"): return False
    if len(path.split("/")) > 3: return False
    if ";" in path: return False
    return True

@app.route("/note_list")
def get_local_note_list():
    return json.dumps([get_id_name_pair(a.replace(".note","")) for a in os.listdir("./stored_notes/") if a.endswith(".note")])

# USE THIS FUNCTION TO COMBINE NAME AND TITLE
def get_id_name_pair(note_id):
    note_data = json.loads(open("./stored_notes/" + note_id + ".note").read())
    if "title" in note_data.keys():
        note_name = note_data["title"]
    else:
        note_name = note_id
    return {
        "id":note_id,
        "name":note_name
    }

@app.route("/get_note/<path:name>")
def get_local_note(name):
    return open("./stored_notes/" + name + ".note").read()

@app.route("/post_note/<path:name>", methods=['POST'])
def save_local_note(name, data=""):
    if "/" in name:
        return ('', 403) # 403 forbidden. Should never ever have a / in a note name anyways, but if this is sent then something *really* bad is going on and we don't allow it.
    posted = data
    if data == "":
        posted = request.json
    posted_string = json.dumps(posted)
    with open("./stored_notes/" + name + ".note", "w") as file:
        file.write(posted_string)
    return ('', 204)

@app.route("/delete_note/<path:name>", methods=['POST'])
def delete_local_note(name):
    # TODO: SO MANY SECURITY CHECKS
    if "/" in name:
        return ('', 403) # 403 forbidden. Should never ever have a / in a note name anyways, but if this is sent then something *really* bad is going on and we don't allow it.
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

@app.route("/search")
def search_notes():
    # Backend full plain text search
    #search_text = request.args.get("q", "")
    #topn = int(request.args.get("n", 10))
    # implementation
    return "To be determined"

@app.route("/get_links")
def get_links():
    # Backend function to extract linked notes based on semantic similarity
    # Implementation
    return "To be determined"
