import { setInterval } from 'timers/promises';
import { pool } from '../data/database.js';

// email imports
// import { Email }from '../utils/emails.js'

// customer newsletter sign up function. 
// should be used for emailing apppointment requests and posting reviews

export const createFullClient = async(req, res, next)=>{
    const sql = `INSERT INTO full_client
    (
    wf_nm
    , wl_nm
    , wloc
    , wphn
    , rtc
    , f_nm
    , l_nm
    , email
    )
    VALUES
    (?,?,?,?,?,?,?,?)`
    const nEntry = pool.query(sql,
        [
            req.body.wf_nm, req.body.wl_nm, req.body.wloc, req.body.wphn, 
            req.body.rtc, req.body.f_nm, req.body.l_nm, req.body.email
        ]
    )
    if(nEntry.insertID <=0){
        res.status(400).json({
            status:'error',
            message:'Check information and try again'
        })
    }else{
        res.status(201).json({
            status:'success',
            message: 'data logged'
        })
    }
}

export const createShortCust = async(req, res,next)=>{
    const sql = ` INSERT INTO customer
    (
    first_name
    , last_name
    , email
    , ward
    )
    VALUES
    (?,?,?,?) `
    // const nCustomer = await setInterval(pool.query(sql,
    const nCustomer = await pool.query(sql,
        [
            req.body.f_nm, req.body.l_nm, req.body.email,
            req.body.ward
        ]
    )
    // , 10000)
    if(nCustomer.insertID <= 0){
        res.status(400).json({
            status: 'error',
            message:'Please Review all the feilds'
        })
    }else{
        res.status(201).json({
            status:'success',
            message:'Great! Looking forward to out time with you.',
            // id:nCustomer[0].insertID,
            dataCustomer:{
                custID:nCustomer[0].insertId
            }
        })

        console.log(nCustomer[0].insertId)
        // const data = nCustomerData
        // const email =new Email(user[0], data)
        // await email.sendMail('emails', 'Thank you for Choosing MD Senior Care LLC')
    }

}

// creating the customer (feature for future improvements)
export const createCustomer = async(req, res, next) =>{
    const sql =`INSERT INTO customer
    (
    first_name
    , last_name
    , email
    , ward
    , password
    , reviews
    ) 
    VALUES
    (?,?,?,?,?,?);`
    const nCustomer = await pool.query( sql,
        [
            req.body.f_nm, req.body.l_nm, req.body.eml, 
            req.body.pass, req.body.rev
        ]
    )
}

// Read function for customer info
export const singleCustomer = async(req,res,next) =>{
    const id = req.params.id;
    const [customer] = await pool.query(
        `SELECT * FROM customer WHERE id = ?`,[id])
    if (customer.length > 0 ){
        res.status(200).json({
            status:'success',
            results: 'customer.length',
            data:{customer:customer[0]}
        });
    }else{
        res.status(404).json({
            status: 'error',
            message:'customer does not exist'
        });

    }
}

// Edit function for customers
export const updateCustomerName = async(req, res, next) =>{
    const id = req.params.id;
    const etask = await pool.query(`
        UPDATE customer
        SET f_nm = ?, l_nm = ?
        WHERE id = ?`,
    [req.body.f_nm, req.body.l_nm, id])
    if (eCustomer.affectdRows = 0){
        res.status(400).json({
            status: 'error',
            message:'Seems there was a problem',
        });
    }else{
        res.status(202).json({
            status:'success',
            affectedRows:eCustomer.affectedRows
        });
    }
    // emails for updates should be placed here
}

//Delete function for removal.
export const deleteCustomer = async(req, res, next)=>{
    const id = req.params.id;
    const dCustomer = await pool.query(`DELETE FROM customer WHERE id = ?`, [id])

    if (dCustomer.affectedRows = 0){
        res.status(400).json({
            status:'error',
            message:'Unable to delete Data'
        });
    }else{
        res.status(200).json({
            status:'success',
            message:'data delete'
        })
    };
}

export const fullClientList = async(req,res,_next)=>{
    const [customer] = await pool.query(
        `SELECT * FROM full_client`)
    if (customer.length > 0 ){
        res.status(200).json({
            status:'success',
            results: 'customer.length',
            data:{customer:customer}
        });
    }else{
        res.status(404).json({
            status: 'error',
            message:'customer does not exist'
        });

    }
}