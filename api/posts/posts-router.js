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
    GET	
    /api/posts/:id	
    Returns the post object with the specified id
*/
router.get('/:id', (req, res) =>{
    const notFoundMessage = { message: "The post with the specified ID does not exist" } 
    const errMessage = {message:'The post information could not be retrieved'}
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
    POST	
    /api/posts	
    Creates a post using the information sent inside the request body and returns the newly created post object
    
    post schema
  {
    title: "The post title", // String, required
    contents: "The post contents", // String, required
    created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
    updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}

*/
router.post('/', ( req, res ) =>{
    const newPost = req.body
    const isValid = 'title' in newPost && 'contents' in newPost   //  check for expected properties available
    const unCompleteMessage = { message: "Please provide title and contents for the post" } 
    const errMessage = {message:'There was an error while saving the post to the database'}
    if(isValid){
        db.insert(newPost)
        .then( result => res.status(201).json({...result, ...newPost}) )
        .catch( result => res.status(500).json(errMessage) )
    }else{
        res.status(400).json(unCompleteMessage)
    }  
})

/* 
    PUT	
    /api/posts/:id	
    Updates the post with the specified id using data from the request body and returns the modified document, not the original
*/
router.put('/:id', (req, res) =>{
    const notBodyMessage = { message: "Please provide title and contents for the post" } 
    const notFoundPost = { message: "The post with the specified ID does not exist" } 
    const errMessage = {message:'The post information could not be modified'}
    const {title, contents} = req.body
    const isOkBody = title != null && contents != null 
    // console.log(`title : ${title} -- contents : ${contents} ///// isOkBody : ${isOkBody} `)
    if(isOkBody){
        db.update(req.params.id, req.body)
        .then(result => {
            if( result != null ){
                res.status(200).json({id:parseInt(req.params.id), ...req.body})
            }else{
                res.status(404).json(notFoundPost)
            }
        })
        .catch(result => res.status(500).json(errMessage))
    }else{
        res.status(400).json(notBodyMessage)
    }
})


/* 
    DELETE
    //:id	
    Removes the user with the specified id and returns the deleted user.
*/
router.delete('/:id', (req, res) =>{
    const notFoundMessage = { message: "The post with the specified ID does not exist" } 
    const errMessage = {message:'The post could not be removed'}
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



module.exports = router;
