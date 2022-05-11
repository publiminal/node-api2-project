// implement your posts router here
const express = require('express');
const router = express.Router();
const db = require('./posts-model') 
// server.use('/api/posts', postsRouter)

/* 
    GET	
    /api/posts	
    Returns an array of all the post objects contained in the database
*/
router.get('/', (req, res) => {
    const errMessage = {message:'The posts information could not be retrieved'}
    db.find()
    .then(result => res.status(200).json(result))
    .catch(result => res.status(500).json(errMessage))
})

/* 
    POST
    /	
    Creates a post using the information sent inside the request body.
    Validate new post Object is properlt sent against schema . 
    TODO : validate empy values sent ?
*/
router.post('/', ( req, res ) =>{
    const newUser = req.body
    const isValid = 'name' in newUser && 'bio' in newUser // check for both properties available
    const unCompleteMessage = { message: "Please provide name and bio for the user" } 
    const errMessage = {message:'There was an error while saving the user to the database'}
    if(isValid){
        db.insert(newUser)
        .then( result => res.status(201).json(result) )
        .catch( result => res.status(500).json(errMessage) )
    }else{
        res.status(400).json(unCompleteMessage)
    }  
})


/* 
    GET	
    //:id	
    Returns the user object with the specified id. 
*/
router.get('//:id', (req, res) =>{
    const notFoundMessage = { message: "The user with the specified ID does not exist" } 
    const errMessage = {message:'The users information could not be retrieved'}
    db.findById(req.params.id)
    .then(result => {
        if( result != null ){
            res.status(200).json(result)
        }else{
            res.status(404).json(notFoundMessage)
        }
    })
    .catch(result => res.status(500).json(errMessage))
})

/* 
    DELETE
    //:id	
    Removes the user with the specified id and returns the deleted user.
*/
router.delete('//:id', (req, res) =>{
    const notFoundMessage = { message: "The user with the specified ID does not exist" } 
    const errMessage = {message:'The user could not be removed'}
    db.remove(req.params.id)
    .then(result => {
        if( result != null ){
            res.status(200).json(result)
        }else{
            res.status(404).json(notFoundMessage)
        }
    })
    .catch(result => res.status(500).json(errMessage))
})

/* 
    PUT
    //:id	
    Updates the user with the specified id using data from the request body. Returns the modified user
*/
router.put('//:id', (req, res) =>{
    const notBodyMessage = { message: "Please provide name and bio for the user" } 
    const notFoundUser = { message: "The user with the specified ID does not exist" } 
    const errMessage = {message:'The user information could not be modified'}
    const {name, bio} = req.body
    const isOkBody = name != null && bio != null 
    // console.log(`name : ${name} -- bio : ${bio} ///// isOkBody : ${isOkBody} `)
    if(isOkBody){
        db.update(req.params.id, req.body)
        .then(result => {
            if( result != null ){
                res.status(200).json(result)
            }else{
                res.status(404).json(notFoundUser)
            }
        })
        .catch(result => res.status(500).json(errMessage))
    }else{
        res.status(400).json(notBodyMessage)
    }
})


module.exports = router;
