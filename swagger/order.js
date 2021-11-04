/**
 * @swagger
 *   components:
 *        securitySchemes:
 *            bearerAuth:
 *               type: http
 *               scheme: bearer
 *               bearerFormat: JWT
 */



/**
 * @swagger
 * tags:
 *   name: OrderRoutes
 *   description: Orders managing API
 */



/**
 * @swagger
 * /order/new:
 *   post:
 *     summary: Returns a message about new success order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                phone:
 *                  type: string
 *                addressOfClient:
 *                  type: string
 *                addressOfAdmin:
 *                  type: string
 *                madeAt:
 *                  type: string
 *                  format: date
 *                expiresAt:
 *                  type: string
 *                  format: date
 *                bikes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      bikeId:
 *                        type: string
 *                      price:
 *                        type: number
 *
 *
 *     responses:
 *        400:
 *           description: Returns a message about invalid token or if bike is rented
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
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
 *           description: Returns a success message about new order
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
 * /order/getUsersOrders:
 *   get:
 *     summary: Returns current and completed orders of user
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
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
 *        403:
 *           description: Returns a message about no access to the route
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
 *           description: Returns an object with user orders
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  currentOrders:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                        orderNumber:
 *                          type: number
 *                        totalPrice:
 *                          type: number
 *                        madeAt:
 *                          type: string
 *                          format: date
 *                        expiresAt:
 *                          type: string
 *                          format: date
 *                        bikes:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                              price:
 *                                type: number
 *                              bikeId:
 *                                type: object
 *                                properties:
 *                                  _id:
 *                                    type: string
 *                                  name:
 *                                    type: string
 *                                  brand:
 *                                    type: string
 * 
 *                  completedOrders:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                        orderNumber:
 *                          type: number
 *                        totalPrice:
 *                          type: number
 *                        madeAt:
 *                          type: string
 *                          format: date
 *                        expiresAt:
 *                          type: string
 *                          format: date
 *                        bikes:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                              price:
 *                                type: number
 *                              bikeId:
 *                                type: object
 *                                properties:
 *                                  _id:
 *                                    type: string
 *                                  name:
 *                                    type: string
 *                                  brand:
 *                                    type: string
 */




/**
 * @swagger
 * /order/extend:
 *   put:
 *     summary: Returns a message about success extending an order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                orderNumber:
 *                  type: number
 *                endTime:
 *                  type: string
 *                  format: date
 
 *     responses:
 *        400:
 *           description: Returns a message about invalid token or if order is not found
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns a message about no access to the route
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
 *           description: Returns a success message about extending an order
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
 * /order/cancel/{orderNumber}:
 *   delete:
 *     summary: Returns a message about canceling an order
 *     tags: [OrderRoutes]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: The order number
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
 *        403:
 *           description: Returns a message about no access to the route
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
 *           description: Returns a message about success canceled order
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *
 */




