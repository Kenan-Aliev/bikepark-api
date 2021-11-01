/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *       type: object
 *       required:
 *          - email
 *          - username
 *          - phone
 *          - password
 *       properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id by MongoDB
 *          email:
 *            type: string
 *            unique: true
 *          username:
 *            type: string
 *            unique: true
 *            min: 3
 *            max: 15
 *          phone:
 *            type: string
 *            example: "+996553484837"
 *          role:
 *            type: string
 *            default: user
 *          password:
 *            type: string
 *            min: 6
 *            max: 56
 *          orders:
 *            type: array
 *            items:
 *                type: object
 *                properties:
 *                   _id:
 *                      type: string
 *                      description: The auto-generated id by MongoDB
 *                   status:
 *                      type: string
 *                      description: Status of order
 *                   orderNumber:
 *                      type: number
 *                      description: The auto generated number by server
 *                   name:
 *                      type: string
 *                      description: The name of the customer
 *                   phone:
 *                      type: string
 *                      description: Phone of the customer
 *                   addressOfClient:
 *                      type: string
 *                      description: Where to deliver the bike
 *                   addressOfAdmin:
 *                      type: string
 *                      description: Where to bring back the bike
 *                   totalPrice:
 *                      type: number
 *                      description: Total price of order
 *                   madeAt:
 *                      type: string
 *                      format: date
 *                      example: 2019-05-17
 *                   bikes:
 *                         type: array
 *                         items:
 *                              type: object
 *                              properties:
 *                                          _id:
 *                                            type: string
 *                                            description: The auto-generated id by MongoDB
 *                                          bikeId:
 *                                            type: string
 *                                          price:
 *                                            type: string
 */



/**
 * @swagger
 * tags:
 *   name: UserAuthorization
 *   description: Authorization managing API
 */



/**
 * @swagger
 * /auth/registration:
 *    post:
 *     summary: Returns message about activation registration on user email
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties :
 *                     email :
 *                        type: string
 *                     username:
 *                        type: string
 *                     phone:
 *                        type: string
 *                     password:
 *                        type: string
 *              required:
 *                     - email
 *                     - username
 *                     - phone
 *                     - password
 *              example:
 *                     {
 *                       email: "kenan1999@gmail.com",
 *                       username: "kenan",
 *                       phone: "+996553484837",
 *                       password: "k2vrrtz"
 *                     }
 *     responses:
 *        422:
 *           description : Some User Schema validation error
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *
 *        200:
 *           description: Returns a message about confirming registration on user email
 *           content:
 *            application/json:
 *              schema:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *
 *
 *
 *
 */






/**
 * @swagger
 * /auth/activation:
 *   post:
 *     summary: Returns message about user registration on website
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *     responses:
 *        400:
 *           description: Returns a message about invalid token
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns a success message about user registration
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *
 *
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Returns decoded token with user's data
 *     tags: [UserAuthorization]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *        404:
 *           description: Returns a message if email or password doesn't match
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *           description: Some server error
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        200:
 *           description: Returns a success login message and user's some data
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  id:
 *                    type: string
 *                  email:
 *                    type: string
 *                  token:
 *                    type: string
 *
 *
 */







