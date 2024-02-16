# Lotus Messenger Documentation
 ## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Instalation](#instalation)
* [User Interface](#user-interface)
  - [Register](register)
  - [Login](login)
  - [Chat](chat)
  - [Contact Info](contact-info)
  - [Shared Gallery](shared-gallery)
  - [Upload Image](upload-image)
  - [Profile Info](profile-info)
  - [Theme Option Two](theme-option-two)
  - [Theme Option Three](theme-option-three)
* [Database](#database)
  - [Models](models)
* [Socket Server](#socket-server)
* [Backend](#backend)
  - [Endpoints Details](#endpoints-details)
    - [User Login](#user-login)
    - [User Register](#user-register)
    - [User Logout](#user-logout)
    - [Update User Profile Picture](#update-user-profile-picture)
    - [Update User Theme](#update-user-theme)
    - [Update User Name](#update-user-name)
    - [Update User Status](#update-user-status)
    - [Get Last Messages](#get-last-messages)
    - [Get Friends](#get-friends)
    - [Get Messages](#get-messages)
    - [Send Message](#send-message)
    - [Deliver Message](#deliver-message)
    - [Seen Message](#seen-message)
    - [Update Undelivered Messages](#update-undelivered-messages)
    - [Update Unseen Messages](#update-unseen-messages)
    - [Images Upload](#images-upload)


## General info
This project is an online messaging web application. This application lets users engage in a real time conversation with another users, where they can share messages, images, and basic information about themselves, such as, profile pictures, current status and shared media between them. The project is divided in three components, a backend server that handles all users requests, a client server that provides the user interface and a socket server that handles all real time updates.
	
## Technologies
* NodeJS/JavaScript/Express
* NextJS/React
* Redux
* Typescript
* MongoDB
* Tailwind
* Socket.io
* Docker

## Instalation

## User Interface

A complete demo video can be found here:
[https://www.youtube.com/embed/Wqlzex300ls?si=BguTTGgOE8r7AJSE](https://youtu.be/Wqlzex300ls)

### Register
![register](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/50595365-395f-4c36-9c2e-4c38416d5cfc)

### Login
![login](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/653d7399-334a-4990-b43c-86d962cbb054)

### Chat 
![imagesPreview](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/67150bc3-a1b6-4288-a381-f7190e9ed342)

### Contact Info
![contactInfo](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/77fb5163-982e-460e-831e-757d39ce5f62)

### Shared Gallery
![sharedGallery](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/0b55b163-e476-4c20-b16e-4fa0164cf445)

### Upload Image
![uploadImage](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/b44a385f-c270-4370-9657-968bb07fb8d7)

### Profile Info
![profileInfo](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/a395b7cf-28dd-42fa-ac5c-2e6e58b3e9ea)

### Theme Option Two
![azure](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/19cf1bb7-2daf-4575-a53b-e56964995b68)

### Theme Option Three
![midnight](https://github.com/Marinescu-Alexandra/LotusMessenger/assets/73072605/5a67ae06-cd56-4054-bd42-af5eeabffe6a)


## Database
- ### Models
  - User Model
    - `username`
      - type: string
      - required: true
    - `email`
      - type: string
      - required: true
    - `password`
      - type: string
      - required: true
    - `profileImage`
      - type: string
      - default: ''
    - `status`
      - type: string
      - default: 'Hello, I am using Lotus Messenger :)'
    - `theme`
      - type: string
      - default: 'sunset'

  - Message Model
    - `senderId`
      - type: string
      - required: true
    - `senderName`
      - type: string
      - required: true
    - `receiverId`
      - type: string
      - required: true
    - `message`
      - `text`
     	- type: string
        - default: ''
      - `image`
	    - type: array
	    - default: []
    - `status`
      - type: string
      - default: 'undelivered'

## Socket Server

- ### Features

    - Real-time communication between clients
    - Adding and removing users
    - Broadcasting messages to all connected clients
    - Updating user profile information
    - Typing indicators for messaging
    - Message delivery and read receipts
    - Handling disconnections and reconnecting

## Backend

### Endpoints Details

### **`User Login`**

- **Name**: User Login
- **Method**: POST
- **URL**: `/user-login`

- **Description**:  
	This endpoint allows users to sign in to the application.

- ### Query Parameters:

	#### `email`
	- **Type**: string
	- **Description**: The email of the registered user.
	- **Validation**: Must be a valid email format and existing in the database.
	- **Required**: Yes

	#### `password`
	- **Type**: string
	- **Description**: The password of the registered user.
	- **Validation**: Must match the password corespoding with the email used.
	- **Required**: Yes

- ### Response:

	**Status Code**: `200 OK`
	
	Upon successful execution, the API will return a success message 'Login successful' followed by the JWT token containing all relevant user information. 
	Upon successful execution, the JTW token will be stored inside the cookies of the browser as well as inside the local storage.
	Contents inside the JWT token:
	- `_id`: ID of the database entry for the registered user. Type: `string`.
	- `email`: Email of the registered user. Type: `string`.
	- `username`: Username of the registered user. Type: `string`.
	- `createdAt`: Date of the creation of the account. Type: `date`.
	- `profileImage`: URL string pointing to the user profile image. Type: `string`.
	- `status`: Status of the registered user. Type: `string`. Default: `Hello I am using Lotus Messenger :)`.
	- `theme`: Theme of the registered user. Type: `string`. Default: `sunset`.

- ### Potential Errors:

	**Status Code**: `400 Bad Request`  
	**Description**: The request was formed incorrectly or included invalid parameters.  
	**Possible Reasons**:  
	- The user did not provide an email.
	- The user did not provide a password.
	- The user did not provide a valid email.
	- The user provided an email that does not exist in the database.
	
	**Status Code**: `401 Unauthorized`  
	**Description**: The authenticating process can't be performed with the login credentials provided by the user.  
	**Reason**:  
	- The user did not provide a matching password for the provided email.
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`User Register`**

- **Name**: User Register
- **Method**: POST
- **URL**: `/user-register`

- **Description**:  
	This endpoint allows users to create an account that will be used to sign in the aplication.

- ### Query Parameters:

	#### `username`
	- **Type**: string
	- **Description**: The user name of the account.
	- **Required**: Yes
	
	#### `password`
	- **Type**: string
	- **Description**: The password of the account.
	- **Required**: Yes
	
	#### `email`
	- **Type**: string
	- **Description**: The email of the account.
	- **Validation**: Must be a valid email format and not existing in the database.
	- **Required**: Yes

- ### Response:

	**Status Code**: `200 OK`
	
	Upon successful execution, the API will return a success message 'Registration complete' followed by the JWT token containing all relevant user information. 
	Upon successful execution, the JTW token will be stored inside the cookies of the browser as well as inside the local storage.
	Contents inside the JWT token:
	- `_id`: ID of the database entry for the registered user. Type: `string`.
	- `email`: Email of the registered user. Type: `string`.
	- `username`: Username of the registered user. Type: `string`.
	- `createdAt`: Date of the creation of the account. Type: `date`.
	- `profileImage`: URL string pointing to the user profile image. Type: `string`.
	- `status`: Status of the registered user. Type: `string`. Default: `Hello I am using Lotus Messenger :)`.
	- `theme`: Theme of the registered user. Type: `string`. Default: `sunset`.

- ### Potential Errors:

	**Status Code**: `400 Bad Request`  
	**Description**: The request was formed incorrectly or included invalid parameters.  
	**Possible Reasons**:  
	- The user did not provide an email.
	- The user did not provide a password.
	- The user did not provide a valid email.
	- The user provided an email already in use.
	
	
	**Status Code**: `409 Conflict`  
	**Description**: The request wasn't completed because of a conflict with the resource's current state.  
	**Reason**:  
	- The user provided an email already registered in the database.
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`User Logout`**

- **Name**: User Logout
- **Method**: POST
- **URL**: `/user-logout`

- **Description**:  
	This endpoint allows users to logout from the current instance of the application.
	
- **Status Code**: `201 OK`

	Upon successful execution, the API will return 'success: true' and cookie 'authToken' is removed, when the cookie is removed the client will redirect the user to the login page.

### **`Update User Profile Picture`**

- **Name**: Update User Profile Picture
- **Method**: POST
- **URL**: `/update-user-profile-picture`

- **Description**:  
	This endpoint allows users change their profile picture by uploading the image provided by the user, sending back the new path of the uploaded image and the updated JTW token of the user.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes
	
	#### `data`
	- **Type**: FormData
	- **Description**: FormData containing the information of the profile picture provided by the user.
	- **Required**: Yes
	
	- **Status Code**: `200 OK`
	
	- Upon successful execution, the API will return:
	  -successMessage: 'Cookie update successful'
	  -profileImagePath: profileImageName,
	  -token: token

- ### Potential Errors:

	**Status Code**: `403 Forbidden`  
	**Description**: The server understands the request but refuses to authorize it.  
	**Reason**:  
	- The user provided an ilegal file name or was trying to access other directories.
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Update User Theme`**

- **Name**: Update User Theme
- **Method**: POST
- **URL**: `/update-user-theme`

- **Description**:  
	This endpoint allows users to change their theme of the application.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes
	
	#### `theme`
	- **Type**: string
	- **Description**: The name of the selected theme.
	- **Required**: Yes
	
	**Status Code**: `200 OK`
	
	- Upon successful execution, the API will return:
	  -successMessage: 'Cookie update successful'
	  -theme: theme,
	  -token: token

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Update User Name`**

- **Name**: Update User Name
- **Method**: POST
- **URL**: `/update-user-name`

- **Description**:  
	This endpoint allows users to change their user name visible to other users.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes
	
	#### `name`
	- **Type**: string
	- **Description**: The new name of the user.
	- **Required**: Yes

- **Status Code**: `200 OK`
	
	Upon successful execution, the API will return:
	  -successMessage: 'Cookie update successful'
	  -name: name,
	  -token: token

- ### Potential Errors:

- **Status Code**: `500 Internal Server Error`  
- **Description**: An unexpected error occurred on the server side.

### **`Update User Status`**

- **Name**: Update User Status
- **Method**: POST
- **URL**: `/update-user-status`

- **Description**:  
	This endpoint allows users to change their status visible to other users.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes
	
	#### `status`
	- **Type**: status
	- **Description**: The new status of the user.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return:
	  -successMessage: 'Cookie update successful'
	  -status: status,
	  -token: token

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Get Last Messages`**

- **Name**: Get Last Messages
- **Method**: GET
- **URL**: `/get-last-messages`

- **Description**:  
	This endpoint retieves from the database all last messages between the current, provided user and other users in tha databse.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return a map containing all the found messages.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Get Friends`**

- **Name**: Get Friends
- **Method**: GET
- **URL**: `/get-friends`

- **Description**:  
	This endpoint retieves all the users within the databse expect the current/provided user.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return a map containing all the found users.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Get Messages`**

- **Name**: Get Messages
- **Method**: GET
- **URL**: `/get-messages/:id`

- **Description**:  
	This endpoint retieves all the messages between two provided users.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current user signed in the application.
	- **Required**: Yes

- ### Path Parameters:

	#### `id`
	- **Type**: string
	- **Description**: The id of the other users involved in the conversation.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return a map containing all the found messages.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Send Message`**

- **Name**: Send Message
- **Method**: POST
- **URL**: `/send-message`

- **Description**:  
	This endpoint will upload to the database the message data sent by a user.

- ### Query Parameters:

	#### `senderId`
	- **Type**: string
	- **Description**: The id of the sender.
	- **Required**: Yes
	
	#### `receiverId`
	- **Type**: string
	- **Description**: The id of the receiver.
	- **Required**: Yes
	
	#### `message`
	- **Type**: string
	- **Description**: The message of the conversation.
	- **Required**: Yes
	
	#### `senderName`
	- **Type**: string
	- **Description**: The name of the sender.
	- **Required**: Yes
	
	#### `images`
	- **Type**: string
	- **Description**: The image paths of the message.
	- **Required**: Yes

- **Status Code**: `201 OK`

	- Upon successful execution, the API will return a success message and the new uploaded messages from the database.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Deliver Message`**

- **Name**: Deliver Message
- **Method**: POST
- **URL**: `/deliver-message`

- **Description**:  
	This endpoint will update the status of an existing message within the database to 'delivered'.

- ### Query Parameters:

	#### `_id`
	- **Type**: string
	- **Description**: The id of the existing message.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return the new updated message.

- ### Potential Errors:
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Seen Message`**

- **Name**: Seen Message
- **Method**: POST
- **URL**: `/seen-message`

- **Description**:  
	This endpoint will update the status of an existing message within the database to 'seen'.

- ### Query Parameters:
	
	#### `_id`
	- **Type**: string
	- **Description**: The id of the existing message.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return the new updated message.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Update Undelivered Messages`**

- **Name**: Update Undelivered Messages
- **Method**: POST
- **URL**: `/update-undelivered-messages/:id`

- **Description**:  
	This endpoint will update the status of all existing messages within a database that have the status 'undelivered' to the status of 'delivered'.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current/provided user.
	- **Required**: Yes

- ### Path Parameters:

	#### `id`
	- **Type**: string
	- **Description**: The id of the other users involved in the conversation.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return 'success: true'.

- ### Potential Errors:

	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Update Unseen Messages`**

- **Name**: Update Undelivered Messages
- **Method**: POST
- **URL**: `/update-unseen-messages/:id`

- **Description**:  
	This endpoint will update the status of all existing messages within a database that have the status 'delivered' to the status of 'seen'.

- ### Query Parameters:

	#### `myId`
	- **Type**: string
	- **Description**: The id of the current/provided user.
	- **Required**: Yes

- ### Path Parameters:

	#### `id`
	- **Type**: string
	- **Description**: The id of the other users involved in the conversation.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return 'success: true'.

- ### Potential Errors:
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.

### **`Images Upload`**

- **Name**: Images Upload
- **Method**: POST
- **URL**: `/images-upload`

- **Description**:  
	This endpoint will update the status of all existing messages within a database that have the status 'undelivered' to the status of 'delivered'.

- ### Query Parameters:

	#### `data`
	- **Type**: FormData
	- **Description**: FormData containing the information of the pictures provided by the user.
	- **Required**: Yes

- **Status Code**: `200 OK`

	- Upon successful execution, the API will return a list containing all the paths of the newly uploaded images.

- ### Potential Errors:

	**Status Code**: `403 Forbidden`  
	**Description**: The server understands the request but refuses to authorize it.  
	**Reason**:  
	- The user provided an ilegal file name or was trying to access other directories.
	
	**Status Code**: `500 Internal Server Error`  
	**Description**: An unexpected error occurred on the server side.
