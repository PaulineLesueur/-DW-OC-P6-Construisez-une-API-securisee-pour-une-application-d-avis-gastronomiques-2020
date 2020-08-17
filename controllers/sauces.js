const Sauce = require('../models/Sauce');
const fs = require('fs'); //used to modify the file system

exports.getAllSauces = (req, res, next) => { //fetchs all the sauces in the database and show them on the main page
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //loads informations when we select a specific sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => { //enable sauce creation on the database
    const sauceObject = JSON.parse(req.body.sauce); //get the informations inside the inputs
    delete sauceObject._id; 
    const sauce = new Sauce({ //the input values are put into an item, using the schema we created in .//models/Sauce.js
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce created successfully !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => { //enable sauce modification
    const sauceObject = req.file ? //get all the informations of a selected sauce
        { 
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //we push the updated informations into the database
        .then(() => res.status(200).json({ message: 'Sauce updated successfully !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => { //enable sauce deletion
    Sauce.findOne({ _id: req.params.id }) //we select the id of the sauce we want to delete
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { //delete the sauce image from the database
                Sauce.deleteOne({ _id: req.params.id }) //delete the sauce informations
                .then(() => res.status(200).json({ message: 'Sauce deleted successfully !'}))
                .catch(error => res.status(400).json({ error }));               
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => { //allow users to like/dislike/unlike/undislike sauces
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) { //we use switch to list the 4 cases easily
                case 1 : //if the user like the sauce
                    if (!sauce.usersLiked.includes(req.body.userId)) { //and he hasn't liked the sauce yet
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'You liked the sauce !'}))
                            .catch(error => res.status(400).json({ error }));
                    } // add a like and push the userID into the usersLiked array
                    break;

                case -1 : //if the user dislike the sauce
                    if (!sauce.usersDisliked.includes(req.body.userId)) { //and he has'nt liked the sauce yet
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'You disliked the sauce !'}))
                            .catch(error => res.status(400).json({ error }));
                    } //add a dislike and push the userID into the usersDisliked array
                    break;
                    
                case 0 :
                    if (sauce.usersLiked.includes(req.body.userId)) { //if the user has already liked the sauce
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id }) //upon clicking, the like is cancelled and the userId is removed from the usersLiked array
                            .then(() => res.status(200).json({ message: 'Like cancelled !'}))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) { //if the user has already disliked the sauce
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id }) //upon clicking, the dislike is cancelled and the userId is removed from the usersDisliked array
                            .then(() => res.status(200).json({ message: 'Dislike cancelled !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                default : //if none of this options are true, an error message will appear
                    throw { error };
            }
        })
        .catch(error => res.status(400).json({ error }));
};