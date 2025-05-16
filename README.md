
# ClassCritic

This is a website created to help students at the University of the West Indies, Cave Hill Campus to review courses and offer their feedback publicly so that other students can hear how courses and lecturers are like without relying on "word of mouth". This aims to fix an issue that is common on our campus where course reviews are often private, and any information about courses needs to be sourced from past students who may have vastly different experiences and can potentially lead an unassuming student down the path of doing a course they may not like, may not need or may find too difficult without any prior warning. This solution now aims to have a place for past students to offer their critiques of courses that other students can interact with to help guide course selection, and by extension, to help with the quality of courses as these issues are now publicly available.

### Note

* This is a forked version of the original repository which I contributed to hosted here: https://github.com/kashwald/ClassCritic
* This is a group project done together by the authors in Summer 2024


## Authors

- [@jlayne246](https://www.github.com/jlayne246)
- [@kashwald](https://github.com/kashwald)
- [@KaiEJH](https://github.com/KaiEJH)
- [@246-K-11](https://github.com/246-K-11)


## Features

- Search through a course catalogue
- Write reviews for a course
- Give a rating from 1 - 5
## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Demo

Insert gif or link to demo


## Project Status

Development on hold as of Summer 2024
## Tech Stack

*Client*: React
*Server*: Node, Express
*Database*: MongoDB

*Languages*: JavaScript, HTML, CSS

## Run Locally

Select the directory you want to save the ClassCritic repository to and run the following command

`git clone https://github.com/kashwald/ClassCritic.git`

### Front-End Set-Up
Navigate to the front-end directory (frontend)

`cd .\ClassCritic\frontend`

and run the following command

`npm install`

This installs all the dependencies for the front-end server using the packages.json

### Starting Front-End

You should now be able to start the front-end server from the front end directory using the following command

`npm run dev`

You see the front-end by visiting http://localhost:5173/ or the URL provided by VITE in the command prompt.

### Back-End Set-Up
Navigate to the back-end directory (backend)

`cd .\ClassCritic\backend`

and run the following command

`npm install`

This installs all the dependencies for the back-end server using the packages.json

Before the backend can be tested, you must connect to a mongoDB database

#### Database Set-Up
You can either create a MongoDB database locally following the below guide, or set up a local or cloud database and configure the database connection to suit.

##### Default Database
1.  Install MongoDB Community https://www.youtube.com/watch?v=gB6WLkSrtJk
2.  Create a database named "classcritic"
3.  Create a collection called "reviews"
4.  Add the following attributes to the reviews collection: 
coursecode","grade","overallQuality","simplicity","courseRelevance","instructionalEffectiveness", "writtenReview","username"


### Starting Back-End

Within the backend directory run the following command

`npm run dev`

Navigate to the url http://localhost:4000/api/review and you should see data displayed there.
