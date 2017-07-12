from flask import Flask

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
  return app.send_static_fle(path)

if __name__== '__main__':
  app.run();