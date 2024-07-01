"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = void 0;
const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
exports.TryCatch = TryCatch;
// export const TryCatch = (func:ControllerType) => {
//   return (req:Request,res:Response,next:NextFunction) => {
//     return Promise.resolve(func(req,res,next));
//   }
// }
