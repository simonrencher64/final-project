from flask import Flask, redirect, url_for, session, request, jsonify, flash
from flask_oauthlib.client import OAuth
#from flask_oauthlib.contrib.apps import github #import to make requests to GitHub's OAuth
from flask import render_template


import pymongo
import os
import sys
import pprint

from bson.objectid import ObjectId

# This code originally from https://github.com/lepture/flask-oauthlib/blob/master/example/github.py
# Edited by P. Conrad for SPIS 2016 to add getting Client Id and Secret from
# environment variables, so that this will work on Heroku.
# Edited by S. Adams for Designing Software for the Web to add comments and remove flash messaging

app = Flask(__name__)

app.debug = False #Change this to False for production

# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' #Remove once done debugging

#os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' #Remove once done debugging


app.secret_key = os.environ['SECRET_KEY'] #used to sign session cookies
oauth = OAuth(app)
oauth.init_app(app) #initialize the app to be able to make requests for user information

#Set up GitHub as OAuth provider
github = oauth.remote_app(
    'github',
    consumer_key=os.environ['GITHUB_CLIENT_ID'], #your web app's "username" for github's OAuth
    consumer_secret=os.environ['GITHUB_CLIENT_SECRET'],#your web app's "password" for github's OAuth
    request_token_params={'scope': 'user:email'}, #request read-only access to the user's email.  For a list of possible scopes, see developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps
    base_url='https://api.github.com/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://github.com/login/oauth/access_token',  
    authorize_url='https://github.com/login/oauth/authorize' #URL for github's OAuth login
)

admin_list = ['simonrencher64']

connection_string = os.environ["MONGO_CONNECTION_STRING"]
db_name = os.environ["MONGO_DBNAME"]

client = pymongo.MongoClient(connection_string)
db = client[db_name]
collection = db['numbers'] #1. put the name of your collection in the quotes
 
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


#context processors run before templates are rendered and add variable(s) to the template's context
#context processors must return a dictionary 
#this context processor adds the variable logged_in to the conext for all templates
@app.context_processor
def inject_logged_in():
    is_logged_in = 'github_token' in session #this will be true if the token is in the session and false otherwise
    return {"logged_in":is_logged_in}

@app.route('/')
def home():
    return render_template('home.html')

#redirect to GitHub's OAuth page and confirm callback URL
@app.route('/login')
def login():   
    return github.authorize(callback=url_for('authorized', _external=True, _scheme='https')) #callback URL must match the pre-configured callback URL

@app.route('/logout')
def logout():
    session.clear()
    return render_template('message.html', message='You were logged out')

@app.route('/login/authorized')
def authorized():
    resp = github.authorized_response()
    if resp is None:
        session.clear()
        message = 'Access denied: reason=' + request.args['error'] + ' error=' + request.args['error_description'] + ' full=' + pprint.pformat(request.args)      
    else:
        try:
            session['github_token'] = (resp['access_token'], '') #save the token to prove that the user logged in
            session['user_data']=github.get('user').data
            if session['user_data']['login'] in admin_list:
                session['is_admin'] = True
            else:
                session['is_admin'] = False
            print(session['is_admin'])
            #pprint.pprint(vars(github['/email']))
            #pprint.pprint(vars(github['api/2/accounts/profile/']))
            message='You were successfully logged in as ' + session['user_data']['login'] + '.'
        except Exception as inst:
            session.clear()
            print(inst)
            message='Unable to login, please try again.  '
    return render_template('message.html', message=message)


@app.route('/login_button_press', methods=['POST'])
def login_button_press():
    if 'user_data' in session:
        return button_press()
    else:
        message = 'Please log in before posting.'
        return render_template('message.html', message=message)

@app.route('/button_press', methods=['POST'])
def button_press():
    
    strNumber = request.form.get("number")
    number = int(strNumber)
    
    docQuery = { "number": number }
    
    docID = ''
    docScore = 0
    
    for i in collection.find(docQuery):
        docID = i['_id']
        docScore = i['score']
    
    idQuery = { "_id": docID }
    newvalues = { "$set": { "score": docScore+1 } }
    
    collection.update_one(idQuery, newvalues)
    
    return jsonify('true')


@app.route('/get_collection_data', methods=['GET'])
def get_collection_data():
    data = []
    for i in collection.find():
        data.append(i['score'])
        
    
    return jsonify(data)


@app.route('/check_loggin', methods=['GET'])
def check_loggin():
    data = {}
    if 'user_data' in session:
        data['logged_in'] = True
        if session['is_admin']:
            data['is_admin'] = True
    
    return jsonify(data)

@app.route('/clear_all', methods=['POST'])
def clear_all():
    if session['is_admin'] == True:
        for i in collection.find():
            idQuery = { "_id": i['_id'] }
            newvalues = { "$set": { "score": 0 } }
            collection.update_one(idQuery, newvalues)
            
    
    return 'what'




@app.route('/page1')
def renderPage1():
    if 'user_data' in session:
        user_data_pprint = pprint.pformat(session['user_data'])#format the user data nicely
    else:
        user_data_pprint = '';
    return render_template('page1.html',dump_user_data=user_data_pprint)


@app.route('/googleb4c3aeedcc2dd103.html')
def render_google_verification():
    return render_template('googleb4c3aeedcc2dd103.html')

#the tokengetter is automatically called to check who is logged in.
@github.tokengetter
def get_github_oauth_token():
    return session['github_token']


if __name__ == '__main__':
    app.run()
