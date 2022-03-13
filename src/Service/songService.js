const { Pool } = require('pg')
const {nanoid} = require('nanoid')
const NotFoundError = require('../exception/NotFoundError');
const InvariantError = require('../exception/InvariantError');
require('dotenv').config()


class songService{
    constructor(){
        db=pool()
    }

    
}

