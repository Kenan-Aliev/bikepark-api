/**
 * @swagger
 * tags:
 *   name: FilterRoutes
 *   description: Filters managing API
 */


/**
 * @swagger
 * /filters/getAll:
 *   get:
 *     summary: Returns filters for bikes
 *     tags: [FilterRoutes]
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
 *           description: Returns an object with filters' arrays
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  brands:
 *                    type: array
 *                    items:
 *                      type: string
 *                  wheelsSizes:
 *                    type: array
 *                    items:
 *                      type: number
 *                  frameSizes:
 *                    type: array
 *                    items:
 *                      type: number    
 */