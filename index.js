const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()
const {gameOptions, againOptions} = require('./options')

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling:true})

const chats = {}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId,'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать ')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
    {command:'/start', description:'Начальное приветствие'},
    {command:'/info', description:'Информация о боте'},
    {command:'/game', description:'Играть в игру'}
])

bot.on('message', async msg =>{
    const text = msg.text
    const chatId = msg.chat.id

    if(text === '/start'){
        await bot.sendMessage(chatId,`Добро пожаловать, ${msg.from.first_name} ${msg.from.last_name} a.k.a. ${msg.from.username}!`)
        return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/a40/23c/a4023c4e-0a09-4469-8d30-25585f8367c4/192/16.webp')
    }
    if(text === '/info'){
        return bot.sendMessage(chatId,'Я был создан 06.01.2023 в 16:26:54')
    }
    if(text === '/game'){
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)')
    
})
bot.on('callback_query', async msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id
    if(data === '/again'){
        return startGame(chatId)
    }
    if(data == chats[chatId]){
        return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else{
        return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
    
})
}

start()
