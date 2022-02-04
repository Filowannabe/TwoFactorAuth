const securityController = module.exports

const speakeasy = require('speakeasy')
const uuid = require('uuid')
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

const db = new JsonDB(new Config('mydb', true, false, '/'))

securityController.sayHi = (req, res, next) => res.json({ message: 'Welcome to my app' })

securityController.verify = (req, res, next) => {
    const { token, userId } = req.body
    try {
        const path = `/user/${userId}`
        const user = db.getData(path)

        const { base32: secret } = user.temp_secret

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        })

        if (verified) {
            db.push(path, { id: userId, secret: user.temp_secret })
            res.json({ verified: true })
        } else {
            res.json({ verified: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error validating' })
    }
}

securityController.validate = (req, res, next) => {
    const { token, userId } = req.body
    try {
        const path = `/user/${userId}`
        const user = db.getData(path)

        const { base32: secret } = user.secret

        const tokenValidates = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 0
        })

        if (tokenValidates) {
            res.json({ validated: true })
        } else {
            res.json({ validated: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error validating' })
    }
}

securityController.register = (req, res, next) => {
    const id = uuid.v4()
    try {
        const path = `/user/${id}`

        const temp_secret = speakeasy.generateSecret()
        db.push(path, { id, temp_secret })
        res.json({ id, secret: temp_secret.base32 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error generting secret' })
    }
}
