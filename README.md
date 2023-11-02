# FranCrypto Portfolio Pro

## Overview

Keeping track of all your investments can be a difficult task given the volatile nature of the market. Knowing what the value of your portfolio at any given time can make all the difference.

FranCrypto Portfolio Pro is a web app that will allow users to moonitor their cryptocurrency investments in real-time. Users can register and login. Once they're logged in, they can add their cryptocurrency holdings. The app gets live price updates for each cryptocurrency in a users portfolio, allowing them to see their portfolio's current value and performance all in a quick glance.


## Data Model

The application will store Users, Cryptocurrencies and Transactions

* users can have multiple transactions (via references)
* each transaction refers to a particular cryptocurrency

An Example User:

```javascript
{
  username: "cryptoinvestoor",
  hash: // a password hash,
  lists: // an array of references to Transaction documents
}
```

An Example List with Embedded Items:

```javascript
{
  user: // a reference to a User object
  cryptocurrency: "Breakfast foods",
  quantity: 1.5,
  boughtAt: 30000, // price at which the user bought this cryptocurrency
  currentPrice: // live updated price
}
```


## [Link to Commented First Draft Schema](db.mjs) 


## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can add a cryptocurrency holding
4. as a user, I can view all of my cryptocurrency holdings
5. as a user, I can view the current value and/or the performance of each holding
6. as a user, I can remove or edit a cryptocurrency holding

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
* (3 points) Real-time data fetch for cryptocurrency priices
    * Will use a third party API such as coinmarketcap or CoinGecko to get real-time price updates.
* (2 points)
    * Use a library such as Chart.js to visually represent portfolio performance over time.

10 points total out of 8 required points 


## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [CoinGecko API docs](https://www.coingecko.com/api/documentation) - Used for fetching real-time cryptocurrency data
3. [Chart.js docs] (https://www.chartjs.org/docs/latest/) - For creating visual data representations

