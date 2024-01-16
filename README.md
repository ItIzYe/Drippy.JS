# JavaScript Bot for Discord 🤖

This Bot is a work in progress JavaScript version of our Python Bot [Drippy](https://github.com/ItIzYe/Va). The Prefix is `#`. Please remember NOT to import the `node_modules` Folder and to REPLACE the token placeholder with your token. If you want to contribute to this project, just fork it. I'll take a look at it and implement good ideas into the project. Have fun with it! See the [Drippy.JS Website](https://itizye.github.io/Drippy.JS/).

## Construction of Commands 🛠️

For our commands, we use the `callback` option rather than the `execute` option. A command should **ALWAYS** look like this:

```js
module.exports = {
    name: String,
    description: String,
    callback: async (client, interaction) => {
        // Code
    },
};
```


| Option    |                                                            desciption                                                             |
|-----------|:---------------------------------------------------------------------------------------------------------------------------------:|
| *devOnly* |          When set to `true`, only registered developers can use this Command. More about registering <a href="">here</a>          |
|*testOnly* | When set to `true`, the Command can only be used on the test-Server. More about registering a test-Server <a href="">here</a><br> |
|*deleted*           |        When set to `true`, the command gets removed from the active list without actually having to delete the source code        |

When finished creating a command, just restart the bot. **DO NOT CHANGE ANY CODE OTHER THAN CODE IN THE COMMAND FOLDER AND SELF-CREATED FOLDERS**

## Interaction Option Types 🔄
Please remember that InteractionOptionTypes are no longer given through keywords but through numbers. Following is a list of the numbers and what they stand for:
```js
1. SUB_COMMAND
2. SUB_COMMAND_GROUP
3. STRING
4. INTEGER
5. BOOLEAN
6. USER
7. CHANNEL
8. ROLE
9. MENTIONABLE
10. NUMBER
11. ATTACHMENT
```


## MongoDB -> Mongoose 📊
As we installed mongoose as our Database, please contact ItIzYe to request a login. Models have to look like this:

```js
const { Schema, model } = require('mongoose');

const PlaceholderConfigSchema = new Schema({
    placeholder: {
        type: String,
        default: "Not important",
        unique: true,
    }
});

module.exports = model('PlaceholderConfigSchema', PlaceholderConfigSchema);
```

Default can also be an empty array `[]`. Also, the type can vary. You can update values separately via:

```js
const newCustomId = new PlaceholderConfigSchema({
    placeholder: new_status,
});
await PlaceholderConfigSchema.updateOne();
```

## Command Folders 📁
Please note that if you have command sections that include two or more commands (e.g. Bug: bug.js, ``bugconfig.js`` which are concluded in ``src/commands/bugs``). This makes it easier for other devs to see through the structure of the bot.

## Use of Gifs 🎥
To use Gifs, use "open image in new tab" then copy the link from the search bar.

## Current Working Commands 💼
Kick Command
Ban Command
Clear Command
Info/Serverinfo
Help
Boost
Automod
Memberjoin/Guildjoin

## Currently Fixing Errors 🛠️
Quiz Command

## Currently Not Fully Usable 🚫
Channelset Command
Help Command

## Currently Working On 🚧
Fix Errors in Quiz Command
Complete Channelset Command
Fix Help Command

## Completed Commands ✅
Fix Errors in Clear Command
Update Bug Command
Create Suggestion Command


© 2024 @IIY Development and Partners
Code can be used with Credits






<h1>JavaScript Bot for Discord</h1>

This Bot is a work in progress JavaScript version of our Python Bot <a href='https://github.com/ItIzYe/Va'>Drippy</a>.
The Prefix is *#*. Please remember to NOT import the *node_modules* Folder and to REPLACE the token placeholder with your token. If you want to contribute on this project just fork it. I'll take a look at it and implement good Ideas into the project. Have fun with it!
See the Website <a href='https://itizye.github.io/Drippy.JS/'>Drippy.JS</a>

## Construction of Commands
For our commands we use the `callback` option rather than the `execute` option
a command should **ALWAYS** look like this:
```js
/** requires **/
module.exports = {
    name: String,
    description: String,
    // options: Object[],
    // devOnly: Boolean,
    // testOnly: true,
    // deleted: Boolean,

    callback: async (client, interaction) => {
        /** Code **/
    },
};
```
| Option    |                                                            desciption                                                             |
|-----------|:---------------------------------------------------------------------------------------------------------------------------------:|
| *devOnly* |          When set to `true`, only registered developers can use this Command. More about registering <a href="">here</a>          |
|*testOnly* | When set to `true`, the Command can only be used on the test-Server. More about registering a test-Server <a href="">here</a><br> |
|*deleted*           |        When set to `true`, the command gets removed from the active list without actually having to delete the source code        |

  
When finished creating a command, just restart the bot. **DO NOT CHANGE ANY CODE OTHER THAN CODE IN THE COMMAND FOLDER AND SELF-CREATED FOLDERS**


### Interaction Option Types
Please remember that *InteractionOptionTypes* are no longer given through keywords but through numbers. Following a list of the numbers and for what they stand:
```
SUB_COMMAND 1   
SUB_COMMAND_GROUP 2 
STRING 3    
INTEGER 4
BOOLEAN 5   
USER 6  
CHANNEL 7
ROLE 8  
MENTIONABLE 9
NUMBER 10
ATTACHMENT 11
```

## MongoDB -> Mongoose

as we installed mongoose as our Database, please contact ItIzYe to request a login.
Models have to look like this:
```js
const {Schema, model} = require('mongoose');

const PlaceholderConfigSchema = new Schema({
    placeholder: {
        type: String,
        //"Not important", "Important","Very important"
        default: "Not important",
        unique: true,
    }
});

module.exports = model('PlaceholderConfigSchema', PlaceholderConfigSchema)
```
default can also be an empty array *[]*. Also the type can vary

You can update values seperatley via:
```js
const newCustomId = new PlaceholderConfigSchema({
    placeholder: new_status,
    })
    await PlaceholderConfigSchema.updateOne();
```

## Command Folders
Please note that if you have command sections that include two or more commands (e.g. Bug: ```bug.js```,```bugconfig.js``` which are concluded in ```src/commands/bugs```). This makes it easier for other devs to see through the structure of the bot.


### Use of Gifs
To use Gifs, use ``open immage in new tag`` then copy link from the searchbar.


## Current working Commands
*- Kick Command*<br>
*- Ban Command*<br>
*- Clear Command*<br>
*- Info/Serverinfo*<br>
*-Help*<br>
*-Boost*<br>
*-Automod*<br>
*-Memberjoin/Guildjoin*<br>


## Currently Fixing Errors
*- Quiz Command*

## Currently not fully usable
*- Channelset Command*<br>
*- Help Command*

## Currently working on
- [ ] Fix Errors in Quiz Command
- [ ] Complete Channelset Command
- [ ] Fix Help Command

## Completed commands
- [x] Fix Errors in Clear Command
- [x] Update Bug Command
- [x] Create Suggestion Command
```
    ___     ___    ___       ___
   |   |   |   |   \  \     /  /
   |   |   |   |    \  \   /  /
   |   |   |   |     \  \ /  /
   |   |   |   |      \     /
   |   |   |   |       \   /
   |   |   |   |       |   |
   |   |   |   |       |   |
   |   |   |   |       |   |
   |___|   |___|       |___|

© 2024 @IIY Development and Partners
       Code can be used with
              Credits
```


