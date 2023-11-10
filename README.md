# WaterPal
NOTE: My original app idea was a cryptocurrency portfolio tracker. I have sinced switched to a plant watering app to keep track of watering schedule.

## Overview

Keeping track of all your plants can be a difficult task especially when they all have different watering needs. Knowing when to water each individual plant at any given time can make all the difference.

WaterPal is a web app that will allow users to moonitor their plants and their watering schedules. Users can register and login. Once they're logged in, they can add their plants and modify their watering schedule. The app displays their plants and allows the user to easily keep track of when they need to be watered next


## Data Model

The application will store Users and Plants

* users can have multiple plants (via references)
* each plant has iits own watering schedule

An Example User:

```javascript
{
  username: "plantpal",
  hash: // a password hash,
  plants: // an array of references to Plant documents
}
```

An Example List with Embedded Items:

```javascript
{
  user: // a reference to a User object
  nickname: "Ally",
  species = "Aloe Vera",
  lastWatered: // date of last watering,
  nextWateringDue: // date of next expected watering
}
```


## [Link to Commented First Draft Schema](db.js) 


## Wireframes

/home - page for user registration or login

![portfolio create](documentation/Portfoliocreate.png)

/plants/add - page for adding a new plant to the user's collection

![portfolio](documentation/Portfolio.png)

/plants - page for showing all plants and their next watering dates

![portfolio slug](documentation/Portfolio_slug.png)

## Site map
Note: has not been modified to reflect new plant watering idea
![site map](documentation/Site_map.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can add a plant to my collection
4. as a user, I can view all of my plants
5. as a user, I can view the watering schedule of each plant
6. as a user, I can remove or edit a plant

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
* (3 points) Configuration management using dotenv
    * I'm going to use dotenv to help load environment variables from a .env file
* (3 points) Deploy using Vercel
    * I'm going to use vercel to deploy my express and mongoDB application.

11 points total out of 8 required points 


## [Link to Initial Main Project File](app.js) 

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - Used for user authentication in the app
2. [Dotenv](https://www.npmjs.com/package/dotenv) - Used for loading environment variables
3. [Vercel Deployment](https://vercel.com/guides/using-express-with-vercel#standalone-express) - For deploying an express app on Vercel

