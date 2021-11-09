const Dialog = require("../models/dialogs");
const User = require("../models/user");

module.exports = function (awss) {
  return (ws, req) => {
    ws.on("message", async (msg) => {
      msg = JSON.parse(msg);
      switch (msg.type) {
        case "userconnection":
          const user = await User.findOne({ _id: msg.userId });
          user.isOnline = true;
          await user.save();
          console.log("Все хорошо не ссы");
          ws.id = msg.userId;
          ws.role = msg.role;
          ws.send(
            JSON.stringify({
              type: "succesConnection",
              message: "У вас есть доступ к чату с админом",
            })
          );
          break;
        case "adminconnection": {
          ws.id = msg.id;
          ws.role = msg.role;
          const admin = await User.findOne({ _id: msg.id });
          admin.isOnline = true;
          await admin.save();
          ws.send(
            JSON.stringify({
              type: "successAdminConnection",
            })
          );
          awss.clients.forEach((user) => {
            if (user.id !== ws.id) {
              return (
                user.id !==
                user.send(
                  JSON.stringify({
                    type: "adminconnected",
                    message: "Админ присоединился,можете ",
                  })
                )
              );
            }
          });
          // if (msg.role === "admin") {
          //   awss.clients.forEach((client) => {});
          // }

          break;
        }

        case "dialogWithAdmin": {
          const dialog = await Dialog.findOne({ members: msg.id });
          const admin = await User.findOne({ role: "admin" });
          const createdAt = Date.now();
          if (!dialog) {
            const newDialog = await new Dialog({
              members: [admin._id, msg.id],
              messages: [
                {
                  author: msg.id,
                  message: msg.message,
                  createdAt,
                },
              ],
            });
            await newDialog.save();
          } else {
            dialog.messages.push({
              author: msg.id,
              message: msg.message,
              createdAt,
            });
            await dialog.save();
          }
          awss.clients.forEach((client) => {
            if (
              client.id === ws.id ||
              (client.id === admin._id && admin.isOnline)
            ) {
              console.log('Отправляю сообщение')
              return client.send(
                JSON.stringify({
                  type: "messageFromUser",
                  message: msg.message,
                  createdAt,
                })
              );
            }
          });
          break;
        }
        case "dialogWithUser": {
          const dialog = await Dialog.findOne({ members: msg.userId });
          const createdAt = Date.now();
          if (!dialog) {
            const newDialog = await new Dialog({
              members: [msg.userId, msg.adminId],
              messages: [
                {
                  author: msg.adminId,
                  message: msg.message,
                  createdAt,
                },
              ],
            });
            await newDialog.save();
          } else {
            dialog.messages.push({
              author: msg.adminId,
              message: msg.message,
              createdAt,
            });
            await dialog.save();
          }
          awss.clients.forEach((client) => {
            if (client.id === msg.adminId || client.id === msg.userId) {
              return client.send(
                JSON.stringify({
                  type: "messageFromAdmin",
                  message: msg.message,
                  createdAt,
                })
              );
            }
          });
        }
      }
    });

    ws.on("close", async () => {
      const user = await User.findOne({ _id: ws.id });
      user.isOnline = false;
      await user.save();
    });
  };
};
