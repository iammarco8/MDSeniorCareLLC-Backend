import { pool } from "../data/database.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs/dist/bcrypt.js";

function signJWTToken(user){
    return JWT.sign({
        id: user.id,
        username: user.usrnm,
        password: user.pass
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

async function userExsist(username){
    const [user]=await pool.query(
        'SELECT * FROM user WHERE username = ?',
    [username]);
    if(user.length > 0){
        return true;
    }else{
        return false;
    }
}

export const createUser = async(req,res,next)=>{
    const vDate = new Date();
  const sqlQuery = `INSERT INTO user(
      username, password
      )
      VALUES
      (?,?);`;
  if (await userExsist(req.body.usrnm)){
      res.status(400).json({
          status:'error',
          message:'User exsists'
      })
      return;
  }
  req.body.pass = await bcrypt.hashSync(req.body.pass)
  const [user] = await pool.query(sqlQuery,
      [req.body.usrnm, req.body.pass]
  );
  if (user.insertId > 0){
      const token = signJWTToken({
          id: user.insertId
      })
      res.status(201).json({
          status:'success',
          message:'user made',
          id:user.insertId,
          data:{
              token,
              user:req.body
          }
      })
  }else{
      res.status(404).json({
          status:'error',
          message:'check the data entered'
      });
  }
}

export const loginUser = async(req,res,_next)=>{
    const [user] = await pool.query(`
        SELECT * FROM user WHERE username = ?`,
    [req.body.usrnm]);
    if(!user.length){
        return res.status(404).json({
            status:'error',
            message:'No user found'
        })        
    }else if(!(await bcrypt.compare(req.body.pass, user[0].password))){
        return res.status(404).json({
            status:'error',
            message:'Please Check credentials'
        });
    }else{
        const token = signJWTToken(user[0]);
        user[0].pasword = undefined;
        res.status(200).json({
            status:'success',
            data:{
                token,
                user:user[0]
            }
        })
    }
}

export const protectUser = async(req,res, next)=>{
    const authorization = req.get('Authorization');
    console.log(`REQUEST PROTECT FUNCTION OBJECT ${JSON.stringify(req.headers)}`);
    console.log(`REQUEST AUTHORIZATION >> ${authorization}`);
    if(!authorization?.startsWith('Bearer')){
        return next(
            res.status(400).json({
                status:'error',
                message:'Cannot accsess without logging in'
            })
        )
    }
    const token = authorization.split(' ')[1];
    console.log(`TOKEN IS: ${token}`)
    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED TOKEN: ${JSON.stringify(decoded)}`);
        const [user] = await pool.query(`SELECT * FROM user WHERE id = ?`,[decoded.id])
        if(!user.length){
            return next(
                res.status(404).json({
                    status:'error' ,
                    message:'User no longer valid'
                }) 
            );
        }
        console.log(`user[0]${JSON.stringify(user[0])}`);
        const data = user[0];
        data.password = undefined;
        req.user = data;
        next();
    }catch(error){
        console.log(error.message)
        if(error.message){
            return next(
                res.status(400).json({
                    status:'error',
                    message:'token expired'
                })
            );
        }else if(error.message == 'jwt malformed'){
            return next(
                res.status(400).json({
                    status:'error',
                    message:'token malformed'
                })
            );
        }else if(error.message == 'invalid token'){
            return next(
                res.status(400).json({
                    status:'error',
                    message: 'token is invalid'
                })
            );
        }else{
            return next(
                res.status(400).json({
                    status:'error',
                    message:'Unknown Error...'
                })
            );
        }
    }
}

export const mainUser = async (req,res, _next)=>{
    const admin = req.user;
    if (!admin){
        console.log(`no user`)
        return next();
    }
    admin.password=undefined;

    let strQuery = `SELECT * FROM user WHERE id = ?`
    const [user]= await pool.query(strQuery, [admin.id]);
    if (!user.length){
        return res.status(401).json({
            status:'error',
            message:'Invalid request'
        });
    }
    _next();
    user[0].password= undefined;
    return res.status(200).json({
        status:'success',
        data:{
            user:user[0]
        }
    });
}