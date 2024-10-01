# Faketube-server
How to run the web server:
there is two repositoris for the project one is the client and the second is the server, in order to use the website you only need the server that already contains the build files of the client so i will describe here the steps to make it work and in the client README i will describe how to integrate the client to the server in case of changes in the client.
1.clone the "faketube-sever" repository.

2.in the project file there is folder named "mongo database" which inside have 4 json files, open mongodb compass and press add new connecotion, put this in the url for connection 
"mongodb://localhost:27017" and press connect.

3.in the connection you just created press on the +sign to create new database, in the database name type "Faketube" and in the collection name type "users".

4.on the same window create 3 more collections under the Faketube database with the names : 
"comments", "reactions" and videos.

5.now in every collection you made (should be 4 total) press on "ADD DATA" and than on "import JSON or CSV file" and choose the one that fit from the mongo database folder in the project and press import, for example for "users" collection choose the "Faketube.users.json" file.

6.after make it to the 4 collections under the Faketube database, open the terminal in the project and write "npm i".

7.still in the terminal write "nodemon .\server.js\".

8.open browser and go "http://localhost:880/", enjoy the website - there are already 2 users that upload videos and in the database - eyal and amit.

Work process:
first we took the code from the react app and adjust what we need to prepare it to get information from the server.
At the same time we worked on the server to handle all requests. first we divided the server to MVC structure
and started handling the login logic, then the user and videos requests.
Then we start to combine the server model to extract information from the mongoDB.
