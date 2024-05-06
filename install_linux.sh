if python3 -m venv env; then
    source env/bin/activate
    pip install -r requirements.txt
else
    if python -m venv env; then
        source env/bin/activate
        pip install -r requirements.txt
    fi
fi
