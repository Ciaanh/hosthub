# What if… hosting sources, website and database on GitHub

I like to explore ideas, most of the time it remains just an idea but sometimes I need to test it.
Recently I have been working on a small project (a World of Warcraft addon, I may talk about it when it's finished) and I found out that I needed to have a website to access a database and allow people help me to add simple data in it.
The thing is I'm sometime quite lazy and for a little side project I don't want to setup a whole environment with a server and a database. So I asked myself "Why not all on github?" and here we are trying to find out if this is possible or just another crazy idea of mine.

## A new react application

First we create a basic React application, let's call it "hosthub"

```
npx create-react-app hosthub
```

Now we'll customize a bit our basic React application.
Let's say we want it to display and edit data about users and their roles (same behaviour as my article about [react inside VS Code webview](https://medium.com/younited-tech-blog/reactception-extending-vs-code-extension-with-webviews-and-react-12be2a5898fd)).
We use a "Config" component to display a small editor with a bit of css and a default json file with some sample data, then we add this component to our App instead of the generated code (logo and "learn react" link).

You can find here the elements I added :
[Config component](https://gist.github.com/Ciaanh/917d6a035c8a5530f8580e6960fa701c)
[CSS file](https://gist.github.com/ciaanh/ed8a1d2347fd54a95922ceee5e2ecc41)
[Sample json](https://gist.github.com/Ciaanh/9a018bba4f316babef3b04331578f570)

And the changes to the previously generated App.js file :
[https://gist.github.com/Ciaanh/48a357001b38d1a8f1f6747335b39fe4]

To be sure everything work we can launch the website using `npm start` and push the application to GitHub.

```
git init
git add -A
git commit -m "first commit"
git remote add origin https://github.com/<YOUR_REPO>
git push -u origin master
```

## Deploy the website

Ok, now that we have a React application the next step is to deploy it.

You may not know this but github offer a solution to host a small static website for your project. This can be really helpfull to have a landing point where you can show a little more than a ReadMe.md file ;-)

The good news is that we won't need much effort as there is a very usefull npm package which handle the deployment of our application which is [gh-pages](https://github.com/tschaub/gh-pages).
Of course you can do it all by yourself, fine tuning the deployment and hosting (and I recommend you to read all you can do with [Github Pages](https://pages.github.com/)) but the point of this article is **"quick and simple"** that's why I chose to use gh-pages.

We install the package:

`npm install gh-pages --save`

We also need to update the package.json to add the commands to deploy our application:

```
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

And most importantly we define the homepage of our application on Github as a property of our _package.json_ (if you don't the css and js files will not be found by the generated html). The default url format is like this <http://myname.github.io/myapp/> so in my application it will be <http://ciaanh.github.io/hosthub/>

```
"homepage": "https://ciaanh.github.io/hosthub/"
```

To make it work we just have to launch the deployment with the command:

`npm run deploy`

We now have a new branch `gh-pages` containing a compiled version of our website. We can visit the website specified in the "homepage" variable to check that everything is ok.

## Set up the database

Congratulations, we managed to deploy a static website. But the thing is that we want a more _dynamic_ website.

And here's the fun idea **use Github as a database**

We know that our application use Json as a datasource and we can store Json file on Github, so we just have to find a way to load Json files from our repository and save any changes we make.

I first turned to [Hubdb](https://github.com/mapbox/hubdb) which is a wrapper for Github API handling Json files. But the thing is, this implementation requires a valid token for read and write, this is not exactly what I want as reading from a public repo should not require authentication.
So let's take inspiration from Hubdb and implement our own Github accessor using [octokat.js](https://github.com/philschatz/octokat.js/) which implement Github API in Javascript.

First we have to install the Github API connector:

`npm install octokat`

We also need _atob_ and _btoa_ to handle base 64 encoding:

`npm install atob btoa`

Let's create a new branch _db_

`git checkout -b db`

We can erase all the files and leave only the _sample.json_ file, then we commit and push the branch:

```
git add -A
git commit -m "init db"
git push --set-upstream origin db
```


We add a GithubApi class to our application to handle the access to our new branch based on the [documentation of octokat.js](https://github.com/philschatz/octokat.js/#readwriteremove-a-file).

We need only two functions, _get_ and _update_, to connect to the db but only the _update_ function require a valid Github token to save the modifications made.

[https://gist.github.com/Ciaanh/b5c7f3b81a3a0a79973f4f33489e5c7e]

We don't have much modifications to make to our Config component, we change the source for our json in the _loadDbFile_ function.

[https://gist.github.com/Ciaanh/331a6dd9535a8a5ffc5efb7853fa7485]

We add an input text field and a button to save the data using a valid Github token with a new _saveDbFile_ function

[https://gist.github.com/Ciaanh/d72ccbf9640740f015e493a23e728668][https://gist.github.com/ciaanh/e9ae382925abf818cf83e43e7863e5c9]

And it's done, we can read and write from a json file on Github with a React application also hosted on Github.
But now that we proved that it can be done we have to ask if it's a good solution or not.  
I can only let you decide if this solution suits your needs but there is some things to consider here:

Pros

- As you can see it is really simple to do.
- For a small project it can save you the need to set up a complete infrastructure with a web server and a database server.
- It's free.

Cons

- We have to provide a token which is not the best to paste it in ou application and a very bad idea if it's stored publicly in our application's code as anyone could use it to impersonate you on Github.
- If you need only to read from Json files we can already do it using React as we did at step 1.


Source code of every step can be found here https://github.com/Ciaanh/hosthub.