from static.backend_py.document import Document
from static.backend_py.process_text import process_text
import math

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
        return math.log10(len(self.documents) / (self.document_frequency(token)+1))
    
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
        if not results:
            return []
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