from flask import Flask, Response,request, Blueprint
from bson import json_util, ObjectId
from db import Connection
import validator
from flask_cors import CORS
from utils import generate_unique_code

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
        pipeline = []
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
    
    if user_type not in ["student", "teacher"]:
        return Response(json_util.dumps({
            'error': 'Invalid user type'
        })), 400

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
        user["paragraphs"] = []        

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

@api.post("users/<user_id>/paragraphs")
def add_paragraph(user_id):
    data = request.get_json()
    
    is_valid, message = validator.validate_required_fields(data, ["story_id", "content"])
    
    if not is_valid:
        return Response( json_util.dumps({
            'error': message
        })), 400
    
    try:
        user_object_id = ObjectId(user_id)
        story_object_id = ObjectId(data.get("story_id"))
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid id format'})), 400
            
    paragraph = {
        '_id': ObjectId(),
        'content': data.get("content"),
        'story_id': story_object_id,
        'image': None
    }    
    
    res = db.update_one("users",{'paragraphs': paragraph}, {'_id': user_object_id}, append_array=True)
    
    if res is None:
        return Response(json_util.dumps({'error': 'Could not add paragraph'})), 400
    
    return Response(
        json_util.dumps({"data": paragraph}),mimetype='application/json')

@api.patch("users/<user_id>/paragraphs/<paragraph_id>")
def update_paragraph(user_id, paragraph_id):
    data = request.get_json()
        
    if not data:
        return Response(json_util.dumps({
            'error': "No data provided"
        }), 400)
    
    try:
        user_object_id = ObjectId(user_id)
        paragraph_object_id = ObjectId(paragraph_id)
    except Exception:
        return Response(json_util.dumps({'error': 'Invalid id format'}), 400)
       
    update_fields = {}

    if data.get("story_id") is not None:
        update_fields['paragraphs.$.story_id'] = ObjectId(data.get("story_id"))

    if data.get("image") is not None:
        update_fields['paragraphs.$.image'] = data.get("image")

    if data.get("content") is not None:
        update_fields['paragraphs.$.content'] = data.get("content")

    if not update_fields:
        return Response(json_util.dumps({'error': 'No fields to update'}), 400)

    res = db.update_one(
        "users",
        update_fields,  
        {'_id': user_object_id, 'paragraphs._id': paragraph_object_id},
        append_array=False 
    )
        
    if res is None:
        return Response( json_util.dumps({'error': 'Could not delete class'})), 400

    return Response(
        json_util.dumps({"data": res}),
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
        
    is_valid, message = validator.validate_required_fields(data, ["title", "author", "short_description", "content"])
    
    if not is_valid:
        return Response( json_util.dumps({
            'error': message
        })), 400
            
    story = {
        'title': data.get("title"),
        'author': data.get("author"),
        'short_description': data.get("short_description"),
        'content': data.get('content'),
        'is_finished': False,
    }

    inserted_story = db.insert("stories", story)    
    if inserted_story is None:
        return Response( json_util.dumps({'error': 'Could not create story'})), 400    
           
    return Response(
        json_util.dumps({"data": story}),
        mimetype='application/json'
    ), 200
    
@api.patch("/stories/<story_id>")
def update_story(story_id):
    data = request.get_json()
    
    if not data:
        return Response(json_util.dumps({
            'error': "No data provided"
        }), 400)
    
    update_fields = {}

    if data.get("title") is not None:
        update_fields['title'] = data.get("title")

    if data.get("author") is not None:
        update_fields['author'] = data.get("author")

    if data.get("short_description") is not None:
        update_fields['short_description'] = data.get("short_description")

    if data.get("content") is not None:
        update_fields['content'] = data.get("content")

    if data.get("is_finished") is not None:
        update_fields['is_finished'] = data.get("is_finished")

    if not update_fields:
        return Response(json_util.dumps({'error': 'No fields to update'}), 400)        
           
    try:
        story_object_id = ObjectId(story_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid story_id format'})), 400    

    res = db.update_one(
        "stories",
        update_fields,  
        {'_id': story_object_id},
        append_array=False 
    )
        
    if res is None:
        return Response( json_util.dumps({'error': 'Could not update story'})), 400

    return Response(
        json_util.dumps({"data": res}),
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
    
    refs_ref = db.delete_ref_from_array("classes", "stories", story_object_id)

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
            },
            {"$lookup": {
                        "from": "stories",
                        "localField": "stories",
                        "foreignField": "_id",
                        "as": "stories"
                    }
            }, 
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
        
    is_valid, message = validator.validate_required_fields(data, ["teacher", "class_name"])
    
    if not is_valid:
        return Response(json_util.dumps({
            'error': message
        })), 400
    
    try:
        class_data = {
            'students': [ObjectId(student_id) for student_id in data.get("students", [])],
            'class_name': data.get("class_name"),
            'stories': [ObjectId(story_id) for story_id in data.get("stories", [])],
            'teacher': ObjectId(data.get("teacher")),   
        }

        db.insert("classes", class_data)    
    
        return Response(
            json_util.dumps({"data": class_data}),
            mimetype='application/json'
        ), 200
        
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid id format'})), 400

@api.patch("/classes/<class_id>")
def update_class(class_id):
    data = request.get_json()
    
    if not data:
        return Response(json_util.dumps({
            'error': "No data provided"
        }), 400)
    
    update_fields = {}
    try:
        
        if data.get("class_name") is not None:
            update_fields['class_name'] = data.get("class_name")

        if data.get("students") is not None:
            update_fields['students'] = [ObjectId(student_id) for student_id in data.get("students", [])]

        if data.get("teacher") is not None:
            update_fields['teacher'] = ObjectId(data.get("teacher"))

        if data.get("stories") is not None:                    
            update_fields['stories'] = [ObjectId(story_id) for story_id in data.get("stories", [])]

        if not update_fields:
            return Response(json_util.dumps({'error': 'No fields to update'}), 400)        
           
        class_object_id = ObjectId(class_id)
    except Exception:
        return Response( json_util.dumps({'error': 'Invalid id format'})), 400    

    res = db.update_one(
        "classes",
        update_fields,  
        {'_id': class_object_id},
        append_array=False 
    )
        
    if res is None:
        return Response( json_util.dumps({'error': 'Could not update class'})), 400

    return Response(
        json_util.dumps({"data": res}),
        mimetype='application/json'
    ), 200
      
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