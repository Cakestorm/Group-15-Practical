from os import listdir
from os.path import isfile, join
import json
from static.backend_py.document import Document
from static.backend_py.index import Index

def is_note_file(path):
    if not isfile(path):
        return False
    if path.split('.')[-1] != 'note':
        return False
    return True

def load_documents(pth_list):
    for doc_id, path in enumerate(pth_list):
        if is_note_file(path):
            with open(path, 'r') as f0:
                content = json.loads(f0.read())
                body = content.get('text', '')
                title = content.get('title', '')
                note_id = path.removeprefix("stored_notes/").removesuffix(".note")
                if body != '':
                    yield(Document(doc_id, body, path, title, note_id)) #Returning a List(Document)

#==========Main Function===========
# Params:
# @search_text: String. The search string.
# @pth_list: List[Path]. A list of the paths to all existing notes to search for.
# @topn: Int. The top n number of most similar notes to be returned. Default -1 means return everything.
# @search_type: 'OR' or 'AND'. Determines if we are strictly matching all tokens in the query, or just one of them.
# @rank: Boolean. Whether to sort the search results based on term frequency and relevance score.
#
# Return:
# top_matches: List[Path]. A list of paths to the searched notes of size at most topn, 
#                           as a subset of pth_list. If rank=True, the notes are sorted in the 
#                           descending order according to a relevance score, based on TF-IDF.
def search_notes(search_text = "", pth_list = [], topn = -1,
                 search_type = 'OR', rank = True):
    
     # default pth list: everything in the /stored_notes directory
    if pth_list == []:
        note_path = 'stored_notes/'
        list_dir = listdir(note_path)
        pth_list=[join(note_path, file) for file in list_dir if is_note_file(join(note_path, file))]
        
    if search_text=="":
        return pth_list
    
    doc_list = load_documents(pth_list)
    index = Index()
    for doc in doc_list:
        index.index_document(doc)
    
    documents = index.search(query=search_text, search_type=search_type, rank=rank)
    if topn > 0: #If topn = -1, then return everything. Otherwise return the top n documents
        documents = documents[:topn]
        
    top_matches = [{ 'id': doc.get_note_id(), 'title': doc.get_title()} for doc in documents]
    return top_matches

#pth_list = ["stored_notes/Article {}.note".format(str(i)) for i in range(1,300)]
#print(search_notes(search_text = "bacterial Phytoplasma disease", pth_list=pth_list, search_type='OR'))

#https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/#fn:4