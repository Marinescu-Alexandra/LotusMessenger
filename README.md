# Lotus Messenger Documentation
 ## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Instalation](#instalation)
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
* [User Interface](#user-interface)
* [Socket Server](#socket-server)


## General info
This project is an online messaging web application. This application lets users engage in a real time conversation with another users, where they can share messages, images, and basic information about themselves, such as, profile pictures, current status and shared media between them. The project is divided in three components, a backend server that handles all users requests, a client server that provides the user interface and a socket server that handles all real time updates.
	
## Technologies
* NODEJS/JAVASCRIPT/EXPRESS
* NEXTJS/REACT
* REDUX
* TYPESCRIPT
* MONGODB
* TAILWIND
* SOCKET.IO
* DOCKER

## Instalation

## Backend

### Endpoints Details

#### User Login

- **Name**: User Login
- **Method**: POST
- **URL**: `/user-login`

**Description**:  
This endpoint allows users to sign in to the application.

### Query Parameters:

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

### Response:

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

### Potential Errors:

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

#### User Register

- **Name**: User Register
- **Method**: POST
- **URL**: `/user-register`

**Description**:  
This endpoint allows users to create an account that will be used to sign in the aplication.

### Query Parameters:

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

### Response:

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

### Potential Errors:

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

#### User Logout

- **Name**: User Logout
- **Method**: POST
- **URL**: `/user-logout`

**Description**:  
This endpoint allows users to logout from the current instance of the application.

**Status Code**: `201 OK`

Upon successful execution, the API will return 'success: true' and cookie 'authToken' is removed, when the cookie is removed the client will redirect the user to the login page.

#### Update User Profile Picture

- **Name**: Update User Profile Picture
- **Method**: POST
- **URL**: `/update-user-profile-picture`

**Description**:  
This endpoint allows users change their profile picture by uploading the image provided by the user, sending back the new path of the uploaded image and the updated JTW token of the user.

### Query Parameters:

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

### Potential Errors:

**Status Code**: `403 Forbidden`  
**Description**: The server understands the request but refuses to authorize it.  
**Reason**:  
- The user provided an ilegal file name or was trying to access other directories.

**Status Code**: `500 Internal Server Error`  
**Description**: An unexpected error occurred on the server side.

#### Update User Theme

- **Name**: Update User Theme
- **Method**: POST
- **URL**: `/update-user-theme`

**Description**:  
This endpoint allows users to change their theme of the application.

### Query Parameters:

#### `myId`
- **Type**: string
- **Description**: The id of the current user signed in the application.
- **Required**: Yes

#### `theme`
- **Type**: string
- **Description**: The name of the selected theme.
- **Required**: Yes

### Potential Errors:

**Status Code**: `500 Internal Server Error`  
**Description**: An unexpected error occurred on the server side.
