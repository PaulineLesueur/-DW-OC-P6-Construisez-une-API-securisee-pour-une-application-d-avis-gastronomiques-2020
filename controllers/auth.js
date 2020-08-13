const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

const User = require('../models/User');

let passwordValidity = new passwordValidator();

passwordValidity
.is().min(8) // le mdp doit contenir au moins 8 caractères
.is().max(16) // le mdp peut contenir au maximum 16 caractères
.has().uppercase() // le mdp doit contenir au moins une majuscule
.has().lowercase() // le mdp doit contenir au moins une minuscule
.has().digits(1) // le mdp doit contenir au moins un chiffre
.has().symbols(1) // le mdp doit contenir au moins un symbole spécial
.has().not().spaces() // le mdp ne doit pas contenir d'espace

exports.signup = (req, res, next) => {
    if (!emailValidator.validate(req.body.email) || !passwordValidity.validate(req.body.password)) {
        throw { error: "Vous devez fournir une adresse email et un mot de passe valide !" };
    } else if (emailValidator.validate(req.body.email) && passwordValidity.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonWebToken.sign(
                            { userId: user._id },
                            'RANDOM_SECRET_KEY',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};