source env/bin/activate
pip install -r requirements.txt
flask --app server.py run
deactivate

# INSTRUCTIONS: run our app in a python virtual environement 
# Step 0: cd to base folder of our project

# Step 1: Activate the python virtual environment, which is defined in the 'env' folder
# if you are on Linux or Mac, run the following command
source env/bin/activate
# if you are window user, run the following command on cmd.exe:
.\\venvName\\Scripts\\activate.bat

# Step 2: Install the required python dependencies in venv, if this is the first time you are opening this project
pip install -r requirements.txt

# Step 3: start the server as usual to begin project
flask --app server.py run

# Step 4: Deactivate the virtual environment when you leave the project
deactivate

# Check the following webpage if you don't know how to work with python virtual environment
# https://blog.teclado.com/python-virtual-environments-complete-guide/

