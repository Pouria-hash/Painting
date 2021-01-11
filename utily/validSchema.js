const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.paintingSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required(),
    image: Joi.string(),
    deleteImage: Joi.array()
})


module.exports.reviewSchema = Joi.object({
    rate: Joi.number().required().min(1).max(5),
    text: Joi.string().required().escapeHTML()
})