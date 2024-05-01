import json
import os
from pathlib import Path
import numpy as np
try:
    import gensim
    from gensim.models.doc2vec import Doc2Vec, TaggedDocument
    gensim_available = True
except:
    gensim_available = False
from sklearn.metrics.pairwise import cosine_similarity

# content has to be a parsed dictionary
def get_document_embeddings(content={}):
    body = content.get('body', "")
    if body == "":
        return "[Empty Body]", np.array([])
    
    body = gensim.utils.simple_preprocess(body)
    embedding = content.get('embeddings', None)
    if embedding == None:
        model = Doc2Vec.load("static/backend_py/Trained_Embedding_Model")
        embedding = model.infer_vector(body)
    else:
        embedding = np.array(embedding).astype(dtype=np.float32)
        
    return body, embedding

# Function to extract linked notes given a given notes
#
# Params:
# @current_pth: Path.  The path to the new note that we intend to find linked notes 
# @pth_list: List[Path]. A list of the paths to all existing notes, among which
#                  relevant notes are to be searched.
# @topn: The top n number of most similar notes to be returned
#
# Return:
# top_matches: List[Path]. A list of paths to the linked notes, as a subset of pth_list.
def get_linked_notes(current_pth = "stored_notes/wos_notes/Article 1.note",
                            pth_list=[], topn = 10):
    # If gensim is not available, just return the entire list cuz your device sucks
    if not gensim_available:
        return pth_list
    
    # Process current document
    if not os.path.isfile(current_pth):
        return "Error: No such file."
    with open(current_pth, 'r') as f:
        content = json.loads(f.read())
        this_body, this_embedding = get_document_embeddings(content)
        
    # Process existing documents list
    #body_list = []
    embedding_list = []
    for path in pth_list:
        if os.path.isfile(path):
            with open(path, 'r') as f0:
                content = json.loads(f0.read())
                that_body, that_embedding = get_document_embeddings(content)
                #body_list.append(that_body)
                embedding_list.append(that_embedding)
        
    # Compare similarity
    if embedding_list==[]:
        return "No existing documents to be linked."
    similarity_scores = cosine_similarity([this_embedding], embedding_list)[0]
    top_matches_indices = np.argsort(similarity_scores)[-topn:][::-1]
    top_matches = [pth_list[i] for i in top_matches_indices]
    
    return top_matches


#pth_list = ["stored_notes/wos_notes/Article {}.note".format(str(i)) for i in range(2,300)]
#print(get_linked_notes(pth_list=pth_list))