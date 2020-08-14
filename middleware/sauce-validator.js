const validate = require('mongoose-validator');

exports.nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Le nom de la sauce doit contenir entre 3 et 50 caractères',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\s]+$/i,
        message: "Le nom de votre sauce ne peut contenir que des lettres",
    })
];

exports.manufacturerValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: "Le nom du fabriquant de la sauce doit contenir entre 3 et 30 caractères",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\-_\d\s]+$/i,
        message: "Le nom du fabriquant de votre sauce ne peut contenir que des lettres et des chiffres",
    })
];

exports.descriptionValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 150],
        message: "La description de la sauce doit contenir entre 10 et 150 caractères",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\d\s]+$/i,
        message: "La description de votre sauce ne peut contenir que des lettres et des chiffres",
    })
];

exports.mainPepperValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: "Le nom de l'ingrédient principal de votre sauce doit contenir entre 3 et 20 caractères",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\s]+$/i,
        message: "Le nom de l'ingrédient principal de votre sauce ne peut contenir que des lettres",
    })
];