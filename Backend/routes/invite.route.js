import express from 'express';

import {
    sendInvite, 
    getReceivedInvites, 
    getSentInvites, 
    acceptInvite, 
    rejectInvite, 
    deleteInvite,
    getContacts } from '../controllers/invite.controller.js';

    import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send' , protectRoute , sendInvite);
router.get('/received' , protectRoute , getReceivedInvites);
router.get('/sent' , protectRoute , getSentInvites);
router.put('/:id/accept' , protectRoute , acceptInvite);
router.put('/:id/reject' , protectRoute , rejectInvite);
router.delete('/:id' , protectRoute , deleteInvite);
router.get('/contacts' , protectRoute , getContacts);


export default router ; 
