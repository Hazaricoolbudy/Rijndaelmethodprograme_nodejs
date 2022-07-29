const express=require('express')
const app=express();

const port=8080;

const Rijndael = require('rijndael-js');

const Padder = require('pkcs7-padding');
const key=Buffer.from(`6630e73e-d16d-4ced-8634-3c693f4095f2`)
const totalLength=32;
const KEY=Buffer.concat([key],totalLength)
var myBuffer = [];
var str = KEY;
var buffer = new Buffer.from(str, 'utf16le');
for (var i = 0; i < buffer.length; i++) {
    myBuffer.push(buffer[i]);
}

console.log(myBuffer);

const IV=Buffer.from(`a5e678ac-6e25-4b57-b134-ad3126719d6c`);

const iv=Buffer.concat([IV],totalLength)





 
// Plaintext will be zero-padded
const original = `<policy><identity><sign>6635e73e-d16d-4ghd-8634-3c693f4785f2</sign><branchsign>1afa45a8-f335-7621-b7ca-3f4e2365cb8e</branchsign>
<username>Test_JMJH</username><reference>Ref001</reference></identity><plan><categorycode>de5ee71c-098f-4cc0-b486-e69391cc9fa8</categorycode>
<plancode>800cb24c-4a50-4b80-9ab5-eddcae4ee75d</plancode><basecharges>173.00</basecharges><riders><ridercode percent='173.00'>String</ridercode>
<ridercode percent='173.00'>String</ridercode><ridercode percent='173.00'>String</ridercode></riders><totalbasecharges>173.00</totalbasecharges>
<servicetax>0.00</servicetax><totalcharges>173.00</totalcharges></plan><traveldetails><departuredate>10-04-2022</departuredate><days>25</days>
<arrivaldate>20-04-2022</arrivaldate></traveldetails><passengerreference> Pankaj </passengerreference><insured><passport>NA</passport>
<contactdetails><address1>NA</address1><address2>NA</address2><city>Bengaluru</city><district>Bengaluru</district><state>Karnataka</state><pincode>560009</pincode>
<country>India</country><phoneno>3215454154</phoneno><mobileno>3215454154</mobileno><emailaddress>sjdfhkjsdh@dfhsd.com</emailaddress></contactdetails>
<name>Pankaj</name><dateofbirth>16-09-1992</dateofbirth><age>25</age><trawelltagnumber>25</trawelltagnumber><nominee>NA</nominee><relation>NA</relation>
<pastillness>NA</pastillness></insured><otherdetails><policycomment>NA</policycomment><universityname>NA</universityname><universityaddress>NA</universityaddress>
<documents><documentcode available='boolean'>13</documentcode><documentcode available='boolean'>13</documentcode><documentcode available='boolean'>13</documentcode>
</documents></otherdetails></policy>`;
 
// IV is necessary for CBC mode
// IV should have same length with the block size
// const iv = 'a5e678ac-6e25-4b57-b134-ad3126719d6c';//9d6c
const plainText=Buffer.from(original,'utf-8')

const padded=Padder.pad(plainText,32);

 
// Create Rijndael instance
// `new Rijndael(key, mode)`
const cipher = new Rijndael(KEY, 'cbc');
console.log(cipher);
 
// `Rijndael.encrypt(plaintext, blockSize[, iv]) -> <Array>`
// Output will always be <Array> where every element is an integer <Number>
const ciphertext = Buffer.from(cipher.encrypt(padded, 256, iv));
// const encrypted = cipher.encrypt(padded, 256, iv);
 
const encrypted=ciphertext.toString("base64");
console.log(encrypted);

app.get('/',(req,res)=>{
    res.send(encrypted)
})

 
//`Rijndael.decrypt(ciphertext, blockSize[, iv]) -> <Array>`
const plaintext = Buffer.from(cipher.decrypt(ciphertext, 256, iv));

const unpaded=Padder.unpad(plaintext,32)


original === unpaded.toString();
console.log(original);
app.get('/decrypted', (req,res)=>{
    res.send(original)
})








app.listen(port, ()=>{
    console.log(`app is running on port no ${port}`);
})