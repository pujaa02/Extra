import { Request, Response, Router } from "express";
import passport from "passport";
import { auth } from "../middlewares/auth";
import { userrouter } from "./user";
import { restaurantrouter } from "./restaurant";
import { menurouter } from "./menu";
import { driverrouter } from "./driver";
import { cartrouter } from "./cart";
import { orderrouter } from "./order";
import { ratingrouter } from "./rating";
import { userValidation } from "../validations/user";
import userController from "../controllers/user.controller";
import loginController from "../controllers/login.controller";
import { homerouter } from "./home";
import { chatrouter } from "./chat";
auth(passport)
export const router = Router();

router.use(
    '/v1/user',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    userrouter,
);

router.use(
    '/v1/restaurant',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    restaurantrouter,
);

router.use(
    '/v1/menu',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    menurouter,
);

router.use(
    '/v1/driver',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    driverrouter,
);

router.use(
    '/v1/cart',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    cartrouter,
);
router.use(
    '/v1/rating',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    ratingrouter,
);

router.use(
    '/v1/order',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    orderrouter,
);

router.use(
    '/v1/chat',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/login',
    }),
    chatrouter,
);

router.use(
    '/v1/home',
    homerouter,
);

router.use('/v1/login', loginController.login);
router.use('/v1/register', userValidation, userController.adduser);

router.use("/v1/updatepass",userController.updatepassword);

router.use('/dashboard', (req: Request, res: Response) => {
    res.json({ msg: 'welcome Please Login First' });
});
router.use('/v1/logout', (req: Request, res: Response) => {
    res.clearCookie('token').json('logout sucessfully');
});
