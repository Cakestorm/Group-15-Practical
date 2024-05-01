try:
    import gensim
    gensim_available = True
except:
    gensim_available = False
try:
    import nltk # an ancient module for language processing
    from nltk.corpus import stopwords          # module for stop words that come with NLTK
    from nltk.stem import PorterStemmer        # module for stemming
    from nltk.tokenize import word_tokenize    # module for tokenizing strings
    nltk.download('stopwords',download_dir='static/backend_py')
    nltk.download('punkt',download_dir='static/backend_py')
    STOPWORDS = stopwords.words('english') 
    nltk_available = True
except:
    nltk_available = False
import re                                  # library for regular expression operations
import string                              # for string operations
PUNCTUATION = re.compile('[%s]' % re.escape(string.punctuation))

#===============================
def process_text_nltk(text):
    # Tokenize the text first
    tokens = word_tokenize(text)   
    # Lowercasing the text
    tokens = [token.lower() for token in tokens]
    # Remove punctuations
    tokens = [PUNCTUATION.sub('', token) for token in tokens]
    # Remove Stopwords
    tokens = [token for token in tokens if token not in STOPWORDS]
    # Stemming (Lemmatize) the text
    stemmer = PorterStemmer() 
    tokens = [stemmer.stem(token) for token in tokens]
    return tokens

def process_text(text):
    if gensim_available:
        tokens = gensim.utils.simple_preprocess(text)
        return tokens
    
    if nltk_available:
        return process_text_nltk(text)
    
    # If none of the langauge processing package is available, then you sucks.
    # Only use the most basic text processing.
    tokens = text.split()
    tokens = [token.lower() for token in tokens]
    tokens = [PUNCTUATION.sub('', token) for token in tokens]
    return tokens