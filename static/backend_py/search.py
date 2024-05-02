import os
import json
from static.backend_py.document import Document
from static.backend_py.index import Index

def load_documents(pth_list):
    for doc_id, path in enumerate(pth_list):
        if os.path.isfile(path):
            with open(path, 'r') as f0:
                content = json.loads(f0.read())
                body = content['text']
                yield(Document(doc_id, body, path)) #Returning a List(Document)

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
    
    if search_text=="":
        return pth_list
    
    doc_list = load_documents(pth_list)
    index = Index()
    for doc in doc_list:
        index.index_document(doc)
    
    documents = index.search(query=search_text, search_type=search_type, rank=rank)
    if topn > 0: #If topn = -1, then return everything. Otherwise return the top n documents
        documents = documents[:topn]
        
    top_matches = [doc.get_path() for doc in documents]
    return top_matches

#pth_list = ["stored_notes/wos_notes/Article {}.note".format(str(i)) for i in range(1,300)]
#print(search_notes(search_text = "bacterial Phytoplasma disease", pth_list=pth_list, search_type='OR'))

#https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/#fn:4