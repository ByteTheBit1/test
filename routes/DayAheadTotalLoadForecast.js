const express = require('express');
const router = express.Router();

//GET METHOD route
router.get('/',(req,res,next)=>{
    req.status(200).json({

    });
});

//POST METHOD route
router.post('/',(req,res,next)=>{
    res.status(201).json({

    });
});

// PATCH method route
router.patch('/',  (req, res,next) =>{
    res.status(200).json({
  });
});

//DELETE METHOD route
router.delete('/', (req,res,next)=>{
    res.status(200).json({
    });
});


module.exports = router;