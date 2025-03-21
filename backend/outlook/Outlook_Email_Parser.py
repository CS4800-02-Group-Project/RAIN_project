import re
import threading
import webbrowser
import config
from flask import Flask, redirect, render_template_string, url_for, session, request
import msal
import requests
import os

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

# Microsoft App Credentials
TENANT_ID = "common"
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
REDIRECT_URI = "http://localhost:5000/getToken"
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
    return redirect(url_for("emails"))

@app.route("/emails")
def emails():
    """Fetches recent emails from Outlook and writes them to a file"""
    access_token = session.get("access_token")
    if not access_token:
        return redirect(url_for("login"))

    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
    graph_api_url = "https://graph.microsoft.com/v1.0/me/messages"
    params = {
        "$top": 200,  # Fetch 200 emails
        "$select": "subject,from,body",  # Include subject, sender, and body (full body)
        "$orderby": "receivedDateTime DESC"  # Sort by newest first
    }

    response = requests.get(graph_api_url, headers=headers, params=params)

    if response.status_code != 200:
        return f"Error fetching emails: {response.text}"

    emails = response.json().get("value", [])

    # Write emails to a text file
    with open("emails.txt", "w", encoding="utf-8") as file:
        for email in emails:
            sender = email.get("from", {}).get("emailAddress", {}).get("address", "Unknown Sender")
            subject = email.get("subject", "No Subject")
            body = email.get("body", {}).get("content", "No Body Available")  # Full body content

            file.write(f"From: {sender}\n")
            file.write(f"Subject: {subject}\n")
            file.write(f"Body: {body}\n")
            file.write("=" * 50 + "\n\n")  # Separator between emails

    reformat_emails()  # Reformat emails as required
    
    # Return HTML that includes JavaScript to close the browser tab
    return render_template_string("""
        <html>
            <head><title>Emails Processed</title></head>
            <body>
                <h1>Emails successfully written to emails.txt! Check the file.</h1>
                <script type="text/javascript">
                    window.close();
                </script>
            </body>
        </html>
    """)

def extract_assignment_title(body):
    """Extracts assignment title after 'Assignment Created - '"""
    match = re.search(r"Assignment Created - (.*?)(\n|$)", body)
    return match.group(1).strip() if match else ""

def extract_due_date(body):
    """Extracts due date after 'due: '"""
    match = re.search(r"due: (.*?)(\n|$)", body)
    return match.group(1).strip() if match else ""

def reformat_emails():
    """Reads emails.txt, extracts assignments, and writes formatted data to output.txt"""
    if not os.path.exists("emails.txt"):
        print("emails.txt not found. Skipping reformatting.")
        return

    with open("emails.txt", "r", encoding="utf-8") as file:
        emails = file.read().split("=" * 50 + "\n\n")  # Split emails by separator

    filtered_assignments = []

    for email in emails:
        if "Recent Canvas Notifications" in email:  # Only process relevant emails
            assignment_title = extract_assignment_title(email)
            due_date = extract_due_date(email)

            if assignment_title and due_date and due_date != "No Due Date":
                filtered_assignments.append(f"{assignment_title}: {due_date}")

    if filtered_assignments:
        with open("output.txt", "w", encoding="utf-8") as file:
            for assignment in filtered_assignments:
                file.write(assignment + "\n" + "=" * 40 + "\n")
        print("Filtered assignments written to output.txt!")
    else:
        print("No valid assignments found.")

def open_browser():
    """Opens login page automatically when script starts"""
    with app.test_request_context():
        auth_url = msal_app.get_authorization_request_url(SCOPES, redirect_uri=REDIRECT_URI)
        webbrowser.open(auth_url)

if __name__ == "__main__":
    threading.Timer(1, open_browser).start()
    app.run(debug=True, use_reloader=False)
