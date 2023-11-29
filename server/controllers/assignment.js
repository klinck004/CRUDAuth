/*CRUD route file*/
let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();

// Assignment model connection
let Assign = require('../models/assignment'); /* use Assignment model defined in models folder */
console.log("2. Assignment DB controller loaded!"); /* for dev peace of mind */


/*Read*/
module.exports.displayList = async (req, res, next) => {
    try {
        const AssignList = await Assign.find();
        res.render('CRUD/list', {
            title: 'Assignment List',
            AssignList: AssignList,
            displayName: req.user ? req.user.displayName:''
        });
    } catch (err) {
        console.error(err);
        res.render('/error', {
            error: 'Error on server'
        });
    }
};

/*Create */
/*Get route*/
module.exports.displayCreate = async (req, res, next) => {
    res.render('CRUD/add', {
        title: 'Add New Assignment',
        displayName: req.user ? req.user.displayName:''
    })
};

/*Post route*/
module.exports.runCreate = async (req, res, next) => {
    let newAssign = Assign({
        "name": req.body.name,
        "class": req.body.class,
        "due": req.body.due,
        "notes": req.body.notes,
        "mark": req.body.mark,
        "weight": req.body.weight,
    });
    Assign.create(newAssign)
        .then(() => {
            res.redirect('/list');
        })
        .catch((err) => {
            console.log("LOG: Add POST error:");
            console.log(err)
            res.render('error', {
                error: 'Add POST error:'
            });
        });
};

/*Update*/
/*Get route*/
module.exports.displayUpdate = async (req, res, next) => {
    try {
        let id = req.params.id;
        let assignToEdit = await Assign.findById(id)
        res.render('CRUD/edit', {
            nameAssign: assignToEdit.name,
            title: 'Edit Assignment',
            id: id,
            assignToEdit: assignToEdit,
            displayName: req.user ? req.user.displayName:''
        });
        console.log("LOG: Assignment to edit:");
        console.log(assignToEdit);
    } catch (err) {
        console.log("LOG: Update GET error:");
        console.log(err)
        res.render('error', {
            error: 'Update GET error'
        });
    }
}

/*Post route*/
module.exports.runUpdate = async (req, res, next) => {
    let id = req.params.id;
    let updateAssign = Assign({
        "_id": id,
        "name": req.body.name,
        "class": req.body.class,
        "due": req.body.due,
        "notes": req.body.notes,
        "mark": req.body.mark,
        "weight": req.body.weight,
    });
    console.log(id),
    console.log("Post");
    console.log(updateAssign);
    Assign.updateOne({_id: id}, updateAssign)
        .then(() => {
            res.redirect('/list');
        })
        .catch((err) => {
            console.log("LOG: Update POST error:");
            console.log(err)
            res.render('error', {
                error: 'Update POST error'
            });
        });
}

/*Delete*/
/*Get route*/
module.exports.runDelete = async (req, res, next) => {
    let id = req.params.id;
    Assign.deleteOne({ _id: id }).then(() => {
        res.redirect('/list');
    })
        .catch((err) => {
            console.log("LOG: Delete GET error:");
            console.log(err)
            res.render('./error', {
                error: 'Delete GET error'
            });
        })
}

/*View single item*/
/*Get route*/
module.exports.displayShow = async (req, res, next) => {
    try {
        let id = req.params.id;
        console.log("Show GET:");
        console.log(id);
        const assignToShow = await Assign.findById(id)
        res.render('CRUD/show', {
            title: 'View Assignment',
            id: id,
            assignToShow: assignToShow,
            displayName: req.user ? req.user.displayName:''
        });
    } catch (err) {
        console.log("LOG: Show GET error:");
        console.log(err)
        res.status(500).send;
        res.render('error', {
            error: 'Show GET error'
        });
    }
}

/*Post notes update*/
module.exports.runShow = async (req, res, next) => {
    let id = req.params.id;
    console.log("Show POST:");
    console.log(req.body)
    console.log(id);
    try {    Assign.updateOne({ _id: id }, updateAssign)
        .then(() => {
            res.redirect('/list/show/' + id);
        })
        .catch((err) => {
            console.log("LOG: Show POST error:");
            console.log(err)
            res.status(500).send({ message: 'Show POST error' });
            res.render('error', {
                error: 'Show POST error'
            });
        });
        let updateAssign = Assign({
            "_id": id,
            "name": req.body.name,
            "class": req.body.class,
            "due": req.body.due,
            "notes": req.body.notes,
            "mark": req.body.mark,
            "weight": req.body.weight,
        })
        Assign.updateOne({ _id: id }, updateAssign)
        .then(() => {
            res.redirect('/list/show/' + id);
        })
        .catch((err) => {
            console.log("LOG: Show POST error:");
            console.log(err)
            res.status(500).send({ message: 'Show POST error' });
            res.render('error', {
                error: 'Show POST error'
            });
        });
    }
    catch (err) {
        console.log("LOG: Show POST error:");
        console.log(err)
        res.render('error', {
            error: 'Show POST error'
        });
    }

}

module.exports.displayErr = (err, req, res, next) => {
    res.render('error', {
        error: err,
    });
}
