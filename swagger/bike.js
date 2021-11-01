/**
 *@swagger
 * components:
 *    schemas:
 *      Bike:
 *       type: object
 *       required:
 *          - name
 *          - brand
 *          - price
 *       properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id by MongoDB
 *          name:
 *            type: string
 *            unique: true
 *          img:
 *            type: string
 *          brand:
 *            type: string
 *          isRented:
 *            type: boolean
 *            default: false
 *          rentedUntil:
 *            type: string
 *            format: date
 *          rentedAmount:
 *            type: number
 *            default: 0
 *          price:
 *            type: number
 *          color:
 *            type: string
 *          frameMaterial:
 *            type: string
 *          frameSize:
 *            type: number
 *          wheelsSize:
 *            type: number
 *
 */



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
 *   name: BikeRoutes
 *   description: Bike managing API
 */



/**
 * @swagger
 * /bike/add:
 *   post:
 *     summary: Adding a new bike to data base and returning a message about it
 *     tags: [BikeRoutes]
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
 *                brand:
 *                  type: string
 *                img:
 *                  type: string
 *                price:
 *                  type: number
 *                color:
 *                  type: string
 *                frameMaterial:
 *                  type: string
 *                frameSize:
 *                  type: number
 *                wheelsSize:
 *                  type: number
 *     responses:
 *        400:
 *           description: Returns an error message if bike exists or invalid token
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        403:
 *           description: Returns no access message, if you are not admin
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
 *           description: Returns a success message about adding new bike
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
 * /bike/getAll:
 *   get:
 *     summary: Returns all bikes
 *     tags: [BikeRoutes]
 *     responses:
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
 *           description: Returns a success message about adding new bike
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  bikes:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Bike'
 *
 *
 *
 *
 */



/**
 * @swagger
 * /bike/getFiltered:
 *   get:
 *     summary: Returns filtered bikes by parameters
 *     tags: [BikeRoutes]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *            type: string
 *         description: The name of brand
 *       - in: query
 *         name: wheelsSize
 *         schema:
 *            type: number
 *         description: The size of wheels
 *       - in: query
 *         name: frameSize
 *         schema:
 *            type: number
 *         description: The size of frame
 *       - in: query
 *         name: isRented
 *         schema:
 *            type: boolean
 *         description: Status of bike(rented or not)
 *     responses:
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
 *           description: Returns an array of filtered bikes
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  bikes:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Bike'
 *
 *
 *
 *
 */




