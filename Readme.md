# What if… hosting sources, website and database on GitHub

I often have ideas, not always good ones and most of the time it remains just an idea but sometimes I need to test it.
Recently I have been working on a small project (a World of Warcraft addon, I may talk about it when it's finished) and I found out that I needed to have a website to access a database and allow people help me to add simple data in it.
The thing is I'm sometime quite lazy and for a little side project I didn't want to setup a whole environment with a server and a database. So I asked myself "What if I put everything on GitHub?" and here we are trying to find out if this is possible or just another crazy idea of mine.

## A new react application

First we create a basic React application, let's call it "hosthub"

```
npx create-react-app hosthub
```

Now we'll customize a bit our basic React application.
Let's say we want it to allow displaying and editing about users and their roles (same behaviour as my article about [react inside VS Code webview](https://medium.com/younited-tech-blog/reactception-extending-vs-code-extension-with-webviews-and-react-12be2a5898fd)).
We use a "Config" component to display a small editor with a bit of css and a default JSON file with some sample data, then we add this component to our App instead of the generated code (the logo and "learn react" link).

You can find here the elements I added :
[Config component](https://gist.github.com/Ciaanh/917d6a035c8a5530f8580e6960fa701c)
[CSS file](https://gist.github.com/ciaanh/ed8a1d2347fd54a95922ceee5e2ecc41)
[Sample JSON](https://gist.github.com/Ciaanh/9a018bba4f316babef3b04331578f570)

And the changes to the previously generated App.js file to use our new component:
[https://gist.github.com/Ciaanh/48a357001b38d1a8f1f6747335b39fe4]

To be sure everything works we can launch the website using `npm start` and push the application to GitHub.

```
git init
git add -A
git commit -m "first commit"
git remote add origin https://github.com/<YOUR_REPO>
git push -u origin master
```

## Deploy the website

Ok, now that we have a React application the next step is to deploy it.

You may not know this but GitHub offer a solution to host a small static website for your project. This can be really helpful to have a landing point where you can show a little more than a ReadMe.md file ;-)

The good news is that we won't need much effort as there is a very useful npm package which handle the deployment of our application which is [gh-pages](https://github.com/tschaub/gh-pages).
Of course you can do it all by yourself, fine tuning the deployment and hosting (and I recommend you to read all you can do with [GitHub Pages](https://pages.github.com/)) but the point of this article is **"quick and simple"** that's why I chose to use gh-pages.

We install the package:

`npm install gh-pages --save`

We also need to update the package.json to add the commands to deploy our application:

```
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

And most importantly we define the homepage of our application on GitHub as a property of our _package.json_ (if you don't the css and js files will not be found by the generated html). The default url format is <http://myname.github.io/myapp/> so for my application it will be <http://ciaanh.github.io/hosthub/>

```
"homepage": "https://ciaanh.github.io/hosthub/"
```

To make it work we just have to launch the deployment with the command:

`npm run deploy`

We now have on GitHub a new branch `gh-pages` containing a compiled version of our website. We can visit the website specified in the "homepage" variable to check everything is ok.

## Set up the database

Congratulations, we managed to deploy a static website. But the thing is that we want a more _dynamic_ website.

And here's the fun idea **use GitHub as a database**

We know that our application use JSON as a datasource and we can store JSON file on GitHub, so we just have to find a way to load JSON files from our repository and save any changes we make.

I first turned to [Hubdb](https://github.com/mapbox/hubdb) which is a wrapper for GitHub API handling JSON files. But the thing is, this implementation requires a valid token for read and write, this is not exactly what I want as reading from a public repo should not require authentication.
So let's take inspiration from Hubdb and implement our own GitHub accessor using [octokat.js](https://github.com/philschatz/octokat.js/) which implement GitHub API in Javascript.

First we have to install the GitHub API connector:

`npm install octokat`

We also need _atob_ and _btoa_ to handle base 64 encoding:

`npm install atob btoa`

Let's create a new branch _"db"_

`git checkout -b db`

We can delete all the files and leave only the _sample.json_ file, then we commit and push the branch:

```
git add -A
git commit -m "init db"
git push --set-upstream origin db
```


We add a GitHubApi class to our application to handle the access to our new branch. Based on the [documentation of octokat.js](https://github.com/philschatz/octokat.js/#readwriteremove-a-file) we need only two functions, _get_ and _update_.  
The _get_ function reads the JSON file from the repository and parse it.  
The _update_ function take use token to connect to the repository and save the changes with a commit.

[https://gist.github.com/Ciaanh/b5c7f3b81a3a0a79973f4f33489e5c7e]

We don't have much modifications to make to our Config component, we change the source for our JSON in the _loadDbFile_ function.

[https://gist.github.com/Ciaanh/331a6dd9535a8a5ffc5efb7853fa7485]

We add an input text field and a button to save the data using a valid GitHub token with a new _saveDbFile_ function

[https://gist.github.com/Ciaanh/d72ccbf9640740f015e493a23e728668][https://gist.github.com/ciaanh/e9ae382925abf818cf83e43e7863e5c9]

And it's done, we can read and write a JSON file on GitHub with a React application also hosted on GitHub.
But now that we proved that it can be done we have to ask ourselves if it's a good solution or not.  
I can only let you decide if this solution suits your needs but there are some things to consider here:

Pros

- As you can see it is really simple to do.
- For a small project it can save you the need to set up a complete infrastructure with a web server and a database server.
- It's free.

Cons

- We have to provide a token which is not the best to paste it in our application and a very bad idea if it's stored publicly in our code as anyone could use it to impersonate you on GitHub (one side note, we could add authentication with GitHub to handle access rights and/or allow pull request)
- If you need only to read from JSON files we can already do it using React as we did at step 1.


Source code of every step can be found here https://github.com/Ciaanh/hosthub.