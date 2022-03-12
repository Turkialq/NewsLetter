const express = require('express');
const body = require('body-parser');
const requestt = require('request');
const https = require('https');

const app = express();

const mailchimp = "8e9b7f95ea7daf269dafdf2ef5e9ae82-us14";
const listID = "1d0bdc926b";

app.use(express.static('public'));
app.use(body.urlencoded({extended: true}));

// create jason data to send to the api
app.post("/failure.html", (req, res) =>{
    res.redirect("/");
});

app.get("/", (req,res) => {

    res.sendFile( __dirname +"/signup.html" );
});


app.post("/", (req,res) => {

    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }

            }
        ]
    };

    const jasonData = JSON.stringify(data);

    const mailchimpURL = 'https://us14.api.mailchimp.com/3.0/lists/'+listID;

    const options = {
        method: 'POST',
        auth: 'turki:8e9b7f95ea7daf269dafdf2ef5e9ae82-us14'
    }

    const request = https.request(mailchimpURL, options, response => {
                        response.on("data",(data) => {
                            console.log(JSON.parse(data));
                        })

                        if(response.statusCode == 200){
                            res.sendFile(__dirname+"/success.html");
                        }
                        else{
                            res.sendFile(__dirname+"/failure.html");
                        }
                    });
    request.write(jasonData);
    request.end();
});

// use httmps moudel to send thorught the web //

app.listen(process.env.PORT || 3000, ()=>{
    console.log("3000");
});