const express = require('express');
const {Schema, model} = require('mongoose')




const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    }
})


module.exports = model('User', UserSchema, 'users')


