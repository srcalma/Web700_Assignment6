/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Stephanie Rose Calma      Student ID: 124746223      Date: August 07, 2023
*
*  Online (Cyclic) Link: https://shy-erin-angelfish-hem.cyclic.app/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');
var app = express();
const exphbs = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/"));

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, target, options) {
            if (typeof target === 'object') {
                options = target;
                target = undefined;
            }

            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link"' +
                (target ? ' target="' + target + '"' : '') +
                ' href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', 'hbs');

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get('/students', (req, res) => {
    const { course } = req.query;

    if (course) {
        collegeData.getStudentsByCourse(Number(course))
            .then(students => {
                if (students.length === 0) {
                    res.render('students', { message: "no results" });
                } else {
                    res.render('students', { students: students });
                }
            })
            .catch(() => {
                res.render('students', { message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then(students => {
                if (students.length === 0) {
                    res.render('students', { message: "no results" });
                } else {
                    res.render('students', { students: students });
                }
            })
            .catch(() => {
                res.render('students', { message: "no results" });
            });
    }
});

app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(courses => {
            if (courses.length === 0) {
                res.render('courses', { message: "No courses found." });
            } else {
                res.render('courses', { courses: courses });
            }
        })
        .catch(() => {
            res.render('courses', { message: "No courses found." });
        });
});


app.get("/course/:id", (req, res) => {
    collegeData
        .getCourseById(req.params.id)
        .then((data) => {
            if (!data) {
                res.status(404).send("Course Not Found");
            } else {
                res.render("course", { course: data });
            }
        })
        .catch((err) => {
            res.status(500).send("Error Fetching Course");
        });
});

app.get("/course/delete/:id", (req, res) => {
    collegeData
        .deleteCourseById(req.params.id)
        .then(() => {
            res.redirect("/courses");
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Course / Course not found");
        });
});

app.get('/', (req, res) => {
    /*res.sendFile(path.join(__dirname, 'views', 'home.html'));*/
    res.render('home');
});

app.get('/about', (req, res) => {
    /*res.sendFile(path.join(__dirname, 'views', 'about.html'));*/
    res.render('about');
});

app.get('/htmlDemo', (req, res) => {
    /*res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));*/
    res.render('htmlDemo');
});

app.get("/students/add", (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.render("addStudent", { courses: courses });
        })
        .catch(() => {
            res.render("addStudent", { courses: [] });
        });
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.get("/student/:studentNum", (req, res) => {
    let viewData = {};

    collegeData.getStudentByNum(req.params.studentNum)
        .then((studentData) => {
            if (studentData) {
                viewData.student = studentData;
            } else {
                viewData.student = null;
            }
        })
        .catch(() => {
            viewData.student = null;
        })
        .then(collegeData.getCourses)
        .then((coursesData) => {
            viewData.courses = coursesData;

            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.courses = [];
        })
        .then(() => {
            if (viewData.student == null) {
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData });
            }
        });
});

app.get("/students/delete/:studentNum", (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum)
        .then(() => {
            res.redirect("/students");
        })
        .catch((error) => {
            res.status(500).send("Unable to Remove Student / Student not found");
        });
});

/* =================================================================== */
app.post("/courses/add", (req, res) => {
    collegeData
        .addCourse(req.body)
        .then(() => {
            res.redirect("/courses");
        })
        .catch((err) => {
            res.status(500).send("Unable to Add Course");
            console.log(err);
        });
});

app.post("/course/update", (req, res) => {
    collegeData
        .updateCourse(req.body)
        .then(() => {
            res.redirect("/courses");
        })
        .catch((err) => {
            res.status(500).send("Unable to Update Course");
            console.log(err);
        });
});

app.post('/students/add', (req, res) => {
    const studentData = req.body;

    collegeData.addStudent(studentData)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.post("/student/update", (req, res) => {
    const studentData = {
        studentNum: parseInt(req.body.studentNum),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA === "on",
        status: req.body.status,
        course: parseInt(req.body.course),
    };

    collegeData.updateStudent(studentData)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.status(500).send("Error updating student");
        });
});

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.error('Error initializing data:', err);
    });