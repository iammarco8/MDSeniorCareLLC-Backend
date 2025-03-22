import { pool } from "../data/database.js";
import { Email } from "../utils/emails.js";
// import { Email } from "../utils/emails.js";

// Customers should have a ward in order to sign up

// Ward creation.
export const createWard = async(req, res, next)=>{
    const sql = `INSERT INTO ward
    (
     customer
    , first_name
    , last_name
    , location
    , phone_number
    ,r_to_customer)
    VALUES
    (?,?,?,?,?,?);`
    const nWard = await pool.query(sql,
        [
            req.body.wCustId, req.body.wf_nm, req.body.wl_nm, 
            req.body.wloc, req.body.wphn, req.body.rtc
            
        ]
    )

    

    // console.log('this is the ward id ' + JSON.stringify(wardID)) 
    
    if(nWard.insertId <= 0){
        res.status(400).json({
            status:'error',
            message:'Please review all the information given'
        });
        
    }else{
        const wardID = await pool.query(
            `SELECT id FROM ward WHERE id = ?;` , [nWard[0].insertId]
        )
        // console.log(nWard[0].insertId)
        console.log(wardID[0][0].id)
        res.status(201).json({
            status:'success',
            message:"Their care is our priority",
            // POST cnflicts with the GET functions required for dat return and transferance
            dataWard:{
                wardID: nWard[0].insertId,
                ward:wardID[0][0]
            }
        });
        const ward = req.body;
        const customer = await pool.query(`SELECT * FROM customer WHERE id= ?`,[req.body.wCustId])
        // console.log(JSON.stringify(customer[0][0].email))
        const email = new Email(customer[0][0], ward)
        await email.sendMail('signUpEmail', 'Sign Up confirmation')
    }
    
}


// Read function for the wards
export const getSingleWard = async(req,res,next)=>{
    const id = req.params.id
    const sql = `SELECT * FROM ward WHERE id = ?`
    const [ward]= await pool.query(sql,[id])
    if (ward.length > 0){
        res.status(200).json({
            status:'success',
            results:ward.length,
            data:{ward:ward[0]}
        });
    }else{
        res.status(404).json({
            status:error,
            message:'This ward does not exist'
        });
    }
}

// Edit function for the ward info
export const updateWard = async(req, res, next)=>{
    const id = req.params.id;
    const eWard = await pool.query(`
        UPDATE ward
        SET first_name = ?, last_name = ?,
        location = ?, phone_number = ?,
        WHERE id = ?
        `,
    [
        req.body.up_ward_first, req.body.up_ward_last,
        req.body.up_ward_loc, req.body.up_ward_phn
    ])
    if (eWard.affectedRows = 0 ){
        res.status(400).json({
            status:'error',
            message:'Ward was not updated'
        });
    }else{
        res.status(202).json({
            status:'success',
            message:'Ward changed successfully',
            affectedRows:eWard.affectedRows
        });
        // emails
    }
}

// Ward removal function
export const deleteWard = async(req, res, next)=>{
    const id = req.params.id;
    const dWard = await pool.query(`DELETE FROM ward WHERE id = ?`, [id])

    if(dWard.affectedRows = 0){
        res.status(400).json({
            status:'error',
            message: 'Unable to delete ward'
        });
    }else{
        res.status(200).json({
            status:'succes',
            message:'Ward deleted'
        });
    };
}