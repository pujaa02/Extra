module.exports = {
    '/driver/adddriver/{user_id}': {
        get: {
            tags: ['Driver'],
            summary: 'add driver',
            produces: ['json'],
            parameters: [
                {
                    in: 'path',
                    name: 'user_id',
                    required: true,
                    type: 'integer',
                    description: 'user_id',
                },
            ],
            responses: {
                200: {
                    description: 'add driver',
                },
            },
        },
    },
    '/driver/removedriver/{driver_id}': {
        get: {
            tags: ['Driver'],
            summary: 'delete driver',
            produces: ['json'],
            parameters: [
                {
                    in: 'path',
                    name: 'driver_id',
                    required: true,
                    type: 'integer',
                    description: 'driver Id',
                },
            ],
            responses: {
                200: {
                    description: 'delete driver',
                },
            },
        },
    },
};
