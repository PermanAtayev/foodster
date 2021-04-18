// router.delete('/users/deleteAll', auth, permission('deleteAllUsers'),
//     /*
//         #swagger.tags = ['User']
//         #swagger.description = 'Endpoint to delete all users'
//     */
//
//     async (req, res) => {
//         try {
//             await User.deleteMany({});
//             res.send("Successfully delete all users");
//         } catch (e) {
//             res.status(500).send(e + "");
//         }
//     })
//
//
// router.get('/users/list', auth, permission('userList'),
//     /*    #swagger.tags = ['User']
//       #swagger.description = 'Endpoint to get a list of users, requires authentication.'
//     */
//     async (req, res) => {
//         try {
//             const users = await User.find({});
//             console.log(users);
//             return res.status(200).send(users);
//         } catch (e) {
//             res.status(404).send(e + "");
//         }
//     })
//
