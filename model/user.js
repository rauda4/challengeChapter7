const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

function encrypt(password) {
  return bcrypt.hashSync(password, 10);
}

function checkPassword(incomingPassword, databasePassword) {
  return bcrypt.compareSync(incomingPassword, databasePassword);
}

async function register({ email, password }) {
    const encryptedPassword = encrypt(password);
    // if(!data) return Promise.reject("User not found!");
    console.log({ email, encryptedPassword });
    return await prisma.user.create({
      data: { email, password: encryptedPassword },
    });

  
}

async function login({ email, password }) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Promise.reject("User not found!");

    const isPasswordValid = checkPassword(password, user.password);
    if (!isPasswordValid) return Promise.reject("Wrong password");

    return user;
  
  } catch (error) { 
    return Promise.reject(error);
  }
}

async function findByPk(pk) {
  try {
    const user = await prisma.user.findUnique({ where: { id: pk } });
    console.log("findByPk.", { pk, user });
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

const SECRET_KEY = "private!@$~!@~!$~!@~!@";

function generateToken (user) {
  const payload = {
  id: user.id,
  email: user.email,
  }
  const token = jwt.sign(payload, SECRET_KEY)
  return token
  }

  function verifyToken(token) {
    const isVerified = jwt.verify(token, SECRET_KEY)
    console.log({isVerified})
    return isVerified;
  }
 

module.exports = { register, login, findByPk, generateToken, verifyToken };