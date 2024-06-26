from functools import wraps
import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import urllib
from dotenv import load_dotenv
import os
import bcrypt
import hashlib
from flask_cors import CORS
from bson.json_util import dumps
from bson.json_util import loads

load_dotenv()

def generate_unsalted_hash(password, hash_function=hashlib.sha256):
  """Generates an unsalted hash using a chosen hash function (not secure)."""
  hashed_value = hash_function(password.encode())  # Encode to bytes for hashing
  return hashed_value.hexdigest()

# Replace with your MongoDB connection string
DATABASE_URI = os.environ.get("DATABASE_URI")
SECRET_KEY = os.environ.get("SECRET_KEY")  # Replace with a strong, random secret

app = Flask(__name__)
CORS(app)
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

    access_token = create_access_token(identity=username,expires_delta=timedelta(days=1))
    return jsonify({"access_token": access_token,
                    "username":data["username"]})

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
        "deviceAuthCode":generate_unsalted_hash(data.get("deviceAuthCode"))
                                   })
    return jsonify({"message":"Device Created Successfully"})

@app.route("/getDeviceLogs", methods=["POST"])
@jwt_required()
def getDeviceLogs():
    current_user = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("deviceId"):
        return jsonify({"error": "Missing required fields"}), 400
    logs = list(device_logs_collection.find({"deviceId":data.get("deviceId")}))
    res = {
        "deviceId":data.get("deviceId"),
        "locData":[],
        "centrePoint":None
    }
    if list(logs)==[]:
        return jsonify(res)
    print(logs)
    latsum=0
    lonsum=0
    for i in logs:
        res["locData"].append({
            "lat": i["locData"][0], "lon":i["locData"][1], "popup": str(i["_id"].generation_time) 
        }) 
        latsum=latsum+i["locData"][0]
        lonsum=lonsum+i["locData"][1]
    res["centrePoint"]=[latsum/len(logs),lonsum/len(logs)]
    return jsonify(res)

@app.route("/getDeviceList", methods=["POST"])
@jwt_required()
def getDeviceList():
    current_user = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("username"):
        return jsonify({"error": "Missing required fields"}), 400
    devicesList = list(devices_collection.find({"username":current_user}))
    res = {
        "deviceList":[]
    }
    if list(devicesList)==[]:
        return jsonify(res)
    
    for i in devicesList:
        res["deviceList"].append({
            "username":i["username"],
            "deviceId":i["deviceId"]
        })
    
    # for i in 
    return jsonify(res)
    
if __name__ == "__main__":
    app.run(debug=True,port=8080,host="0.0.0.0")
