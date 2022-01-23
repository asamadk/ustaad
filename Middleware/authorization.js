const Role = require('../Models/Role');

const verifyRole =   (allowedrole) => {
    return (req,res,next) => {
        if(!req.userData.roleId){
            return res.status(401).json({message : 'Unauthorized'})
        }
        let flag = false;
        Role.findById(req.userData.roleId)
        .then(role => {
            if(role.name == allowedrole){
                flag = true;
                next();
            }else{
                res.json({message : 'Unauthorized'})
            }
        }).catch(err => {
            console.log(err)
        })
    }
}

module.exports = verifyRole;