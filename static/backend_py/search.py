import os
import json
from collections import Counter
import math
import gensim  #To be replaced

class Document:
    def __init__(self, ID=0, body="", path=""):
        self.ID = ID
        self.body = body
        self.path = path
        # Counter will create a dictionary counting the unique values in an array:
        # {'london': 12, 'beer': 3, ...}
        self.term_frequencies = Counter(process_text(body))
        
    def get_ID(self):
        return self.ID
    
    def get_body(self):
        return self.body
    
    def get_path(self):
        return self.path
    
    def get_term_frequency(self, term):
        return self.term_frequencies.get(term, 0)

class Index:
    def __init__(self):
        self.index = {} # token : set(ID)
        self.documents = {} # ID : Document

    def index_document(self, document:Document):
        if document.get_ID() not in self.documents:
            self.documents[document.ID] = document

        for token in process_text(document.get_body()):
            if token not in self.index:
                self.index[token] = set()
            self.index[token].add(document.ID)
            
    def document_frequency(self, token):
        return len(self.index.get(token, set()))
    
    def inverse_document_frequency(self, token):
        # IDF(token) = Log(N / DF), where 
        # N = total number of tokens in the index
        # DF = number of documents containing this token
        return math.log10(len(self.documents) / self.document_frequency(token))
    
    def _results(self, processed_query):
        return [self.index.get(token, set()) for token in processed_query]
    
    def search(self, query, search_type='OR', rank=True):
        """
        Boolean search; this will return documents that contain either all words
        from the query or just one of them, depending on the search_type specified.

        We are ranking the results (sets are fast, but unordered) based on TF-IDF.
        """
        if search_type not in ('AND', 'OR'):
            return []

        processed_query = process_text(query)
        results = self._results(processed_query)
        if search_type == 'AND':
            # all tokens must be in the document
            documents = [self.documents[doc_id] for doc_id in set.intersection(*results)]
        if search_type == 'OR':
            # only one token has to be in the document
            documents = [self.documents[doc_id] for doc_id in set.union(*results)]

        if rank:
            return self.rank(processed_query, documents)
        return documents
    
    def rank(self, processed_query, documents):
        results = []
        if not documents:
            return results
        for document in documents:
            score = 0.0
            for token in processed_query:
                # TF = frequency of a token within the document
                tf = document.get_term_frequency(token)
                # IDF = Inverse document frequency of a token across all documents in index
                idf = self.inverse_document_frequency(token)
                score += tf * idf    #Score = TF * IDF
            results.append((document, score))
        results.sort(key=lambda doc: doc[1], reverse=True)
        
        return [document for (document, score) in results]

def process_text(text):
    tokens = gensim.utils.simple_preprocess(text)
    return tokens

def load_documents(pth_list):
    for doc_id, path in enumerate(pth_list):
        if os.path.isfile(path):
            with open(path, 'r') as f0:
                content = json.loads(f0.read())
                body = content['body']
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
#print(search_notes(search_text = "bacterial disease", pth_list=pth_list))

#https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/#fn:4