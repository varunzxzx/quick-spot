
# Quick Spot - DigitalOcean Online Hackathon
**Problem Statement:** https://quickspot.nyc3.digitaloceanspaces.com/index.html
## How It Works?
It takes two input **i)** Location of the cell tower **ii)** Patient's mobile number, which the service center is receiving right now.

**It is not possible to get the location from cell tower for demo purpose. So, it is using the HTML5 geolocation service to get the location of the system and It is sending my mobile number as patient's mobile number.**

When you click on the location icon on the top, It will send the information(patient's location and mobile no.) to the app. The app
will output the result. After that the center can redirect the call to that hospital. Also, the app had already sent the message to the app, which contains the link.

As soon as the user clicks that link, location of the patient will be automatically send to the app. Now, this location can be sent to that hospital.

## Demo
![Quick Spot Demo GIF](/docs/quick-spot.gif)

## Running it locally
> Please ensure you have the latest version of Nodejs and Node Package Manager (NPM) installed

```
git clone https://github.com/varunzxzx/quick-spot.git
cd quick-spot
npm install
```
Create your own ```.env``` file with following keys

* SID - Your Twilio Account SID
* TOKEN - Your Twilio Account Token
* API_KEY - Your Google Maps API key
* DOMAIN - Your domain name
* MOBILENO - Patient's mobile no. with country code

Finally, ignite the server
```
npm start
```


