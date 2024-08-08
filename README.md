# ClassCritic
A place to share constructive criticism 

## Set Up Intructions

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
