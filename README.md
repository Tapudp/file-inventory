# Drive app

- that let's create and store video objects and folders. 
- User can modify that folder's path by moving it to another child or parent folder
- videos can be moved around the folder the same way.

# service 
- This is a basic node-express server tied with mysql database.


# setup

# Backend

- Make sure to have `mysql` running on your local machine
    - on Mac,
    
    ```jsx
    brew services start mysql
    ```
    
- Move to `/drive-service` folder
    - To install all the required dependencies, run `npm install` or `yarn`
- Then start the back-end server (and keep it running)
    - run
    
    ```jsx
    npm run dev-start
    
    or
    
    yarn dev-start
    ```
    
    - this will run the server in the development mode on local.

# Frontend

- Move to `/drive-app` folder
    - To install all the required dependencies, run `npm install` or `yarn`
- then start the front-end server (and keep it running)
    - run
    
    ```jsx
    npm run start
    
    or
    
    yarn start
    ```