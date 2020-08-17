const validate = require('mongoose-validator');

exports.nameValidator = [ //validation for the sauce name
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: "The sauce name has to be between 3 and 50 characters",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\s]+$/i,
        message: "You only can use letters to name your sauce",
    })
];

exports.manufacturerValidator = [ //validation for the manufacturer name
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: "The manufacturer name has to be between 3 and 50 characters",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\-_\d\s]+$/i,
        message: "You only can use letters and numbers to name the manufacturer",
    })
];

exports.descriptionValidator = [ //validation for the sauce description
    validate({
        validator: 'isLength',
        arguments: [3, 150],
        message: "The description has to be between 3 and 150 characters",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\d\s]+$/i,
        message: "You only can use letters and numbers for the sauce description",
    })
];

exports.mainPepperValidator = [ //validation for the main pepper
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: "The main pepper has to be between 3 and 20 characters",
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\s]+$/i,
        message: "You only can use letters for the main pepper",
    })
];