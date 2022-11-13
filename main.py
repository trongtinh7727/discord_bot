import discord
import cmd


class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as', self.user)

    async def on_message(self, message):
        # don't respond to ourselves
        if message.author == self.user:
            return

        # skip lesson
        if '>skip' == message.content:
            await message.author.send("Pls send: ```>skipLesson username password coureID``` to skip elearning-ability lesson")

        if '>skipLesson' in message.content:
            cmds = message.content.split()
            user = cmds[1]
            pwd = cmds[2]
            coure = cmds[3]
            cmd.skipLesson(user, pwd, coure)
            await message.author.send("Done coure: " + coure)

        # backup
        if (message.channel.id == int(930829886149500929)):
            if (message.content != ''):
                channel = client.get_channel(int(976396264646258698))
                await channel.send('**'+str(message.author)+'**: '+str(message.content))

        if '>history' in message.content:
            n = int(message.content.split()[1])
            his = [message async for message in message.channel.history(limit=n)]
            for i in his:
                await message.channel.send('**'+str(i.author)+'**:   '+str(i.content))

        if '>gem' in message.content:
            try:
                n = int(message.content.split()[1])
                his = [message async for message in message.channel.history(limit=n)]
                for i in his:
                    if "Gém#9617" == str(i.author):
                        await i.delete()
            except:
                await message.channel.send("cmd: `>gem 123` để xóa tin nhắn của gem trong 123 tin nhắn cuối của chanel")


intents = discord.Intents.default()
intents.message_content = True
client = MyClient(intents=intents)
client.run('OTA5ODQ2MDYxMzc4NTY4MjIy.GKZe0Y.uSpf7bODlRRRe7QS-pbygWGYs7F5NrZr6Z2hLo')
