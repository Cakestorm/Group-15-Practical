import json
from os import listdir
from os.path import isfile, join
import numpy as np
from static.backend_py.search import search_notes, load_documents, is_note_file
from static.backend_py.document import Document
try:
    import gensim
    from gensim.models.doc2vec import Doc2Vec
    gensim_available = True
except:
    gensim_available = False
    print("Warning: unable to load gensim module. Note linking functionality switched to traditional TF-IDF search.")
from sklearn.metrics.pairwise import cosine_similarity

# content has to be a parsed dictionary
def get_document_embeddings(document: Document):
    body = document.get_body()
    if body == "":
        return "[Empty Body]", np.array([]), True
    
    body = gensim.utils.simple_preprocess(body)
    embedding = document.get_embeddings()
    if embedding == None:
        model = Doc2Vec.load("static/backend_py/Trained_Embedding_Model")
        embedding = model.infer_vector(body)
        emb_exist = False
    else:
        embedding = np.array(embedding).astype(dtype=np.float32)
        emb_exist = True
        
    return body, embedding, emb_exist

def save_embeddings(path, embeddings):
    with open(path, 'r') as f:
        content = json.loads(f.read())
        content['embeddings'] = list(embeddings.astype('str'))
    with open(path, 'w') as f:
        f.write(json.dumps(content))

# Function to extract linked notes given a given notes
#
# Params:
# @current_pth: Path.  The path to the new note that we intend to find linked notes 
# @pth_list: List[Path]. A list of the paths to all existing notes, among which
#                  relevant notes are to be searched.
# @topn: The top n number of most similar notes to be returned
#
# Return:
# top_matches: List[Dict{String, String}]. A list of dictionaries: {id, title} . 
# The list is of size at most topn. Results are sorted in descending order of similarity scores.
def get_linked_notes(current_pth = "stored_notes/Algorithms_and_Data_Structures.note",
                            pth_list=[], topn = 20):
    # default pth list: everything in the /stored_notes directory
    if pth_list == []:
        note_path = 'stored_notes/'
        list_dir = listdir(note_path)
        pth_list=[join(note_path, file) for file in list_dir if is_note_file(join(note_path, file))]
    
    # Process current document
    assert is_note_file(current_pth), current_pth+" not found or is not in valid .note format"
    
    current_doc : Document = next(load_documents([current_pth]))
    #If gensim is not available, just run search with TF-IDF with search_query as the content of current file.
    if not gensim_available:
        return search_notes(search_text=current_doc.get_body())
    else:
        this_body, this_embedding, emb_exist = get_document_embeddings(current_doc)
    
    if not emb_exist: #Save embedding for future use
        save_embeddings(current_pth, this_embedding)
        
    # Process existing documents list
    doc_list = load_documents(pth_list)
    embedding_list = []
    valid_doc_list = []
    for doc in doc_list:
        that_body, that_embedding, emb_exist = get_document_embeddings(doc)
        if len(that_embedding) > 0:
            valid_doc_list.append(doc)
            embedding_list.append(that_embedding)
        if not emb_exist: #Save embedding for future use
            save_embeddings(doc.get_path(), that_embedding)

    # Compare similarity
    assert len(embedding_list) > 0, "No existing documents to be linked."
    similarity_scores = cosine_similarity([this_embedding], embedding_list)[0]
    top_matches_indices = np.argsort(similarity_scores)[-topn:][::-1]
    top_matches = [{'id':valid_doc_list[i].get_note_id(), 'title':valid_doc_list[i].get_title()} 
                   for i in top_matches_indices]
    
    return top_matches

#pth_list = ["stored_notes/Article {}.note".format(str(i)) for i in range(2,300)]
#print(get_linked_notes(pth_list=[]))