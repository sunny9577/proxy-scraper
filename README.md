# Requirements
1 - A Windows, Mac or Linux Computer

2 - Google Chrome installed

# Setup
This bot is based on [protractor](https://www.protractortest.org/#/) automated browser testing software.
### 1 - Open a terminal an make sure you are in the project directory
	cd proxy-scraper

### 2 - Make sure you have protractor installed
To check if you have protractor installed run:

	protractor --version

If the output is something like this:

	Version 5.4.0

This means protractor is already installed, otherwise run the command:

	npm install -g protractor

### 3 - Install Selenium Webdriver
This is where your program will run, to install it simply execute the command:

	webdriver-manager

### 4 - Database Connectivity ( Only if u want to save output to database)
You can skip this step just set SAVE_TO_DB to false in config.js

Go to the file config.js and change with your login information

	npm install mysql --save
	
Table Structure
		
	Name	Type	Collation	Attributes	Null	Default	Comments	Extra
	1	idPrimary	int(11)			No	None		AUTO_INCREMENT
	2	proxyIndex	varchar(50)	latin1_swedish_ci		No	None		
	3	port	int(10)			No	None		
	4	country	varchar(100)	latin1_swedish_ci		No	None		
	5	type	varchar(100)	latin1_swedish_ci		No	None		
	6	anonymity	varchar(100)	latin1_swedish_ci		No	None	
	

# Running the bot

### 1 - Start the Selenium webserver
Open a terminal an make sure you are in the project directory:
	
	cd proxy-scraper
	
Update and start the server:

	webdriver-manager update
	webdriver-manager start
	
### 2 - Run the bot
With the previous terminal still open and running open another terminal an make sure you are in the project directory:
	
	cd proxy-scraper
	
Run the bot:

	protractor conf.js

### Made By Sunny Singh