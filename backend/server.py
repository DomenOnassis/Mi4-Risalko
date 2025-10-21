from flask import Flask, Response,request, Blueprint
from bson import json_util, ObjectId
from db import Connection
import validator

app = Flask(__name__)

api = Blueprint('api', __name__, url_prefix='/api')

db = Connection("risalko")

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
        
    is_valid, message = validator.validate_required_fields(data, ["name", "surname"])        

    if not is_valid:
        return Response(json_util.dumps({
            'error': message
        })), 400
    
    user = {
        'name': data.get("name"),
        'surname': data.get("surname"),
        'type': data.get("type", "student"),
    }
    
    db.insert("users", user)    
   
    return Response(
        json_util.dumps({"data": user}),
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
    

if __name__=="__main__":
    app.register_blueprint(api)
    app.run(debug=True)