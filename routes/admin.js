import express from 'express';

const adminController = require('../controllers/admin.controller.js');

let router = express.Router();

router.get('/', adminController.index);

router.get('/manage_users', adminController.users);
router.delete('/manage_users/delete', adminController.deleteUser);
router.post('/manage_users/create', adminController.createUser);
router.post('/manage_users/update', adminController.updateUser);

router.get('/manage_vouchers', adminController.manageVouchers);
router.post('/manage_vouchers/create', adminController.createVoucher);
router.delete('/manage_vouchers/delete', adminController.deleteVoucher);

router.get('/password_wifi', adminController.wifiPassword);
router.get('/order_history', adminController.orderHistory);
router.get('/suspend_system', adminController.pauseSystem);
router.get('/start_system', adminController.startSystem);
router.get('/reset_wifi_pwd', adminController.resetWifiPassword);


module.exports = router;
