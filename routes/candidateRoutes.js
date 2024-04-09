const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');

const {jwtAuthMiddleware, generateToken} = require('../jwt');

// This function will check the given token is of admin or not.. cuz only admin can add or delete candidate
const checkAdminRole = async(userId) =>{
  try {
    const user = await User.findById(userId);
    if(user.role === 'admin'){
      return true;
    }
  }catch (error) {
    return false;}
}

// Post route to add a new candidate
router.post('/',jwtAuthMiddleware, async(req, res) => {
  try {
    if(!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({message: "User does not have admin role"});
    }
    const candidateData = req.body   // req body contains candidate data
    const newCandidate = new Candidate(candidateData);
    const response = await newCandidate.save();  // save the new candidate to tha database
    console.log('Candidate data Saved');
    res.status(200).json({response: response});
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// router to update Candidate data
router.put('/candidateId',jwtAuthMiddleware, async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id)) {
      return res.status(403).json({message: "User has not admin role"});
    }
    
    const candidateId = req.params.candidateId; // Extract the id from the URL parameter
    const updatedCandidateData = req.body; // Updated data for the candidate

    const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
      new: true, // Return the updated document
      runValidators: true // Run Mongoose Validation
    })

    if(!response) 
      return res.status(404).json({error: "Candidate Not Found"});

      console.log('Candidate Updated');
      res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// router to Delete Candidate
router.delete('/:candidateId',jwtAuthMiddleware, async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id)) {
      return res.status(403).json({message: "User has not admin role"});
    }
    
    const candidateId = req.params.candidateId; // Extract the id from the URL parameter

    const response = await Candidate.findByIdAndDelete(candidateId);

    if(!response) 
      return res.status(404).json({error: "Candidate Not Found"});

      console.log('Candidate Deleted');
      res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// lets start Voting
router.put('/vote/:candidateId', jwtAuthMiddleware, async (req, res) =>{
  // No Admin can vote
  // User can only vote once
   candidateId = req.params.candidateId;
   userId = req.user.id;
  try {
    // find the candidate document with the specified candidateId
    const candidate = await Candidate.findById(candidateId);
    if(!candidate)
      return res.status(404).json({message: 'Candidate not found'});
    
    const user = await User.findById(userId);
    if(!user)
      return res.status(404).json({message: 'User not found'});    
    if(user.role === 'admin')
      res.status(400).json({message: 'Admin is not allowed'});
    if(user.isVoted)
      res.status(400).json({message: 'You have already voted'});

    // Update the Candidate document to record the vote
    candidate.votes.push({user: userId})
    candidate.voteCount++;
    await candidate.save();

    // Update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({message: "You have Voted Successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Vote count
router.get('/vote/count', async(req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidate = await Candidate.find().sort({voteCount: 'desc'});

    // Map the candidates to only return their name and voteCount
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount
      }
    })

    return res.status(200).json(voteRecord);

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Route to get all the candidate List
router.get('/', async (req, res) => {
  try {
    // Find all candidates and select only the name and party fields, excluding _id
    const candidates = await Candidate.find({}, 'name party -_id');

    // Return the list of candidates
    res.status(200).json(candidates);

    console.log('Data Fetched');
    return res.status(200).json(name);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

module.exports = router
