import { IUser } from './IUser';

require('dotenv');
import { Telegraf } from 'telegraf';
import  express = require('express');

const jwt = require('json-web-token');
const host = '127.0.0.1';
const port = 8000;
const redirectUrl = `http://localhost:3000/auth/telegram`;

const app: express.Application = express();

let bot = new Telegraf(process.env.TELEGRAM_BOT_KEY);
bot.start(ctx => {
  ctx.reply(`Hello ${ctx.from.first_name}`);
});

bot.command('/auth', ctx => {
  let user: IUser = ctx.from

  console.log(user);
  let token = jwt.encode(process.env.JWT_SECRET, JSON.stringify(user), "HS256",(err, token)=>{
    console.log('Token',token);
  });
  let keyboard: any[][] = [[
    {
      text: 'Login',
      login_url: {
        url: `${redirectUrl}?token=${token}`,
      },
    },
  ]];
  ctx.reply('You want to log in to the My Site?', {
    reply_markup: { inline_keyboard: keyboard },
  }).then(send => {
    //console.log('send', send, token);
  });
});
bot.startPolling();
bot.launch();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});

