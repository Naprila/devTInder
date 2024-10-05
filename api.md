# auth router

POST /login
POST /signup
POST /logout

# profile router

GET /profile/view
PATCH /profile/edit
PATCH /profile/password

# connection router

POST /request/send/:status/:userId     -> ignoring (left swipe) / sending (right swipe) connection request 
POST /request/view/:status/:requestId  -> accepting/rejecting the connection request received from other users

# user router
GET /user/connection
GET /user/requests/received
GET /user/feed


*status :  [ ACCEPTED, REJECTED, PASS, LIKE ]




# features to consider adding later

1) chat
2) add forgot password feature
