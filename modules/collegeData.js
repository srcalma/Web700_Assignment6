const Sequelize = require('sequelize');
const sequelize = new Sequelize('pyptuwgl', 'pyptuwgl', '9sHMXzU8NlhhKTglP57p3pVu1u27tdnS', {
    host: 'stampy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER
});

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize
            .sync()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to sync the database");
            });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then((students) => {
                resolve(students);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                course: course,
            },
        })
            .then((students) => {
                resolve(students);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                studentNum: num,
            },
        })
            .then((students) => {
                resolve(students[0]);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then((courses) => {
                resolve(courses);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: {
                courseId: id,
            },
        })
            .then((courses) => {
                resolve(courses[0]);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;

        for (var prop in studentData) {
            if (studentData[prop] == "") {
                prop = null;
            }
        }

        Student
            .create({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            })
            .then(function (student) {
                resolve();
            })
            .catch(function (error) {
                reject("unable to create student");
            });

    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;

        for (var prop in studentData) {
            if (studentData[prop] == "") {
                prop = null;
            }
        }

        Student
            .update({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            }, {
                where: {
                    studentNum: studentData.studentNum
                }
            })
            .then(function (student) {
                console.log("Student update success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - UPDATE");
                reject("unable to update student");
            });
    });
};

module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {

        for (var key in courseData) {
            if (courseData[key] == "") {
                key = null;
            }
        }

        Course
            .create({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            })
            .then(function (course) {
                resolve();
            })
            .catch(function (error) {
                reject("unable to create course");
            });

    });
};

module.exports.updateCourse = function (courseData) {
    return new Promise(function (resolve, reject) {

        for (var prop in courseData) {
            if (courseData[prop] == "") {
                prop = null;
            }
        }

        Course
            .update({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            }, {
                where: {
                    courseId: courseData.courseId
                }
            })
            .then(function (course) {
                resolve();
            })
            .catch(function (error) {
                reject("unable to update course");
            });
    });
};

module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) {

        Course
            .destroy({
                where: {
                    courseId: id
                }
            })
            .then(function (course) {
                resolve();
            })
            .catch(function (error) {
                reject("unable to delete course");
            });
    });
};
module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {

        Student
            .destroy({
                where: {
                    studentNum: studentNum
                }
            })
            .then(function (student) {
                resolve();
            })
            .catch(function (error) {
                reject("unable to delete student");
            });
    });
};