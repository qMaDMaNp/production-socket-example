import { Router } from 'express';

const router = Router();

router.get("/ping", (req, res) => res.status(200).json({ response: "pong" }));

router.get('/version', (req, res) => {
    res.send('0.0.1')
});

export default router;
