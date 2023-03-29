const passport = require('passport')
const { login, findByPk } = require('../model/user')
const LocalStrategy = require('passport-local').Strategy


async function authenticate(email, password, done) {
    try {
     const user = await login({ email, password })
     return done(null, user)
    }
    catch(err) {
     return done(null, false, { message: err.message })
    }
}
    
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' }, authenticate)
    )
    

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => done(null, await findByPk(id)))

    module.exports = passport