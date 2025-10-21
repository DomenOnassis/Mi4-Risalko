from pymongo import MongoClient, ReturnDocument
from dotenv import load_dotenv
from datetime import datetime

import os

load_dotenv()

DB_URI= os.getenv("DB_URI")

class Connection:        
    def __init__(self, database):
        client = MongoClient(DB_URI)
        self.db = client[database]

    def find_one(self, collection_name, filter_query):
        if not filter_query:
            print("No filter provided for find_one.")
            return None
        try:
            collection = self.db[collection_name]
            document = collection.find_one(filter_query, {'_id': 0})
            return document
        except Exception as e:
            print("Error fetching document:", e)
            return None
        
    def find_all(self, collection_name):
        try:            
            collection = self.db[collection_name]
            documents = list(collection.find({}, {'_id': 0}))
            return documents
        except Exception as e:
            print("Error fetching documents:", e)
            return []
    
    def lookup_all(self, collection_name, pipeline):
        if  not pipeline:
            print("No filter provided when updating element")
            return None
        
        try:        
            
            collection = self.db[collection_name]
            documents = list(collection.aggregate(pipeline=pipeline))
            return documents
        except Exception as e:
            print("Error fetching documents:", e)
            return []
        
        
    def insert(self, collection_name, item):
        try:
            item['created_at'] = datetime.now()
            collection = self.db[collection_name]
            result = collection.insert_one(item)             
            return result.inserted_id
        except Exception as e:
            print("Error inserting document:", e)
            return None
    
    def update_one(self, collection_name, item, filter_query, append_array = False):
      if(not filter_query):
          print("No filter provided when updating element")
          return None

      try:
          collection = self.db[collection_name]
          
          update = {
            "$currentDate": {"updated_at": True}
            }
        
          if append_array:
              update["$push"] = item
          else:
              update["$set"] = item
                     
          filter_query = filter_query 
          result = collection.find_one_and_update(
              filter_query,
              update,
              return_document=ReturnDocument.AFTER
          )
          if result:
              return result
          else:
              print("No matching document found to update.")
              return None					
      except Exception as e:
          print("Error updating one document:", e)
          return None


