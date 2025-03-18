import {body} from 'express-validator';

const validationSchema = () => {
        return [body('title')
                        .notEmpty()
                        .withMessage('title is Required')
                        .isLength({min: 2})
                        .withMessage("Title Must Have At Least 2 Characters"),
                body('price')
                        .notEmpty()
                        .withMessage('Price Is Required')
                ]
}

export {validationSchema}