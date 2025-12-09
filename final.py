from flask import Flask, request, render_template, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_json import FlaskJSON, json_response
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder=r'C:\users\Brena\OneDrive\Desktop\webdev\final\templates')
app.config['SECRET_KEY'] = 'whateverKEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'


class User(db.Model,  UserMixin):
   id = db.Column(db.Integer, primary_key=True)
   name = db.Column(db.String(80), nullable=False)
   age = db.Column(db.Integer, nullable=False)
   username = db.Column(db.String(80), nullable=False, unique=True)
   password = db.Column(db.String(80), nullable=False)


@app.route('/')
def home():
   return render_template('home.html')


@app.route('/read')
@login_required
def read():
   users = User.query.filter(User.id != current_user.id).all()
   return render_template('read.html', users=users)


@app.route('/create', methods=['GET', 'POST'])
def create():
   if request.method == 'POST':
       name = request.form['name']
       age = request.form['age']
       username = request.form['username']
       password = request.form['password']


       #no duplicate usernames (flash built into flask
       if User.query.filter_by(username=username).first():
           return render_template('create.html', error='Username already exists')


       new_user = User(
           name=name,
           age=int(age),
           username=username,
           password=password
       )


       db.session.add(new_user)
       db.session.commit()
       return redirect(url_for('login', msg='Account created successfully'))
   return render_template('create.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
   msg = request.args.get('msg')


   if request.method == 'POST':
       username = request.form['username']
       password = request.form['password']


       user = User.query.filter_by(username=username).first()
       if user and user.password == password:
           login_user(user)
           return redirect(url_for('read'))


       return render_template('login.html', error='Invalid username or password')


   return render_template('login.html', msg=msg)


@app.route('/update', methods=['GET', 'POST'])
@login_required
def update():
   if request.method == 'POST':
       current_user.password = request.form['password']
       db.session.commit()
       return redirect(url_for('read', msg='Password updated successfully'))
   return render_template('update.html', entry=current_user)


@app.route('/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete(id):
   entry = User.query.get_or_404(id)
   if request.method == 'POST':
       db.session.delete(entry)
       db.session.commit()
       return redirect(url_for('read'))
   return render_template('delete.html', entry=entry)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
       logout_user()
       return redirect(url_for('home'))


@login_manager.user_loader
def load_user(uid):
   user = User.query.get(uid)
   return user


if __name__ == '__main__':
   with app.app_context():
       db.create_all()
   app.run(debug=True)