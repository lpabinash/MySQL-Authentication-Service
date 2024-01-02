module.exports = validateRequest;
const isEmailValid=require("./validate-email")
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        isEmailValid(req.body.email).then(result=>{
            if(result){
                req.body = value;
                next();
            }else{
                next(`Validation error: email not valid`);
            }
        })
        
        
    }
}