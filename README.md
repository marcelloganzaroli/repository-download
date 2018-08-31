Download all repositories in bitbucket to create a local backup in specific folder


## Pre-requisites

Access bitbucket under bitbuket settings and create an app password to access repository API
For security reasons, username and password is not provided in the program

To set the variable in windows 

~~~
> set API_BITBUCKET_SECRET=<YOUR_BASE64_ENCODED_USER_NAME_PASSWORD_HERE>
~~~
You can expose it via global path as well.
A backup folder must be in place

## Run 

To run the program
~~~
> npm install
> node app.js fssibusinessdev 'C:\<backup-folder>'
~~~

