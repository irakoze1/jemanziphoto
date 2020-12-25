const express = require('express');
const app = express();
const multer  = require('multer');
const mongoose = require('mongoose');
const Picture = require('./models/picGallery');
const User = require('./models/User');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const mongoDBsession = require('connect-mongodb-session')(session);
const mongoURI = 'mongodb+srv://frank:frankhakil@node-rest-shop.uq0iw.mongodb.net/node-rest-shop?retryWrites=true&w=majority';
const sendEmail = require('./mail');
const fs = require('fs');

//setting the header

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

//setting tha e port and MongoDb

const port = process.env.PORT || 3000;

mongoose.connect(mongoURI
        ,{ useNewUrlParser: true , useUnifiedTopology: true })
        .then(result => {
            app.listen(port, () => console.log(`app listening on port ${port}!`));
        });

//setting file uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        const str = `${new Date().getHours()}h-${new Date().getMinutes()}min-${new Date().getSeconds()}sec_le-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}_${file.originalname}`;
        cb(null, str.replace(/ /g,''));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

// request & response

app.get('/', (req,res)=>{
    Picture.find().sort({time:-1})
    .then(result => {res.render('admin', {result:result, admin:false});
                     console.log(result)})
    .catch(err => {console.log(err);})
});

app.post('/upload', upload.single('image'), (req, res, next) => {
        console.log(req.file)
        const picture = new Picture({
            gallery: req.body.choose,
            name: req.file.filename,
            path: `uploads/${req.file.filename}`
        })
        .save()
        .then(result => {
            console.log(result)
            res.redirect('/admin#gallery');
        })
        .catch(err => console.log(err));
});

let delPath = '';

app.delete('/upload/:picID', (req, res, next) => {
    const id = req.params.picID;
    Picture.findById(id)
           .then(result => delPath = result.path)
           .catch(err => console.log(err))

    Picture.findByIdAndDelete(id)
    .then(result => {

        res.json({redirect: '/admin'});

        const path = './public/' + delPath;
        try {
            fs.unlinkSync(path)
            console.log('File Removed');
        } catch(err) {
            console.error(err);
        }
    })
    .catch(err => console.log(err));
});

app.post('/email', (req,res,next) => {
    sendEmail(req.body.email, req.body.subject, req.body.message);
    res.redirect('/');
});

//------------------login-----------

const store = new mongoDBsession({
    uri: mongoURI,
    collection: 'mySession'
})

app.use(
    session({
        secret: 'secret of mine',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);


// Login Page
app.get("/login", (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
});

app.post("/login", async (req, res) => {
    const password = req.body.password;
    const username = 'Admin';
  
    const user = await User.findOne({ username });
  
    if (!user) {
      req.session.error = "Invalid Credentials";
      return res.redirect("/login");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      req.session.error = "Invalid Credentials";
      return res.redirect("/login");
    }
  
    req.session.isAuth = true;
    req.session.username = user.username;
    res.redirect("/admin");
  });

// Register Page
app.get("/register", (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render("register", { err: error });
  });
  
app.post("/register", async (req, res) => {
    const password = req.body.password;
    const username = 'Admin';
  
    let user = await User.findOne({ username });
  
    if (user) {
      req.session.error = "User already exists";
      return res.redirect("/register");
    }
  
    const hasdPsw = await bcrypt.hash(password, 12);
  
    user = new User({
      username,
      password: hasdPsw,
    });
  
    await user.save();
    res.redirect("/login");
  });

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      req.session.error = "You have to Login first";
      res.redirect("/login");
    }
  };

// Admin Page
/*app.get("/dashboard", isAuth, dashboard_get = (req, res) => {
    const username = req.session.username;
    res.render("dashboard", { name: username });
  });*/

app.get('/admin', isAuth, (req,res)=>{
    Picture.find().sort({time:-1})
    .then(result => {res.render('index', {result:result, admin:true});
                     console.log(result)})
    .catch(err => {console.log(err);})
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/login");
    });
});