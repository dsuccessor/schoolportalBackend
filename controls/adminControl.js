const adminModel = require('../models/adminModel')

const createAdmin = async (req, res)=>{
    const {surname, otherName, email, passport, password, role} = req.body

    const checkIfExist = await adminModel.findOne({email})
    if (checkIfExist){
            res.status(401).json({"msg": `User with ${email} already exist`, checkIfExist})
    }
    else{
        await adminModel.create({surname, otherName, email, passport, password, role}, (err, data)=>{
                if (err) {
                    console.log({msg: 'Registeration failed ', err});
                    res.status(400).json({msg: "Registeration failed", err})
                }
                else{
                    console.log({msg: 'Registeration successful ', data});
                    res.status(200).json({msg: "Registeration successful", data})
                }
                })
            }
            }
    
const fetchAllAdmin = async (req, res) => {
        adminModel.find({}, (error, response)=>{
            if (error) {
                console.log({msg: 'Record not found ', error});
                res.status(400).json({msg: "Record not found", error})
            }
            else{
                console.log({msg: 'Record fetched ', response});
                res.status(200).json({msg: "Record fetched", response})
            }
        })
}

const fetchAdmin = async (req, res) => {
    const {email} = req.body
    adminModel.findOne({email: email}, (error, result)=>{
         if (result == null) {
             console.log({msg: `Record with ${email} not found `, error});
             res.status(400).json({msg: `Record with ${email} not found `, error})
         }
         else{
             console.log({msg: `Record fetched for ${email} `, result});
             res.status(200).json({msg: `Record fetched for ${email} `, result})
         }
     })
}

const updateAdmin = async (req, res) => {
    const {email} = req.params
     adminModel.findOneAndUpdate({email: email}, req.body, {new: true, runValidators: true}, (error, result)=>{
         if (error) {
             console.log({msg: `Failed to update record with ${email} `, error});
             res.status(400).json({msg: `Failed to update record with ${email} `, error})
         }
         else{
             console.log({msg: `Record found and updated for ${email} `, result});
             res.status(200).json({msg: `Record found and updated for ${email} `, result})
         }
     })
}

const delAdmin = async (req, res) => {
    const {email} = req.params
     adminModel.findOneAndDelete({email: email}, (error, result)=>{
         if (error) {
             console.log({msg: `Failed to delete record with ${email} `, error});
             res.status(400).json({msg: `Failed to delete record with ${email} `, error})
         }
         else{
             console.log({msg: `Record found and deleted for ${email} `, result});
             res.status(200).json({msg: `Record found and deleted for ${email} `, result})
         }
     })
}






module.exports = {createAdmin, fetchAllAdmin, fetchAdmin, updateAdmin, delAdmin}