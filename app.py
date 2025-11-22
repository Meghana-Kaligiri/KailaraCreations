from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

DATA_DIR = 'data'
CONTACTS_FILE = os.path.join(DATA_DIR, 'contacts.json')

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

def load_json(filepath, default=None):
    ensure_data_dir()
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    if default is not None:
        return default
    return {}

def save_json(filepath, data):
    ensure_data_dir()
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

contacts_data = load_json(CONTACTS_FILE, [])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/services/weddings')
def weddings():
    return render_template('services/weddings.html')

@app.route('/services/corporate')
def corporate():
    return render_template('services/corporate.html')

@app.route('/services/parties')
def parties():
    return render_template('services/parties.html')

@app.route('/services/concerts')
def concerts():
    return render_template('services/concerts.html')

@app.route('/services/destination')
def destination():
    return render_template('services/destination.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/packages')
def packages():
    return render_template('packages.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        contact_entry = {
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'event_type': data.get('event_type'),
            'event_date': data.get('event_date'),
            'message': data.get('message', ''),
            'timestamp': datetime.now().isoformat()
        }
        contacts_data.append(contact_entry)
        save_json(CONTACTS_FILE, contacts_data)
        return jsonify({'success': True, 'message': 'Thank you! We will contact you soon.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
