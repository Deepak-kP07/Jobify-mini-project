import { StatusCodes } from 'http-status-codes'
export class customAPIError extends Error{
    constructor(message){
        super(message)
        this.statusCode =message.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        this.name = 'customAPIError'
    }
}
export class NotFoundError extends Error {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
        this.name = 'NotFoundError'
    }
}

export class BadRequestError extends Error {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
        this.name = 'BadRequestError'
    }
}
export class UnauthenticatedError extends Error {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
        this.name = 'UnauthenticatedError'
    }
}
export class UnauthorizedError extends Error {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
        this.name = 'UnauthorizedError'
    }
}

