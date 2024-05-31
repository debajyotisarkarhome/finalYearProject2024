from functools import wraps
from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import urllib
from dotenv import load_dotenv
import os

load_dotenv()

# Replace with your MongoDB connection string
DATABASE_URI = os.environ.get("DATABASE_URI")
SECRET_KEY = os.environ.get("SECRET_KEY")  # Replace with a strong, random secret

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)  # Customize expiration time

jwt = JWTManager(app)

client = MongoClient(DATABASE_URI)
db = client.users  # Replace with your database name
devices = client.devices
users_collection = db.users
devices_collection = devices.devices
device_logs_collection = devices.device_logs

# User model for clarity (optional)
class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)

# Error handling decorator
def handle_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return wrapper

# Registration API
@app.route("/register", methods=["POST"])
@handle_errors
def register():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing required fields"}), 400

    username = data["username"]
    email = data["email"]
    password = data["password"]

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = {"username": username, "email": email, "password": hashed_password}
    users_collection.insert_one(new_user)

    return jsonify({"message": "User created successfully"}), 201

# Login API
@app.route("/login", methods=["POST"])
@handle_errors
def login():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing required fields"}), 400

    username = data["username"]
    password = data["password"]

    user = users_collection.find_one({"username": username})

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token})

# Protected route example (replace with your own logic)
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome, {current_user}!"})

@app.route("/createDevice",methods=["POST"])
@jwt_required()
def getDevicesByUserName():
    current_user = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("deviceId") or not data.get("deviceAuthCode"):
        return jsonify({"error": "Missing required fields"}), 400
    
    devices_collection.insert_one({
        "username":current_user,
        "deviceId":data.get("deviceId"),
        "deviceAuthCode":generate_password_hash(data.get("deviceAuthCode"))
                                   })
    return jsonify({"message":"Device Created Successfully"})

@app.route("/getDeviceLogs", methods=["POST"])
@jwt_required()
def getDeviceLogs():
    current_user = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("deviceId"):
        return jsonify({"error": "Missing required fields"}), 400
    logs = device_logs_collection.find_one({"username": current_user,"deviceId":data.get("deviceId")})
    return logs
    
    
if __name__ == "__main__":
    app.run(debug=True)
