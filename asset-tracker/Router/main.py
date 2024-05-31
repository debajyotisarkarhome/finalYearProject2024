from pymongo import MongoClient
from dotenv import load_dotenv
import json
import os
import paho.mqtt.client as paho
from paho import mqtt
import logging
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib

load_dotenv()

def generate_unsalted_hash(password, hash_function=hashlib.sha256):
  """Generates an unsalted hash using a chosen hash function (not secure)."""
  hashed_value = hash_function(password.encode())  # Encode to bytes for hashing
  return hashed_value.hexdigest()

# Define your MQTT broker settings
broker_address = os.environ.get("MQTT_HOST")
broker_username = os.environ.get("MQTT_USERNAME")
broker_password = os.environ.get("MQTT_PASSWORD")
mqtt_topic = "deviceLog"  # Replace with the topic you want to subscribe to

# Define your MongoDB connection details
mongo_uri = os.environ.get("DATABASE_URI")  # Replace with your MongoDB connection string
database_name = "devices"  # Replace with your database name
collection_name = "device_logs"  # Replace with your collection name

def on_connect(client, userdata, flags, rc, properties=None):
    print("CONNACK received with code %s." % rc)

def on_message(client, userdata, msg):
    # Convert message payload to a dictionary (optional)
    try:
        data = json.loads(msg.payload.decode())
    except:
        pass  # Handle non-JSON data
    
    if not data.get('deviceId') or not data.get('deviceAuthCode') or not data.get('locData'):
        logging.error("Invalid Data")
        return
    
    client = MongoClient(mongo_uri)
    db = client.devices
    devicesCollection = db.devices
    deviceLogsCollection = db.device_logs
    
    dev=devicesCollection.find_one({"deviceId":data.get('deviceId')})
    # print(generate_unsalted_hash(data.get('deviceAuthCode')),dev['deviceAuthCode'])
    if not generate_unsalted_hash(data.get('deviceAuthCode'))==dev['deviceAuthCode']:
        logging.error("Invalid Auth")
        return
    else:
        deviceLogsCollection.insert_one({
                                        "deviceId":data.get('deviceId'),
                                        "locData":data.get('locData')
                                         })
    logging.info(f"Received message on topic {msg.topic}: {data}")

    # Close MongoDB connection (optional)
    # client.close()  # Uncomment if you want to close the connection after each message

# Create a new MQTT client
client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect
client.on_message = on_message

# enable TLS for secure connection
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
# set username and password
client.username_pw_set("hivemq.webclient.1717152261904", "xh>5eZ39t2kV!T?AF:Jc")
# connect to HiveMQ Cloud on port 8883 (default for MQTT)
client.connect("eb7199f16e8d4a83a42074624635140a.s2.eu.hivemq.cloud", 8883)
client.subscribe(mqtt_topic)

# setting callbacks, use separate functions like above for better visibility



# Start the MQTT loop
client.loop_forever()
