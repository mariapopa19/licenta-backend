const express = require('express')
const {check, body} = require('express-validator')
const Utilizator = require('../models/utilizatori')

const router = express.Router();

router.get('/login')
router.get('/signup')

router.post('/login')
router.post('/signup')