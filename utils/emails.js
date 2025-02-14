import { htmlToText } from "html-to-text";
import path from 'path'

import ejs from'ejs';
import nodemailer from 'nodemailer';

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Email{
    #templateUrl = path.join(__dirname, '../views/')
    
    constructor (customer, ward){
        this.to = customer.email;
        this.customer_first = customer.first_name;
        this.customer_last = customer.last_name;
        this.ward_first = ward.wf_nm;
        this.ward_last = ward.wl_nm;
        this.from = `${process.env.EMAIL_FROM}`;
    }

    createMailTransport(){
        if (process.env.NODE_ENV = 'production'){
            return nodemailer.createTransport({
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525,
                secure:false,
                auth:{
                    // user: process.env.MAILTRAP_USER,
                    // pass: process.env.MAILTRAP_PASS
                    user: 'marco.duhaney2023@gmail.com',
                    pass: '5064006duhaney'
                }
            });
        }else{
            return nodemailer.createTransport({
                host: 'mail.somedomain.com',
                port: 465,
                secure:true,
                auth:{
                    // user:process.env.EMAIL_USER,
                    // pass:process.env.EMAIL_PASS
                }
            })
        }
    }
    // createMailTransport(){
    //         return nodemailer.createTransport({
    //             host: 'mail.somedomain.com',
    //             port: 465,
    //             secure:true,
    //             auth:{
    //                 user:process.env.COPY_EMAIL,
    //                 // pass:'5064006duhaney
    //             }
    //         })
    // }

    async sendMail(template, subject){
        const transport = this.createMailTransport();
        const html = await ejs.renderFile(this.#templateUrl + template + '.ejs',{
            subject:subject,
            customer_name:this.customer_first + ' ' + this.customer_last,
            ward_name: this.ward_first + ' ' + this.ward_last
        });
        console.log(JSON.stringify(this.customer_first))
        return await transport.sendMail({
            // to: `${this.to}, $process.env.COPY_MAIL `,
            to: `${this.to}, ${process.env.COPY_EMAIL}`,
            // to: `${this.to}, ${process.env.COPY_MAIL} `,
            // to: process.env.COPY_MAIL ,
            from: `${this.from}`,
            subject:subject,
            html:html,
            text:htmlToText(html)
        });
    }
}