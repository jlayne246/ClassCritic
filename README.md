# ClassCritic
A place to share constructive criticism 

## Set Up Intructions

Select the directory you want to save the ClassCritic repo to and run the following command

`git clone https://github.com/kashwald/ClassCritic.git`

### Now enter the front-end directory and run the following command, to install all the required dependicies, 
##### (when you run the command, packages.json is used to help determine which dependicies need to be installed, specifically for the front-end )

`npm install`

### You should now be able to "npm run dev" and view the front-end app

### To set up the back-end, you need to "cd" into that directory and run the following command
##### (when you run the command, packages.json is used to help determine which dependicies need to be installed. specifically for the back-end )
`npm install`


#### To see if the backend is working make sure: 
##### 1.you have a mongo database named "classcritic"
##### 2.create a collection called "reviews" and make sure it has attributes "coursecode","grade","overallQuality","simplicity","courseRelevance","instructionalEffectiveness", "writtenReview","username"
##### 3. enter http://localhost:4000/api/review and you should see the data displayed there!!! (ensure you are running "npm run dev" in the backend as well)
