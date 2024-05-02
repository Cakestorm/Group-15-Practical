from collections import Counter
from static.backend_py.process_text import process_text

class Document:
    def __init__(self, ID=0, body="", path="", title="", note_id="", embeddings=None):
        self.ID = ID
        self.body = title + " " + body
        self.path = path
        self.title = title
        self.note_id = note_id
        self.embeddings = embeddings
        # Counter will create a dictionary counting the unique values in an array:
        # {'london': 12, 'beer': 3, ...}
        self.term_frequencies = Counter(process_text(body))
        
    def get_ID(self):
        return self.ID
    
    def get_body(self):
        return self.body
    
    def get_path(self):
        return self.path
    
    def get_title(self):
        return self.title
    
    def get_note_id(self):
        return self.note_id
    
    def get_embeddings(self):
        return self.embeddings
    
    def get_term_frequency(self, term):
        return self.term_frequencies.get(term, 0)