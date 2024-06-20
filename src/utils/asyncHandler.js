
const asyncHandler = (requestHandler) => { // Higher order function
    return (req, res, next) => 
    {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }



//Higher Order Function => Takes one or more functions as arguments.Returns a function as its result.
// const asyncHandler = () => {()}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
