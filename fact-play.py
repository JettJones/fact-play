from flask import Flask
from flask_restplus import Api, Resource, fields

app = Flask(__name__)
api = Api(app, version='0.1', title='Check API',
          description='Is that true?',
)

ns = api.namespace('v1', description='api methods')

page = api.model('Page', {
    'id': fields.Integer(readOnly=True, description='Unique identifier'),
    'url': fields.String(description='Link to Debunking source'),
    'feedback_url': fields.String(description='Link to subject'),
    'desc': fields.String(description='Feedback comment')
})

subject = api.model('Subject', {
    'id': fields.Integer(readOnly=True, description='Unique identifier'),
    'title': fields.String(required=True, description='Subject Title'),
    'desc': fields.String(description='Details of the subject'),
#     'citations': fields.List(fields.String(), description='Links with background information'),
#    'articles': fields.List(fields.String(), description='Articles covering the subject'),
})

new_subject = api.model('Subject', {
    'title': fields.String(required=True, description='Subject Title'),
    'desc': fields.String(description='Details of the subject'),
})

add_url = api.model('Url', {
    'url': fields.String(required=True, description='Url'),
})


class LinkData(object):
    def __init__(self):
        self.counter = 0
        self.data = {}

    def all(self):
        return self.data.values()

    def get(self, id):
        return self.data.get(id, None)

    def create(self, input):
        id = self.counter = self.counter + 1
        input['id'] = id
        self.data[id] = input
        return input

    def update(self, id, input):
        l = self.get(id)
        l.update(input)
        return l

    def delete(self, id):
        del self.data[id]


DAO = LinkData()
DAO.create({'url': 'http://example.com/recent-article'})

S_DAO = LinkData()
S_DAO.create({'title': 'Climage Change', 'articles': ['somelink']})

def _must_exist(dao, id):
    o = dao.get(id)
    if o is None:
        api.abort(404, 'Resource {} does not exist'.format(id))
    return o

class PageList(Resource):
    @ns.marshal_list_with(page)
    def get(self):
        '''List of pages'''
        items = list(DAO.all())
        return items
        
    @ns.expect(page)
    @ns.marshal_list_with(page)
    def post(self):
        '''Add record'''
        page = api.payload
        return DAO.create(page)


@ns.response(404, 'Page not found')
@ns.param('id', 'identifier')
class Page(Resource):
    @ns.marshal_with(page)
    def get(self, id):
        '''Fetch a record'''
        return _must_exist(DAO, id)

    def delete(self, id):
        '''Delete record'''
        S_DAO.delete(id)
        return "", 202


@ns.response(404, 'Subject not found')
@ns.param('id', 'The subject identifier')
class Subject(Resource):
    @ns.marshal_with(subject)
    def get(self, id):
        '''Fetch a record'''
        return _must_exist(S_DAO, id)

    def delete(self, id):
        '''Delete record'''
        return S_DAO.delete(id)


class SubjectList(Resource):
    @ns.marshal_with(subject)
    def get(self):
        '''List all subjects'''
        items = list(S_DAO.all())
        return items

    @ns.expect(new_subject)
    @ns.marshal_with(subject)
    def post(self):
        '''Add record'''
        sub = api.payload
        return S_DAO.create(sub)

@ns.response(404, 'Subject not found')
@ns.param('id', 'The subject identifier')
class SubjectCite(Resource):
    @ns.marshal_list_with(add_url)
    def get(self, id):
        '''List all citations of a subject'''
        sub = _must_exist(S_DAO, id)
        art = sub.get('citations', [])
        return [{'url':a} for a in art]

    @ns.expect(add_url)
    @ns.marshal_with(subject)
    def post(self, id):
        '''Add a link to the Subject'''
        sub = _must_exist(S_DAO, id)

        field = 'citations'
        if field not in sub or not sub[field]:
            sub[field] = []

        sub[field].append(api.payload['url'])
        return sub

@ns.param('id', 'The subject identifier')
class SubjectLink(Resource):
    @ns.marshal_list_with(add_url)
    def get(self, id):
        '''List all links referencing a subject'''
        sub = _must_exist(S_DAO, id)
        art = sub.get('articles', [])
        return [{'url':a} for a in art]

    @ns.expect(add_url)
    @ns.marshal_with(subject)
    def post(self, id):
        '''Add a link to the Subject'''
        sub = _must_exist(S_DAO, id)

        field = 'articles'
        if field not in sub or not sub[field]:
            sub[field] = []

        sub[field].append(api.payload['url'])
        return sub
 

def routes():
    ns.add_resource(PageList, '/page/')
    ns.add_resource(Page, '/page/<int:id>')

    ns.add_resource(SubjectList, '/subjects/')
    ns.add_resource(Subject, '/subjects/<int:id>')
    ns.add_resource(SubjectCite, '/subjects/<int:id>/citations')
    ns.add_resource(SubjectLink, '/subjects/<int:id>/articles')

    
if __name__ == '__main__':
    routes()
    app.run(debug=True)
