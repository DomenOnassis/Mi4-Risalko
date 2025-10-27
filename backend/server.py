from flask import Flask, Response,request, Blueprint
from bson import json_util, ObjectId
from db import Connection
import validator
from flask_cors import CORS

import secrets
import string

app = Flask(__name__)

api = Blueprint('api', __name__, url_prefix='/api')
CORS(app)
db = Connection("risalko")

@api.post("/login")
def login():
    data = request.get_json()
    
    is_valid, message = validator.validate_required_fields(data, ["email", "password"])
    
    if not is_valid:
        return Response( json_util.dumps({
            'error': message
        })), 400
    
    email = data.get("email")
    password = data.get("password")
    
    user = db.find_one("users", {"email": email, "password": password})
    
    if not user:
        return Response( json_util.dumps({
            'error': 'User not found'
        })), 404
    
    return Response(
        json_util.dumps({"data": user}),
        mimetype='application/json'
    ), 200

@api.post("/register")
def register():
    return create_user()
   
#Users
@api.get("/users")
def get_users():
    populate = request.args.get("populate", False)
    
    if populate:
        pipeline = [                
            {"$lookup": {
                        "from": "stories",
                        "localField": "stories",
                        "foreignField": "_id",
                        "as": "stories"
                    }
            },     
        ]
        users = db.lookup_all("users",pipeline)
    else:
        users = db.find_all("users")

    return Response(
        json_util.dumps({"data": list(users)}),
        mimetype='application/json'
    ), 200
    
@api.post("/users")
def create_user():    
    data = request.get_json(silent=True)    
    
    if(not data):        
        return Response(json_util.dumps({'error': 'Invalid JSON data'})), 400
        
    is_valid, message = validator.validate_required_fields(data, ["name", "surname", "email", "password"])        

    if not is_valid:
        return Response(json_util.dumps({
            'error': message
        })), 400
    
    user_type = data.get("type", "student")

    user = {
        'name': data.get("name"),
        'surname': data.get("surname"),
        'email': data.get("email"),
        'password': data.get("password"),
        'type': user_type,
    }
    
    if user_type == "student":
        code = generate_unique_code(8)

        while db.find_one("users", {"code": code}):
            code = generate_unique_code(8)

        user["code"] = code

    db.insert("users", user)    
   
    return Response(
        json_util.dumps({"data": user}),
        mimetype='application/json'
    ), 200

@api.delete("/users/<user_id>")
def delete_user(user_id):
            
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid user_id format'})), 400
        
    res = db.delete("users", {'_id': user_object_id})    
    
    if res["type"] == "teacher":
        delete_class(user_id)    
    else:
        refs_res = db.delete_ref_from_array("classes", "students", user_object_id)
        
        if(refs_res is None):
            return Response( json_util.dumps({'error': 'Could not delete refs'})), 400
    
    if res is None:
        return Response( json_util.dumps({'error': 'Could not delete user'})), 400

    return Response(
        json_util.dumps({"data": user_id}),
        mimetype='application/json'
    ), 200

#Stories  
@api.get("/stories")
def get_stories():
    
    stories = db.find_all("stories")
    return Response(
        json_util.dumps({"data": list(stories)}),
        mimetype='application/json'
    ), 200
    
@api.post("/stories")
def create_story():
    data = request.get_json()
        
    is_valid, message = validator.validate_required_fields(data, ["title", "author", "short_description", "content", "teacher_id"])
    
    if not is_valid:
        return Response( json_util.dumps({
            'error': message
        })), 400
        
    teacher_id = data.get("teacher_id")
    
    story = {
        'title': data.get("title"),
        'author': data.get("author"),
        'short_description': data.get("short_description"),
        'content': data.get('content'),
    }
    
    try:
        teacher_object_id = ObjectId(teacher_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid teacher_id format'})), 400
    
    inserted_story = db.insert("stories", story)    
    
    update_user = db.update_one("users", {'stories': inserted_story}, {'_id': teacher_object_id}, append_array=True)
    
    if(not update_user):
        return Response(json_util.dumps({'error': 'Could not append story to user'})), 400
           
    return Response(
        json_util.dumps({"data": story}),
        mimetype='application/json'
    ), 200
    
@api.delete("/stories/<story_id>")
def delete_story(story_id):
    
    try:
        story_object_id = ObjectId(story_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid story_id format'})), 400
        
    res = db.delete("stories", {'_id': story_object_id})    
    
    if res is None:
        return Response( json_util.dumps({'error': 'Could not delete story'})), 400
    
    refs_ref = db.delete_ref_from_array("users",  "stories", story_object_id)

    if refs_ref is None:
        return Response( json_util.dumps({'error': 'Could not delete refs'})), 400

    return Response(
        json_util.dumps({"data": story_id}),
        mimetype='application/json'
    ), 200
    
#Classes
@api.get("/classes")
def get_classes():
    populate = request.args.get("populate", False)
    if populate:
        pipeline = [                
            {"$lookup": {
                        "from": "users",
                        "localField": "students",
                        "foreignField": "_id",
                        "as": "students"
                    }
            },
             {"$lookup": {
                        "from": "users",
                        "localField": "teacher",
                        "foreignField": "_id",
                        "as": "teacher"
                    }
            }
        ]
        classes = db.lookup_all("classes",pipeline)

    else:
        classes = db.find_all("classes")
      
    return Response(
        json_util.dumps({"data": list(classes)}),
        mimetype='application/json'
    ), 200
    
@api.post("/classes")
def create_class():
    data = request.get_json()
        
    is_valid, message = validator.validate_required_fields(data, ["students", "teacher"])
    
    if not is_valid:
        return Response(json_util.dumps({
            'error': message
        })), 400
    
    user = {
        'students': data.get("students"),
        'teacher': data.get("teacher"),   
    }
    
    db.insert("classes", user)    
   
    return Response(
        json_util.dumps({"data": user}),
        mimetype='application/json'
    ), 200
    
# Create unique code
def generate_unique_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))
  
@api.delete("/classes/<class_id>")
def delete_class(class_id):
    
    try:
        class_object_id = ObjectId(class_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid class_id format'})), 400
        
    res = db.delete("classes", {'_id': class_object_id})
    
    if res is None:
        return Response( json_util.dumps({'error': 'Could not delete class'})), 400

    return Response(
        json_util.dumps({"data": class_id}),
        mimetype='application/json'
    ), 200
    

if __name__=="__main__":
    app.register_blueprint(api)
    app.run(debug=True)