module.exports = {
    '/order/addorder/{user_id}/{restaurant_id}': {
        post: {
            tags: ['Order'],
            summary: 'Add order details',
            produces: ['json'],
            parameters: [
                {
                    in: 'path',
                    name: 'user_id',
                    required: true,
                    type: 'integer',
                    description: 'user_id',
                },
                {
                    in: 'path',
                    name: 'restaurant_id',
                    required: true,
                    type: 'integer',
                    description: 'restaurant_id',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_total: { type: 'number' },
                                delivery_status: { type: 'string' },
                                driver_id: { type: 'number' },
                            },
                            required: ['order_total', 'delivery_status', 'driver_id'],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Add order details',
                },
            },
        },
    },
    '/order/cancelorder/{user_id}/{restaurant_id}/{order_id}': {
        get: {
            tags: ['Order'],
            summary: 'cancel order',
            produces: ['json'],
            parameters: [
                {
                    in: 'path',
                    name: 'user_id',
                    required: true,
                    type: 'integer',
                    description: 'user_id',
                },
                {
                    in: 'path',
                    name: 'restaurant_id',
                    required: true,
                    type: 'integer',
                    description: 'restaurant_id',
                },
                {
                    in: 'path',
                    name: 'order_id',
                    required: true,
                    type: 'integer',
                    description: 'order Id',
                },
            ],
            responses: {
                200: {
                    description: 'cancel order',
                },
            },
        },
    },
}
