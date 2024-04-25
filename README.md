# Group-15-Practical
For our group design project on the yet-to-be-named knowledge management app!

Instructions to run the app on local machines:

0. Clone or download the repository to your device. In your terminal / shell / CLI, cd to the base folder of this project.

1. **If this is the first time you are running the app, create a Python virtual environment** called `env` by using the following command in the terminal/CLI:
```
    python -m venv env
```
You can ignore this step in subsequent runs.

2. **Activate the virtual environment** using this command (on Mac or Linux):
```
    source env/bin/activate
```
If you are using Windows with WSL or Git Bash:
```
    source env/Scripts/activate
```
Or, if you're using Windows with cmd.exe or PowerShell:
```
    .\\env\\Scripts\\activate.bat
```
3. **If this is the first time you are running the app, install the required python dependencies** as stated in the `requirements.txt` file:
```
    pip install -r requirements.txt
```
You can ignore this step in subsequent runs.

4. **You can now start the app server by running**:
```
    flask --app server.py run
```
Note that this will begin the server with messages as such:

     * Serving Flask app 'server.py'
     * Debug mode: off
     * Running on http://127.0.0.1:5000
    Press CTRL+C to quit

You can now access the website at `http://127.0.0.1:5000` in your browser.

5. Have fun playing around! If you want to quit the app, it is a good practice (optional) to **deactivate the virtual environment** simply by running:
```
    deactivate
```
### ======= Below are general messages ==========
Please use this for all your technical coding stuff; this'll be the main repository we'll use. If you want to suggest any changes to be made about this (and/or the licence) then do let me know!

Also, do remember to use the trello board at: https://trello.com/c/dVcikWoP/7-have-a-good-time .

Happy hacking!
