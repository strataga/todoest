import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A RESTful API for managing todos and categories',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            title: {
              type: 'string',
              description: 'Todo title',
              example: 'Complete project documentation',
            },
            description: {
              type: 'string',
              description: 'Todo description',
              example: 'Write comprehensive API documentation',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: false,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date (ISO 8601 format)',
              example: '2025-12-31T23:59:59.000Z',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated category ID',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2025-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
          required: ['id', 'title', 'completed', 'createdAt', 'updatedAt'],
        },
        CreateTodo: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Todo title',
              example: 'Complete project documentation',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Todo description',
              example: 'Write comprehensive API documentation',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: false,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date (ISO 8601 format)',
              example: '2025-12-31T23:59:59.000Z',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated category ID',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
          },
          required: ['title'],
        },
        UpdateTodo: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Todo title',
              example: 'Updated project documentation',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Todo description',
              example: 'Updated description',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: true,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date (ISO 8601 format)',
              example: '2025-12-31T23:59:59.000Z',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated category ID',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            name: {
              type: 'string',
              description: 'Category name',
              example: 'Work',
            },
            color: {
              type: 'string',
              description: 'Category color (HSL format)',
              example: 'hsl(152, 35%, 45%)',
            },
          },
          required: ['id', 'name', 'color'],
        },
        CreateCategory: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
              description: 'Category name',
              example: 'Work',
            },
            color: {
              type: 'string',
              description: 'Category color (HSL format)',
              example: 'hsl(152, 35%, 45%)',
            },
          },
          required: ['name', 'color'],
        },
        UpdateCategory: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
              description: 'Category name',
              example: 'Updated Work',
            },
            color: {
              type: 'string',
              description: 'Category color (HSL format)',
              example: 'hsl(200, 50%, 50%)',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Todos',
        description: 'Todo management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
