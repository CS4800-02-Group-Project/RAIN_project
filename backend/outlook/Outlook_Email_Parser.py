import os
import re
import threading
import webbrowser

import firebase_admin
import msal
import requests
from bs4 import BeautifulSoup
import config as config
from flask import Flask, redirect, url_for, session, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("valdez-chatroom-b8d7e6358fb8.json") 
firebase_admin.initialize_app(cred)

db = firestore.client() 

class Assignment:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date

        
# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS for all routes
app.secret_key = os.urandom(24).hex()

# Microsoft App Credentials
TENANT_ID = "common"
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
REDIRECT_URI = "http://localhost:4999/getToken"
SCOPES = ["User.Read", "Mail.Read"]

# MSAL Instance
msal_app = msal.ConfidentialClientApplication(
    config.CLIENT_ID, authority=AUTHORITY, client_credential=config.CLIENT_SECRET
)

@app.route("/login")
def login():
    """Redirects user to Microsoft login page"""
    auth_url = msal_app.get_authorization_request_url(SCOPES, redirect_uri=REDIRECT_URI)
    return redirect(auth_url)

@app.route("/getToken")
def get_token():
    """Handles callback and gets an access token"""
    if "error" in request.args:
        return f"Error: {request.args['error_description']}"

    code = request.args.get("code")
    if not code:
        return "Authorization code not found"

    token_response = msal_app.acquire_token_by_authorization_code(code, SCOPES, redirect_uri=REDIRECT_URI)
    
    if "access_token" not in token_response:
        return f"Login failed: {token_response.get('error_description')}"

    session["access_token"] = token_response["access_token"]
    access_token = session.get("access_token")
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
    graph_api_url = "https://graph.microsoft.com/v1.0/me"
    user_response = requests.get(graph_api_url, headers=headers)
    user_profile = user_response.json()
    user_email = user_profile["mail"]
    session["user_id"] = user_profile["id"]
    session["user_email"] = user_email
    
    user_docs = db.collection("users").where(filter=firestore.FieldFilter("email", "==", user_email)).stream()
    
    for doc in user_docs:
        user_doc_id = doc.id
        db.collection("users").document(user_doc_id).update({"user_id": user_profile["id"]})
        break

    return redirect(url_for("emails"))

@app.route("/emails")
def emails():
    """Fetches recent emails from Outlook and returns them as JSON"""
    try:
        access_token = session.get("access_token")
        user_id = session.get("user_id")
        user_email = session.get("user_email")
        
        if not access_token:
            return redirect(url_for("login"))
        if not user_id:
            return jsonify({"status": "error", "message": "User ID not found in session"})

        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
        graph_api_url = "https://graph.microsoft.com/v1.0/me/messages"
        params = {
            "$top": 200,
            "$select": "subject,from,body",
            "$orderby": "receivedDateTime DESC"
        }

        # if session.get("emails_processed"):
        #     return jsonify({
        #         "status": "success",
        #         "message": "Assignments already processed",
        #         "user_email": user_email
        # })

        response = requests.get(graph_api_url, headers=headers, params=params)

        if response.status_code != 200:
            return jsonify({"status": "error", "message": f"Error fetching emails: {response.text}"})

        emails = response.json().get("value", [])

        with open("emails.txt", "w", encoding="utf-8") as file:
            for email in emails:
                sender = email.get("from", {}).get("emailAddress", {}).get("address", "Unknown Sender")
                subject = email.get("subject", "No Subject")
                body = email.get("body", {}).get("content", "No Body Available")

                file.write(f"From: {sender}\n")
                file.write(f"Subject: {subject}\n")
                file.write(f"Body: {body}\n")
                file.write("=" * 50 + "\n\n")

        # Get formatted assignments
        result = reformat_emails()
        
        # Store assignments in Firestore if successful
        if result["status"] == "success" and result["assignments"]:
            user_docs = db.collection("users").where(
                filter=firestore.FieldFilter("email", "==", user_email)
            ).stream()
            
            for user_doc in user_docs:
                user_ref = db.collection("users").document(user_doc.id)
                assignments_ref = user_ref.collection("assignments")
                
                # Get existing assignments
                existing_assignments = {
                    doc.get("title"): doc.reference 
                    for doc in assignments_ref.stream()
                }
                
                # Add only new assignments
                for assignment in result["assignments"]:
                    title = assignment["title"]
                    if title not in existing_assignments:
                        assignments_ref.add({
                            "title": title,
                            "due_date": assignment["due_date"],
                            "timestamp": firestore.SERVER_TIMESTAMP
                        })
                
                # # Mark as processed in session
                # session["emails_processed"] = True

        # Clean up temporary file
        if os.path.exists("emails.txt"):
            os.remove("emails.txt")
        
        return jsonify({
            **result,
            "user_email": user_email
        })

    except Exception as e:
        print(f"An error occurred in emails: {e}")
        return jsonify({"status": "error", "message": str(e)})

def extract_assignment_title(body):
    """ Extracts ALL assignment titles after 'Assignment Created - ' and 'Assignment Due Date Changed: '
        Stores the titles in a list.
    """
    pattern = r"(Assignment Created - |Assignment Due Date Changed: )(.*?)(?=\s*due:|\n|$)"
    matches = re.findall(pattern, body)
    titles = [match[1].strip() for match in matches]    # extract just the assignment titles
    return titles   # returns LIST of titles

def extract_due_date(body):
    """ Extracts ALL due dates after 'due: '
        Stores dates in a list.
    """
    pattern = r"due:\s*(.*?)(?=\s*Click|\n|$)"
    due_dates = re.findall(pattern, body)   # extract just the due dates
    return due_dates   # returns LIST of dates

def clean_HTML(html_content):
    """Cleans HTML tags and returns plain text"""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator=" ")  # Convert HTML to plain text

def reformat_emails():
    """Reads emails.txt, extracts assignments, and returns formatted data as JSON"""
    if not os.path.exists("emails.txt"):
        print("emails.txt not found. Skipping reformatting.")
        return {"status": "error", "message": "emails.txt not found"}

    with open("emails.txt", "r", encoding="utf-8") as file:
        emails = file.read().split("=" * 50 + "\n\n")  # Split emails by separator

    filtered_assignments = []

    for email in emails:
        if "Recent Canvas Notifications" in email:  # Only process relevant emails
            email = clean_HTML(email)   # removes all HTML tags

            assignment_titles = extract_assignment_title(email)
            due_dates = extract_due_date(email)

            for title, date in zip(assignment_titles, due_dates):
                filtered_assignments.append({
                    "title": title,
                    "due_date": date
                })

    if filtered_assignments:
        return {
            "status": "success",
            "assignments": filtered_assignments
        }
    else:
        return {
            "status": "success",
            "assignments": [],
            "message": "No valid assignments found"
        }


def open_browser():
    """Opens login page automatically when script starts"""
    with app.test_request_context():
        auth_url = msal_app.get_authorization_request_url(SCOPES, redirect_uri=REDIRECT_URI)
        webbrowser.open(auth_url)

if __name__ == "__main__":
    threading.Timer(1, open_browser).start()
    app.run(debug=True, host="127.0.0.1", port=4999, use_reloader=False)